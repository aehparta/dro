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
    for id, encoder in cfg['encoders'].items():
        klass = next(
            klass for klass in ENCODERS if klass.__name__ == encoder['driver'])
        driver = klass(id, encoder, __encoders_queue)
        driver.start()
        __encoders[driver.id] = driver

    while not __shutdown.is_set():
        try:
            (id, channel, value) = __encoders_queue.get_nowait()
            __encoders[id][int(channel)] = value
        except Empty:
            pass

        for id, machine in cfg['machines'].items():
            for axis_label, axis in machine['axes'].items():
                try:
                    value = eval(str(axis['value']), None, __encoders)
                except:
                    value = 'NaN'
                await httpd.emit('encoder', {'id': id, 'axis': axis_label, 'value': value})
        await asyncio.sleep(0.05)


def stop():
    for encoder in __encoders.values():
        encoder.stop()
    __shutdown.set()
