from multiprocessing import Event, Queue, Process

SHUTDOWN_TIMEOUT = 3.0


class Interface:
    def __init__(self, id, cfg, queue: Queue):
        self.id = id
        self.cfg = cfg
        self._queue = queue
        self._shutdown = Event()
        self._process = None

    def run(self):
        # Implement
        pass

    def send(self, channel, value):
        self._queue.put((self.id, channel, value))

    def start(self):
        if not self._process or not self._process.is_alive():
            self._process = Process(target=self.run)
            self._process.start()

    def stop(self, timeout = SHUTDOWN_TIMEOUT):
        self._shutdown.set()
        if timeout and self._process and self._process.is_alive():
            self._process.join(timeout)

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, value):
        self.__dict__[key] = value
