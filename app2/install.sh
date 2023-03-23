#!/bin/bash

WORKING_DIR=`realpath "$0"`
WORKING_DIR=`dirname "$WORKING_DIR"`
WORKING_DIR=${WORKING_DIR//\//\\/}
USER=`whoami`
GROUP=`id -gn "$USER"`
SERVICE_FILE=/lib/systemd/system/dro.service

# give python access to port 80
PYTHON_BIN=`which python3`
PYTHON_BIN=`realpath "$PYTHON_BIN"`
sudo setcap CAP_NET_BIND_SERVICE=+ep "$PYTHON_BIN"

# setup service
sudo cp dro.service "$SERVICE_FILE"
sudo sed -i "s/WORKING_DIR/$WORKING_DIR/" "$SERVICE_FILE"
sudo sed -i "s/USER/$USER/" "$SERVICE_FILE"
sudo sed -i "s/GROUP/$GROUP/" "$SERVICE_FILE"
sudo systemctl enable dro
sudo service dro restart
