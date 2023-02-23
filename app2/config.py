import asyncio
import os
import yaml
import httpd
from threading import Event

CONFIG_FILE = 'config.yaml'

__shutdown = Event()


cfg = {}


async def load():
    with open(CONFIG_FILE, 'r') as f:
        global cfg
        cfg = yaml.safe_load(f)
        await httpd.emit('config', cfg)


def save():
    with open(CONFIG_FILE, 'w') as f:
        yaml.dump(cfg, f)


async def run():
    modified = 0
    while not __shutdown.is_set():
        st = os.stat(CONFIG_FILE)
        if st.st_mtime > modified:
            await load()
            modified = st.st_mtime
        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()
