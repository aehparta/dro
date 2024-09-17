import multiprocessing
import os
import signal
import time
from log import log, LOG_DEBUG, LOG_NOTICE, LOG_ERR

SHUTDOWN_TIMEOUT = 3.0


class Process:
    def __init__(self, id: str, tag: str, cfg: dict, queue: multiprocessing.Queue):
        self.id = id
        self.__tag = tag
        self._cfg = cfg
        self.__queue = queue
        self._shutdown = multiprocessing.Event()
        self.__process = multiprocessing.Process(target=self.__run)

    def run():
        # implement
        pass

    def __run(self):
        signal.signal(signal.SIGINT, signal.SIG_IGN)
        self.log(LOG_DEBUG, f'started, pid: {os.getpid()}')
        try:
            self.run()
        except Exception as e:
            self.log(LOG_ERR, e)
        self.log(LOG_DEBUG, f'stopped, pid: {os.getpid()}')

    def start(self):
        if not self.__process.is_alive():
            self.__process.start()

    def stop(self, timeout=SHUTDOWN_TIMEOUT):
        self._shutdown.set()
        if timeout and self.__process.is_alive():
            self.__process.join(timeout)
            if self.__process.is_alive():
                self.log(
                    LOG_NOTICE, f'did not stop when requested, terminating')
                self.__process.terminate()

    def send(self, **kwargs):
        self.__queue.put({**kwargs, 'id': self.id})

    def pause(self, until_timestamp):
        if until_timestamp < time.monotonic():
            self.log(LOG_NOTICE, 'pause timestamp already reached')
        while until_timestamp > time.monotonic():
            time.sleep(0.01)

    def log(self, priority: int, data):
        log(priority, f'{self.__tag}-{self.id}', data)

    def has_changed(self, cfg: dict):
        """ Check if configuration has changed """
        return self._cfg != cfg

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, value):
        self.__dict__[key] = value
