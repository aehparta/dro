import asyncio
import httpd
from multiprocessing import Event, Queue
from pathlib import Path
from queue import Empty
from .camera import Camera
from config import sections

__shutdown = Event()
__cameras = {}
__queue = Queue()


async def run():
    while not __shutdown.is_set():
        cameras_to_shutdown = [*__cameras]
        for id in Path('/dev').glob('video*'):
            id = str(id)
            cfg = sections['cameras'].get(id, {})

            if not cfg.get('enabled', True):
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
                await httpd.emit('camera', data)
        except Empty:
            pass

        await asyncio.sleep(0.05)

    for camera in __cameras.values():
        camera.stop()


def stop():
    __shutdown.set()
