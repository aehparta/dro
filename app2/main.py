import signal
import asyncio
import httpd
import config
from threading import Event
from queue import Queue, Empty
from encoders import encoders


async def main():
    await asyncio.gather(config.run(), encoders.run(), httpd.run())


def sigint(sig, frame):
    encoders.stop()
    httpd.stop()
    config.stop()


if __name__ == '__main__':
    signal.signal(signal.SIGINT, sigint)
    asyncio.run(main())
