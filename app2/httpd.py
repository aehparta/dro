import socketio
import config
from aiohttp import web
from threading import Event

HTTP_HOST = ''
HTTP_PORT = 8080

__routes = web.RouteTableDef()
__sio = socketio.AsyncServer(async_mode='aiohttp')
__shutdown = Event()


@__sio.event
async def connect(sid, environ):
    await emit('config', config.cfg, sid)
    await emit('materials', config.materials, sid)
    await emit('tools', config.tools, sid)


@__sio.event
async def offset(sid, data):
    try:
        machine = data['machine']
        axis = data['axis']
        offset = data['offset']
        config.cfg['machines'][machine]['axes'][axis]['offset'] = offset
        config.save_config()
    except:
        pass


@__routes.get('/')
async def index(_: web.Request):
    return web.FileResponse('./ui/base.html')


async def run():
    app = web.Application()
    __sio.attach(app)
    __routes.static('/ui', 'ui')
    __routes.static('/', 'public')
    app.add_routes(__routes)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, HTTP_HOST, HTTP_PORT)
    await site.start()


def stop():
    __shutdown.set()


async def emit(topic, data, to=None):
    await __sio.emit(topic, data, to)
