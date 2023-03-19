import asyncio
import httpd
from config import sections
from queue import Empty
from encoders.dummy import Dummy
from encoders.serial_port import SerialPort
from multiprocessing import Event, Queue

ENCODERS = [
    Dummy, SerialPort
]

__shutdown = Event()
__encoders = {}
__queue = Queue()


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
            driver = klass(id, encoder, __queue)
            driver.start()
            __encoders[id] = driver

        # shutdown removed encoders
        for id in encoders_to_shutdown:
            __encoders[id].stop()
            del __encoders[id]

        try:
            data = __queue.get_nowait()
            id = data['id']
            channel = data['channel']
            value = data['value']
            if isinstance(channel, str) and channel.isdigit():
                channel = int(channel)
            __encoders[id][channel] = value
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
