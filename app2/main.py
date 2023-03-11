#!/usr/bin/env python3

import signal
import asyncio
import httpd
import config
import watch
from threading import Event
from queue import Queue, Empty
from encoders import encoders


async def main():
    await asyncio.gather(config.run(), encoders.run(), httpd.run(), watch.run())


def sigint(sig, frame):
    watch.stop()
    httpd.stop()
    encoders.stop()
    config.stop()


if __name__ == '__main__':
    signal.signal(signal.SIGINT, sigint)
    config.load_base()
    asyncio.run(main())
