from django.contrib import admin
from django.urls import path, include, reverse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

def health_check(request):
    return JsonResponse({
        "status": "backend running",
        "service": "fintech trading league api"
    })


@api_view(["GET"])
def api_root(request):
    """Browsable entry point for TradeLeague's existing REST endpoints."""
    endpoint_names = (
        "api_assets",
        "api_rooms",
        "api_leaderboard",
        "api_register",
        "api_me",
        "api_create_room",
        "api_invest",
    )
    return Response({
        name.removeprefix("api_"): request.build_absolute_uri(reverse(name))
        for name in endpoint_names
    })

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),

    # Move API health check away from root
    path("api/health/", health_check),

    # Frontend routes
    path("", include("game.urls_frontend")),

    # API routes
    path("api/", api_root, name="api_root"),
    path("api/", include("game.urls")),
]
