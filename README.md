# dro

## Application

When needs rights to port 80

One way:

```sh
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/python3.10
```

### Python dependencies

* httpd
* socketio

Install using pip:

```sh
pip3 install python-socketio aiohttp watchdog opencv-python
```

Or using apt:

```sh
apt install python3-socketio python3-aiohttp python3-watchdog python3-opencv
```
