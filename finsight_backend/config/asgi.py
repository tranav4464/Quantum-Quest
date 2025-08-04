"""
ASGI config for FinSight Backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Initialize Django ASGI application early to ensure apps are loaded
django_asgi_app = get_asgi_application()

# Import routing after Django is initialized
try:
    from apps.chat.routing import websocket_urlpatterns
except ImportError:
    # If chat app doesn't exist yet, use empty routing
    websocket_urlpatterns = []

application = ProtocolTypeRouter({
    # HTTP requests
    'http': django_asgi_app,
    
    # WebSocket requests
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
