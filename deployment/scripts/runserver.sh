#!/usr/bin/env sh

set -eux

export WEBPOLLS_DB_ENGINE="mysql"
export WEBPOLLS_DB_NAME=${MYSQL_DATABASE}
export WEBPOLLS_DB_HOST=${HOST}
export WEBPOLLS_DB_USER=${MYSQL_USER}
export WEBPOLLS_DB_PASSWORD=${MYSQL_PASSWORD}

python3 /srv/api/runserver.py
