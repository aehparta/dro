# dro

## Application

When needs rights to port 80

One way:

```sh
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/python3.10
```

## Dependencies

* v4l-utils (`v4l2-ctl` command)

Install all using apt:

```sh
apt install python3-socketio python3-aiohttp python3-watchdog python3-opencv python3-deepmerge v4l-utils
```

### Python

#### Dependencies

* aiohttp
* socketio
* watchdog
* opencv

Install using pip:

```sh
pip3 install python-socketio aiohttp watchdog opencv-python deepmerge
```

Or using apt:

```sh
apt install python3-socketio python3-aiohttp python3-watchdog python3-opencv python3-deepmerge
```

### Other

* `v4l2-ctl`
