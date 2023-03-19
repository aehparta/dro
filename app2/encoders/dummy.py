import random
import time
from .interface import Interface


class Dummy(Interface):
    def run(self):
        while not self._shutdown.is_set():
            value = random.randint(1, 100) * 100
            if 'value' in self._cfg:
                value = eval(str(self._cfg['value']))
            self.send(channel=0, value=value)
            delay = self._cfg['delay'] if 'delay' in self._cfg else 1
            time.sleep(delay)
