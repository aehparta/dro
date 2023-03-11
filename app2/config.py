import asyncio
import os
import yaml
import httpd
from threading import Event

__shutdown = Event()

base = {}
sections = {
    'ui': {},
    'projects': {},
    'encoders': {},
    'machines': {},
    'materials': [],
    'tools': []
}


async def emit_all_to(sid):
    for section, data in sections.items():
        await httpd.emit(section, data, sid)


async def load(section):
    try:
        with open(f'{section}.yaml', 'r') as f:
            sections[section] = yaml.safe_load(f)
            await httpd.emit(section, sections[section])
    except:
        pass

async def load_all():
    for section in sections.keys():
        await load(section)


def save(section, data=None):
    with open(f'{section}.yaml', 'w') as f:
        if data is None:
            data = sections[section]
        yaml.dump(data, f)


def load_base():
    """ Load base config """
    try:
        with open('config.yaml', 'r') as f:
            global base
            base = yaml.safe_load(f)
            if not isinstance(base, dict):
                base = {}
    except:
        pass


async def run():
    modified = {}

    while not __shutdown.is_set():
        for section in sections.keys():
            mtime = modified.get(section, 0)
            st = os.stat(f'{section}.yaml')
            if st.st_mtime > mtime:
                await load(section)
                modified[section] = st.st_mtime

        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()
