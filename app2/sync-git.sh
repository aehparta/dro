#!/bin/bash

CONFIG_FILES_PATH="config"
BACKUP_FILES="
config.yaml
encoders.yaml
machines.yaml
materials.yaml
projects.yaml
tools.yaml
ui.yaml
"
BACKUP_GIT_BRANCH="config"

error() {
    echo "$@" 1>&2
    exit 1
}

error_if() {
    if [ "$?" != "0" ]; then
        error "$@"
    fi
}

git --version > /dev/null
if [ "$?" != "0" ]; then
    error "git command is missing"
fi

if [ ! -f ".env" ]; then
    error ".env file is missing"
fi

source .env

# check for git variables
if [ "$BACKUP_GIT_URL" == "" ]; then
    error "backupt to git url is not set"
fi

# create config files directory (nothing done if it exists)
mkdir -p "$CONFIG_FILES_PATH"
if [ "$?" != "0" ]; then
    error "config files path is invalid"
fi
cd "$CONFIG_FILES_PATH"

# init repository
if [ ! -d ".git" ]; then
    git init --initial-branch="$BACKUP_GIT_BRANCH"
    git remote add origin "$BACKUP_GIT_URL"
    git fetch origin
fi
git checkout "$BACKUP_GIT_BRANCH"
git branch --set-upstream-to="origin/$BACKUP_GIT_BRANCH" "$BACKUP_GIT_BRANCH"

# pull
git pull origin "$BACKUP_GIT_BRANCH"

# add and push
for file in $BACKUP_FILES; do
    git add "$file"
done

git commit -m "config backup"
git push origin "$BACKUP_GIT_BRANCH"
error_if "Backup git push failed, check git sync"

