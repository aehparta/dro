import random
import time
from .interface import Interface
import os


class Dummy(Interface):
    def run(self):
        while not self._shutdown.is_set():
            value = random.randint(1, 100) * 100
            if 'value' in self.cfg:
                value = eval(str(self.cfg['value']))
            self.send(0, value)
            delay = self.cfg['delay'] if 'delay' in self.cfg else 1
            time.sleep(delay)
