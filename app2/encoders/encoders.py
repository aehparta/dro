from threading import Event
import asyncio
import httpd
from config import cfg
from queue import Queue, Empty
from encoders.dummy import Dummy
from encoders.serial_port import SerialPort

ENCODERS = [
    Dummy, SerialPort
]

__encoders = {}
__encoders_queue = Queue()
__shutdown = Event()


async def run():
    for encoder in cfg['encoders']:
        klass = next(
            klass for klass in ENCODERS if klass.__name__ == encoder['driver'])
        driver = klass(encoder, __encoders_queue)
        driver.start()
        __encoders[driver.id] = driver

    while not __shutdown.is_set():
        try:
            (id, channel, value) = __encoders_queue.get_nowait()
            __encoders[id][int(channel)] = value
        except Empty:
            pass

        for machine in cfg['machines']:
            for name, encoder in machine['encoders'].items():
                try:
                    value = eval(str(encoder['value']), None, __encoders)
                except:
                    value = 'NaN'
                await httpd.emit('encoder', {'id': machine['name'], 'channel': name, 'value': value})
        await asyncio.sleep(0.001)


def stop():
    for encoder in __encoders.values():
        encoder.stop()
    __shutdown.set()
