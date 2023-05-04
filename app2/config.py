import asyncio
import os
import subprocess
import time
import yaml
import httpd
from threading import Event
from urllib.parse import urlsplit, urlunsplit, quote
from deepmerge import always_merger

__shutdown = Event()

CONFIG_FILES_PATH = os.getenv(
    'CONFIG_FILES_PATH',
    os.path.dirname(__file__)+'/config'
)
BACKUP_SYNC_INTERVAL = os.getenv('BACKUP_SYNC_INTERVAL', 600)

sections = {
    'config': {},
    'encoders': {},
    'cameras': {},
    'ui': {},
    'projects': [],
    'machines': [],
    'materials': [],
    'tools': [],
}
secrets = {}


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
    load_secrets()


def load_secrets():
    """ Load secrets config """
    try:
        with open(f'{CONFIG_FILES_PATH}/secrets.yaml', 'r') as f:
            global secrets
            secrets = yaml.safe_load(f)
            if not isinstance(secrets, dict):
                secrets = {}
    except:
        pass


def save_secrets(data):
    """ Save secrets config """
    with open(f'{CONFIG_FILES_PATH}/secrets.yaml', 'w') as f:
        data = always_merger.merge(secrets, data)
        yaml.dump(data, f)


def save(section, data=None):
    if section in sections:
        with open(f'{CONFIG_FILES_PATH}/{section}.yaml', 'w') as f:
            if data is None:
                data = sections[section]
            yaml.dump(data, f)


async def run():
    try:
        os.stat(f'{CONFIG_FILES_PATH}')
    except:
        os.mkdir(f'{CONFIG_FILES_PATH}')

    modified = {}
    backup_timestamp = time.monotonic()

    while not __shutdown.is_set():
        for section in sections.keys():
            mtime = modified.get(section, 0)
            try:
                st = os.stat(f'{CONFIG_FILES_PATH}/{section}.yaml')
                if st.st_mtime > mtime:
                    await load(section)
                    modified[section] = st.st_mtime
            except:
                pass

        mtime = modified.get('secrets', 0)
        try:
            st = os.stat(f'{CONFIG_FILES_PATH}/secrets.yaml')
            if st.st_mtime > mtime:
                load_secrets()
                modified['secrets'] = st.st_mtime
        except:
            pass

        if (backup_timestamp + BACKUP_SYNC_INTERVAL) < time.monotonic():
            backup_timestamp = time.monotonic()
            __run_backup_sync()

        await asyncio.sleep(0.5)


def stop():
    __shutdown.set()


def __run_backup_sync():
    from log import log, LOG_ERR, LOG_INFO

    cfg = secrets.get('backup', {})
    if not isinstance(cfg, dict):
        cfg = {}

    git = cfg.get('git')
    if isinstance(git, dict) and git.get('url', False):
        try:
            url = urlsplit(git.get('url'))
            username = git.get('username')
            password = git.get('password')
            branch = git.get('branch', 'config')

            if username and password and url.scheme == 'https':
                username = quote(username)
                password = quote(password)
                url = url._replace(
                    netloc=f'{username}:{password}@{url.netloc}'
                )

            env = {
                'URL': urlunsplit(url),
                'BRANCH': branch,
                'CONFIG_FILES_PATH': CONFIG_FILES_PATH
            }
            cmd = os.path.dirname(__file__)+'/sync-git.sh'

            r = subprocess.run(cmd, env=env, capture_output=True)
            if r.returncode != 0:
                data = {'stdout': r.stdout, 'stderr': r.stderr}
                log(LOG_ERR, 'backup-sync-git', data)
            else:
                log(LOG_INFO, 'backup-sync-git', 'OK')
        except Exception as e:
            log(LOG_ERR, 'backup-sync-git', e)
