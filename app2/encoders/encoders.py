from multiprocessing import Event, Queue
import asyncio
import httpd
from config import sections
from queue import Empty
from encoders.dummy import Dummy
from encoders.serial_port import SerialPort
import os

ENCODERS = [
    Dummy, SerialPort
]

__encoders = {}
__encoders_queue = Queue()
__shutdown = Event()


async def run():
    while not __shutdown.is_set():
        encoders_to_shutdown = [*__encoders]

        # start added encoders
        for id, encoder in sections['encoders'].items():
            if id in encoders_to_shutdown:
                encoders_to_shutdown.remove(id)
            if id in __encoders:
                continue
            
            klass = next(
                klass for klass in ENCODERS if klass.__name__ == encoder['driver'])
            driver = klass(id, encoder, __encoders_queue)
            driver.start()
            __encoders[id] = driver

        # shutdown removed encoders
        for id in encoders_to_shutdown:
            __encoders[id].stop()
            del __encoders[id]

        try:
            (id, channel, value) = __encoders_queue.get_nowait()
            __encoders[id][int(channel)] = value
        except Empty:
            pass

        for machine in sections['machines']:
            for axis_id, axis in machine['axes'].items():
                try:
                    value = eval(str(axis['value']), None, __encoders)
                except:
                    value = 'NaN'
                await httpd.emit(f'encoder.{machine["id"]}.{axis_id}', value)

        await asyncio.sleep(0.05)

    for encoder in __encoders.values():
        encoder.stop()


def stop():
    __shutdown.set()
