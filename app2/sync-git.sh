#!/bin/bash

: ${BACKUP_FILES:="
config.yaml
encoders.yaml
machines.yaml
materials.yaml
projects.yaml
tools.yaml
ui.yaml
"}

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

# check for variables
if [ "$URL" == "" ]; then
    error "git url is not set"
fi
if [ "$BRANCH" == "" ]; then
    error "git backup branch is not set"
fi
if [ "$CONFIG_FILES_PATH" == "" ]; then
    error "config files path is not set"
fi

# create config files directory (nothing done if it exists)
mkdir -p "$CONFIG_FILES_PATH"
if [ "$?" != "0" ]; then
    error "config files path is invalid"
fi
cd "$CONFIG_FILES_PATH"

# init repository
if [ ! -d ".git" ]; then
    git init --initial-branch="$BRANCH"
    git remote add origin "$URL"
    git fetch origin
fi
git checkout "$BRANCH"
git branch --set-upstream-to="origin/$BRANCH" "$BRANCH"

# pull
git pull origin "$BRANCH"

# add and push
for file in $BACKUP_FILES; do
    git add "$file"
done

git commit -m "config backup"
git push origin "$BRANCH"
error_if "Backup git push failed, check git sync"

