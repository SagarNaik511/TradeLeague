from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "backend running",
        "service": "fintech trading league api"
    })

urlpatterns = [
    path("admin/", admin.site.urls),

    # Move API health check away from root
    path("api/health/", health_check),

    # Frontend routes
    path("", include("game.urls_frontend")),

    # API routes
    path("api/", include("game.urls")),
]
