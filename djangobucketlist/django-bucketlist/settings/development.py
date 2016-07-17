#!/usr/bin/python
# -*- coding: utf-8 -*-

from .base import *
import sys

if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'testdatabase',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'bucketlist', # Enter your database's name
            'USER': 'postgres', # Enter your DB user
            'PASSWORD': '', # Enter your DB password
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }
