import aiohttp_jinja2
import jinja2
import socketio
from config import cfg
from aiohttp import web
from threading import Event

HTTP_HOST = ''
HTTP_PORT = 8080

__routes = web.RouteTableDef()
__sio = socketio.AsyncServer(async_mode='aiohttp')
__shutdown = Event()


# @__sio.event
# def my_message(sid, data):
#     print('message ', data)


@__routes.get('/')
@aiohttp_jinja2.template("base.html")
async def index(_: web.Request):
    return {}


async def run():
    app = web.Application()
    __sio.attach(app)
    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('ui/templates'))

    __routes.static('/', 'public')
    app.add_routes(__routes)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, HTTP_HOST, HTTP_PORT)
    await site.start()


def stop():
    __shutdown.set()


async def emit(topic, data):
    await __sio.emit(topic, data)
