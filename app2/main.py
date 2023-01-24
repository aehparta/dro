from threading import Thread
import time
import yaml
import random
from queue import Queue, Empty

import httpd
from encoders.dummy import Dummy
from encoders.serial_port import SerialPort

CONFIG_FILE = 'config.yaml'
ENCODERS = [
    Dummy, SerialPort
]

if __name__ == '__main__':
    with open(CONFIG_FILE, 'r') as f:
        cfg = yaml.safe_load(f)

    encoders_queue = Queue()
    encoders = {}

    for encoder in cfg['encoders']:
        klass = next(
            klass for klass in ENCODERS if klass.__name__ == encoder['driver'])
        driver = klass(encoder, encoders_queue)
        driver.start()
        encoders[driver.id] = driver

    t = Thread(target=httpd.run)
    t.start()

    while True:
        try:
            (id, channel, value) = encoders_queue.get_nowait()
            encoders[id][int(channel)] = value
        except Empty:
            pass

        for machine in cfg['machines']:
            line = '\r' + machine['name'] + ': '
            for name, encoder in machine['encoders'].items():
                try:
                    value = eval(str(encoder['value']), None, encoders)
                except:
                    value = 'NaN'
                line += f'{name}={value} '
            print(line, end='')
            # httpd.emit('encoder', {'id': machine['name'], 'channel': name, 'value': value})
        time.sleep(1)
