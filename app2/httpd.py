import eventlet
import socketio

HTTP_HOST = ''
HTTP_PORT = 8080

sio = socketio.Server()


@sio.event
def connect(sid, environ):
    print('connect ', sid)


@sio.event
def my_message(sid, data):
    print('message ', data)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


def run():
    socket = eventlet.listen((HTTP_HOST, HTTP_PORT))
    app = socketio.WSGIApp(sio, static_files={
        '/': {'filename': 'public/index.html'},
        '/public': './public'
    })
    eventlet.wsgi.server(socket, app)

def emit(topic, data):
    sio.emit(topic, data)