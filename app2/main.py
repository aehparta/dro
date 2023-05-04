#!/usr/bin/env python3

import signal
import asyncio
import httpd
import config
import watch
from threading import Event
from queue import Queue, Empty
from encoders import encoders
from cameras import cameras


async def main():
    await config.load_all()
    await asyncio.gather(config.run(),
                         encoders.run(),
                         httpd.run(),
                         watch.run(),
                         cameras.run())


def sigint(sig, frame):
    cameras.stop()
    watch.stop()
    httpd.stop()
    encoders.stop()
    config.stop()


if __name__ == '__main__':
    signal.signal(signal.SIGINT, sigint)
    asyncio.run(main())
