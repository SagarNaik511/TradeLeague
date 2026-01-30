from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# simple root check endpoint
def root(request):
    return JsonResponse({
        "status": "backend running",
        "service": "fintech trading league api"
    })

urlpatterns = [
    # root health check
    path("", root),

    # admin panel
    path("admin/", admin.site.urls),

    # game app APIs
    path("api/", include("game.urls")),

    # JWT auth - placed under /api/ path
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("game.urls_frontend")),

]
