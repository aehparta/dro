import socketio
import config
from aiohttp import web
from pathlib import Path
from threading import Event
from string import Template

__routes = web.RouteTableDef()
__sio = socketio.AsyncServer(async_mode='aiohttp')
__shutdown = Event()


@__sio.event
async def connect(sid, environ):
    await config.emit_all_to(sid)


@__sio.event
async def offset(sid, data):
    try:
        machine = data['machine']
        axis = data['axis']
        offset = data['offset']
        config.sections['machines'][machine]['axes'][axis]['offset'] = offset
        save('machines')
    except:
        pass


@__sio.event
async def save(sid, section, data):
    config.save(section, data)


@__routes.get('/')
async def index(_: web.Request):
    t = Template('<script type="text/x-template" id="$id">$content</script>')
    templates = []
    for file in Path('ui').rglob('*.html'):
        if str(file) == 'ui/base.html':
            continue
        with open(file) as f:
            id = str(file).removeprefix('ui/').removesuffix('.html')
            id = id.replace('/', '-')
            templates.append(t.substitute(id=f'tmpl-{id}', content=f.read()))

    with open('ui/base.html') as f:
        t = Template(f.read())
        content = t.substitute(templates='\n'.join(templates))

    response = web.Response(body=content, content_type='text/html')
    response.enable_compression()
    return response


@__routes.get('/css/site.all.css')
async def css(_: web.Request):
    content = ''
    for file in Path('ui').rglob('*.css'):
        with open(file) as f:
            content += f.read()
    response = web.Response(body=content, content_type='text/css')
    response.enable_compression()
    return response


async def run():
    app = web.Application()
    __sio.attach(app)
    __routes.static('/ui', 'ui')
    __routes.static('/', 'public')
    app.add_routes(__routes)

    runner = web.AppRunner(app)
    await runner.setup()

    host = config.base.get('host', '')
    port = config.base.get('port', 8080)
    site = web.TCPSite(runner, host, port)
    await site.start()


def stop():
    __shutdown.set()


async def emit(topic, data=None, to=None):
    await __sio.emit(topic, data, to)
