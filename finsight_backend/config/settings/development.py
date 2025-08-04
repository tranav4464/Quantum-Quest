"""
Development settings for FinSight Backend
"""
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Database for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Additional development apps
INSTALLED_APPS += [
    # 'django_extensions',  # Temporarily disabled to fix startup issues
]

# Development middleware
MIDDLEWARE += []

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Static files for development
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Logging configuration for development
LOGGING['root']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['apps']['level'] = 'DEBUG'

# AI Configuration - Google Gemini API
GEMINI_API_KEY = 'AIzaSyD75z2P4cPm3OavxSZ2UvhKHKOwag3-KpI'

AI_CONFIG = {
    'max_tokens': 2048,
    'temperature': 0.7,
    'top_p': 0.9,
    'cache_timeout': 300,  # 5 minutes
    'rate_limit_per_user': 100,  # requests per hour
    'max_context_length': 10,  # conversation history length
}

# Django Channels Configuration for WebSocket - Temporarily disabled
# ASGI_APPLICATION = 'config.asgi.application'

# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [('127.0.0.1', 6379)],
#         },
#     },
# }

# Fallback to in-memory channel layer for development if Redis is not available
# try:
#     import redis
#     redis.Redis(host='127.0.0.1', port=6379, db=0).ping()
# except:
#     CHANNEL_LAYERS = {
#         'default': {
#             'BACKEND': 'channels.layers.InMemoryChannelLayer'
#         }
#     }

# ML Model Configuration
ML_MODEL_PATH = BASE_DIR / 'ml_models' / 'categorization'

# Channel Layers for WebSocket (requires Redis) - Temporarily disabled
# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             'hosts': [('127.0.0.1', 6379)],
#         },
#     },
# }

# ASGI Application for WebSocket support - Temporarily disabled
# ASGI_APPLICATION = 'config.asgi.application'
