import asyncio
import os
import subprocess
import time
import yaml
import httpd
from threading import Event
from syslog import LOG_ERR, LOG_INFO

__shutdown = Event()

CONFIG_FILES_PATH = os.getenv(
    'CONFIG_FILES_PATH',
    os.path.dirname(__file__)+'/config'
)
BACKUP_SYNC_INTERVAL = os.getenv('BACKUP_SYNC_INTERVAL', 3)

base = {}
sections = {
    'encoders': {},
    'ui': {},
    'projects': [],
    'machines': [],
    'materials': [],
    'tools': []
}


async def emit_all_to(sid):
    for section, data in sections.items():
        await httpd.emit(section, data, sid)


async def load(section):
    try:
        with open(f'{CONFIG_FILES_PATH}/{section}.yaml', 'r') as f:
            sections[section] = yaml.safe_load(f)
            await httpd.emit(section, sections[section])
    except:
        pass


async def load_all():
    for section in sections.keys():
        await load(section)


def save(section, data=None):
    with open(f'{CONFIG_FILES_PATH}/{section}.yaml', 'w') as f:
        if data is None:
            data = sections[section]
        yaml.dump(data, f)


def load_base():
    """ Load base config """
    try:
        with open(f'{CONFIG_FILES_PATH}/config.yaml', 'r') as f:
            global base
            base = yaml.safe_load(f)
            if not isinstance(base, dict):
                base = {}
    except:
        pass


async def run():
    modified = {}
    backup_timestamp = time.monotonic()

    while not __shutdown.is_set():
        mtime = modified.get('base', 0)
        try:
            st = os.stat(f'{CONFIG_FILES_PATH}/config.yaml')
            if st.st_mtime > mtime:
                load_base()
                modified['base'] = st.st_mtime
        except:
            pass

        for section in sections.keys():
            mtime = modified.get(section, 0)
            try:
                st = os.stat(f'{CONFIG_FILES_PATH}/{section}.yaml')
                if st.st_mtime > mtime:
                    await load(section)
                    modified[section] = st.st_mtime
            except:
                pass

        if (backup_timestamp + BACKUP_SYNC_INTERVAL) < time.monotonic():
            backup_timestamp = time.monotonic()
            __run_backup_sync()

        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()


def __run_backup_sync():
    from log import log

    # if not isinstance(base.get('backup'), dict):
    #     return

    # backup = base.get('backup', {})

    # if backup.get('git', False):

    log(LOG_ERR, 'backup-sync-git', {'stderr': 'stderr', 'stdout': 'stdout'})
    log(LOG_INFO, 'backup-sync-git', 'OK')

    return

    cmd = os.path.dirname(__file__)+'/sync-git.sh'
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        data = {'stdout': r.stdout, 'stderr': r.stderr}
        log(LOG_ERR, 'backup-sync-git', data)
    else:
        log(LOG_INFO, 'backup-sync-git', 'OK')
