from multiprocessing import Queue
from process import Process

SHUTDOWN_TIMEOUT = 3.0


class Interface(Process):
    def __init__(self, id: str, cfg: dict, queue: Queue):
        super().__init__(id, 'encoder', cfg, queue)
