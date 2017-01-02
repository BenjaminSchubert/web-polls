#!/usr/bin/env python2
# -*- coding: utf-8 -*-


"""
Deploy script for the WebPools application
"""


import os

# noinspection PyUnresolvedReferences
from fabric.api import lcd, local
# noinspection PyUnresolvedReferences
from fabric.colors import blue, green
# noinspection PyUnresolvedReferences
from fabric.state import output, env


__author__ = "Benjamin Schubert <ben.c.schubert@gmail.com>"


env.colorize_errors = True

output.running = False

LOCAL_PATH = os.path.dirname(os.path.abspath(__file__))
LOCAL_BACKEND = os.path.join(LOCAL_PATH, "backend")
LOCAL_FRONTEND = os.path.join(LOCAL_PATH, "frontend")


def start_section(section, color=blue):
    print(color(section))
    print(color("-" * 50))


def stop_section(color=blue):
    print(color("-") * 50)


def lint_frontend():
    """
    Runs configured linters on the frontend
    """
    with lcd(LOCAL_FRONTEND):
        start_section("linting app")
        local("npm run -s lint")
        stop_section()


def lint_backend():
    """
    Runs configured linters on the backend
    """
    with lcd(LOCAL_BACKEND):
        start_section("linting backend")
        local("prospector")
        stop_section()


def lint():
    """
    Runs all linters on the whole project
    """
    start_section("linting project", green)
    lint_frontend()
    lint_backend()
    stop_section(green)
