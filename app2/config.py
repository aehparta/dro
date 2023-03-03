import asyncio
import os
import yaml
import httpd
from threading import Event

__shutdown = Event()


config = {
    'ui': {},
    'projects': {},
    'encoders': {},
    'machines': {},
    'materials': [],
    'tools': []
}


async def emit_all_to(sid):
    for section, data in config.items():
        await httpd.emit(section, data, sid)


async def load(section):
    with open(f'{section}.yaml', 'r') as f:
        config[section] = yaml.safe_load(f)
        await httpd.emit(section, config[section])


async def load_all():
    for section in config.keys():
        await load(section)


def save(section, data=None):
    with open(f'{section}.yaml', 'w') as f:
        if data is None:
            data = config[section]
        yaml.dump(data, f)


async def run():
    modified = {}

    while not __shutdown.is_set():
        for section in config.keys():
            mtime = modified[section] if section in modified else 0
            st = os.stat(f'{section}.yaml')
            if st.st_mtime > mtime:
                await load(section)
                modified[section] = st.st_mtime

        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()
