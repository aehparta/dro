from queue import Queue
from threading import Event, Thread

SHUTDOWN_TIMEOUT = 3.0


class Interface:
    def __init__(self, cfg, queue: Queue):
        self.id = cfg['id']
        self.cfg = cfg
        self._queue = queue
        self._shutdown = Event()
        self._thread = None

    def run(self):
        # Implement
        pass

    def send(self, channel, value):
        self._queue.put((self.id, channel, value))

    def start(self):
        if not self._thread or not self._thread.is_alive:
            self._thread = Thread(target=self.run)
            self._thread.start()

    def stop(self):
        self._shutdown.set()
        if self._thread and self._thread.is_alive:
            self._thread.join(SHUTDOWN_TIMEOUT)

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, value):
        self.__dict__[key] = value
