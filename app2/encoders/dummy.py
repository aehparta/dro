import random
import time
from .interface import Interface


class Dummy(Interface):
    def run(self):
        while True:
            value = random.randint(1, 100) * 100
            if 'value' in self.cfg:
                value = eval(str(self.cfg['value']))
            self.send(0, value)
            time.sleep(0.1)
