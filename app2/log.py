
from datetime import datetime
import syslog
from syslog import (LOG_EMERG, LOG_ALERT, LOG_CRIT, LOG_ERR,
                    LOG_WARNING, LOG_NOTICE, LOG_INFO, LOG_DEBUG)

syslog.openlog('dro')

PRIORITY_TO_STR = {
    LOG_EMERG: 'EMERGENCY',
    LOG_ALERT: 'ALERT',
    LOG_CRIT: 'CRITICAL',
    LOG_ERR: 'ERROR',
    LOG_WARNING: 'WARNING',
    LOG_NOTICE: 'NOTICE',
    LOG_INFO: 'INFO',
    LOG_DEBUG: 'DEBUG'
}


def log(priority, tag, data):
    from config import base

    cfg = base.get('log', {})
    if not isinstance(cfg, dict):
        cfg = {}

    t = datetime.utcnow().isoformat()
    msg = f'{tag}: {data}'

    if cfg.get('syslog', False):
        syslog.syslog(priority, msg)

    if cfg.get('stdout', False):
        print(f'{t}:{PRIORITY_TO_STR[priority]}:{msg}')
