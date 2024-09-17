import asyncio
import subprocess
import httpd
from threading import Event
from queue import Queue, Empty
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from log import log, LOG_ERR

__observer = Observer()
__shutdown = Event()
_queue = Queue()


async def run():
    handler = ObserverHandler()
    __observer.schedule(handler, 'ui', recursive=True)
    __observer.start()

    while not __shutdown.is_set():
        try:
            await httpd.emit('reload', _queue.get_nowait())
        except Empty:
            pass
        await asyncio.sleep(0.1)


def stop():
    __observer.stop()
    __shutdown.set()


class ObserverHandler(FileSystemEventHandler):
    @staticmethod
    def on_any_event(event):
        if not event.is_directory and event.event_type == 'modified':
            if event.src_path.endswith('.scss'):
                try:
                    cmd = ['sass', '--update', '--sourcemap=none', 'ui:ui']
                    r = subprocess.run(cmd, capture_output=True)
                    if r.returncode != 0:
                        data = {'stdout': r.stdout, 'stderr': r.stderr}
                        log(LOG_ERR, 'sass', data)
                except Exception as e:
                    log(LOG_ERR, 'sass', e)
            else:
                _queue.put(event.src_path)
