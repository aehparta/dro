import asyncio
import re
import subprocess
import httpd
from multiprocessing import Event, Queue
from queue import Empty
from .camera import Camera
from config import sections
from log import log, LOG_ERR

SCAN_CAMERAS_INTERVAL = 2
SCAN_CAMERAS_INTERVAL_ON_ERROR = 300

camera_subscribers = {}
__shutdown = Event()
__cameras = {}
__queue = Queue()
__pattern = re.compile(r'^(.*):$\s+(\/dev\/video[0-9]+)$', re.M)
__cameras_found = []


async def run():
    await asyncio.gather(__run(), __scan_cameras())


def stop():
    __shutdown.set()


async def __run():
    while not __shutdown.is_set():
        cameras_to_shutdown = [*__cameras]

        for (_, id) in __cameras_found.copy():
            cfg = sections['cameras'].get(id, {})

            if not cfg.get('enabled', True):
                continue
            if id not in camera_subscribers.values():
                continue

            if id in cameras_to_shutdown:
                if not __cameras[id].has_changed(cfg):
                    cameras_to_shutdown.remove(id)
            if id in __cameras:
                continue

            __cameras[id] = Camera(id, cfg, __queue)
            __cameras[id].start()

        for id in cameras_to_shutdown:
            __cameras[id].stop(0)
            del __cameras[id]

        try:
            while data := __queue.get_nowait():
                await httpd.emit(f'camera-{data["id"]}', data)
        except Empty:
            pass

        await asyncio.sleep(0.05)

    for camera in __cameras.values():
        camera.stop()


async def __scan_cameras():
    while not __shutdown.is_set():
        try:
            r = subprocess.run(
                ['v4l2-ctl', '--list-devices'], capture_output=True)
            stdout = r.stdout.decode('utf-8')

            global __cameras_found
            __cameras_found = re.findall(__pattern, stdout)

            cams = []
            for cam in __cameras_found:
                cams.append({'id': cam[1], 'label': cam[0]})
            await httpd.emit('cameras', cams)

            await asyncio.sleep(SCAN_CAMERAS_INTERVAL)
        except Exception as e:
            log(LOG_ERR, "cameras", f'failed to scan cameras, reason: {e}')
            await asyncio.sleep(SCAN_CAMERAS_INTERVAL_ON_ERROR)
