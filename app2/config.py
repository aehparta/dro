import asyncio
import os
import yaml
import httpd
from threading import Event

CONFIG_FILE = 'config.yaml'
MATERIALS_FILE = 'materials.yaml'
TOOLS_FILE = 'tools.yaml'

__shutdown = Event()


cfg = {}
materials = {}
tools = {}


def load(file):
    with open(file, 'r') as f:
        return yaml.safe_load(f)


async def load_config():
    global cfg
    cfg = load(CONFIG_FILE)
    await httpd.emit('config', cfg)


async def load_materials():
    global materials
    materials = load(MATERIALS_FILE)
    await httpd.emit('materials', materials)


async def load_tools():
    global tools
    tools = load(TOOLS_FILE)
    await httpd.emit('tools', tools)


def save(data, file):
    with open(file, 'w') as f:
        yaml.dump(data, f)


def save_config():
    save(cfg, CONFIG_FILE)


def save_materials():
    save(materials, MATERIALS_FILE)


def save_tools():
    save(tools, TOOLS_FILE)


async def run():
    modified_config = 0
    modified_materials = 0
    modified_tools = 0
    while not __shutdown.is_set():
        st = os.stat(CONFIG_FILE)
        if st.st_mtime > modified_config:
            await load_config()
            modified_config = st.st_mtime
        st = os.stat(MATERIALS_FILE)
        if st.st_mtime > modified_materials:
            await load_materials()
            modified_materials = st.st_mtime
        st = os.stat(TOOLS_FILE)
        if st.st_mtime > modified_tools:
            await load_tools()
            modified_tools = st.st_mtime
        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()
