import signal
import asyncio
import httpd
from encoders import encoders
from threading import Event
from queue import Queue, Empty


async def main():
    await asyncio.gather(encoders.run(), httpd.run())


def sigint(sig, frame):
    encoders.stop()
    httpd.stop()


if __name__ == '__main__':
    signal.signal(signal.SIGINT, sigint)
    asyncio.run(main())
