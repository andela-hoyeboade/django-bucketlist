# Production specific settings
from .base import *
# Parse database configuration from $DATABASE_URL
import dj_database_url
import os

DEBUG = False

DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

BOWER_PATH = '/app/node_modules/bower'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']
