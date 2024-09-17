import time
import serial
from .interface import Interface


class SerialPort(Interface):
    def run(self):
        ser = serial.Serial(self._cfg['port'], self._cfg['baudrate'], timeout=1)

        while not self._shutdown.is_set():
            line = ser.readline()
            if len(line) > 0:
                try:
                    (channel, value) = line.decode().split(':')
                    # print(f'{channel.strip()}={value.strip()}')
                    self.send(channel=channel.strip(), value=int(value.strip()))
                except:
                    pass
            # value = random.randint(1, 100) * 100
            # if 'value' in self._cfg:
            #     value = eval(str(self._cfg['value']))
            # self.send(channel=0, value=value)
            # delay = self._cfg['delay'] if 'delay' in self._cfg else 1
            # time.sleep(0.001)
