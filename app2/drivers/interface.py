from queue import Queue
from threading import Event, Thread

SHUTDOWN_TIMEOUT = 3.0


class Interface:
    def __init__(self, id, cfg, queue: Queue):
        self._shutdown = Event()
        self._thread = None
        self._queue = queue

    def start(self):
        # Implement this
        pass

    def stop(self):
        self._shutdown.set()
        if self._thread and self._thread.is_alive:
            self._thread.join(SHUTDOWN_TIMEOUT)
