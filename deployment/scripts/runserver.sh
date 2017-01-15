#!/usr/bin/env sh

set -eux

export DATABASE_ENGINE="mysql"
export DATABASE_NAME=${MYSQL_DATABASE}
export DATABASE_HOST=${HOST}
export DATABASE_USER=${MYSQL_USER}
export DATABASE_PASSWORD=${MYSQL_PASSWORD}

python3 /srv/api/runserver.py
