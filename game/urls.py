from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="api_register"),
    path("rooms/", views.list_rooms, name="api_rooms"),
    path("create-room/", views.create_room, name="api_create_room"),
    path("join-room/<str:code>/", views.join_room, name="api_join_room"),
    path("assets/", views.assets, name="api_assets"),
    path("invest/", views.invest, name="api_invest"),
    path("leaderboard/", views.leaderboard, name="api_leaderboard"),
    path("me/", views.my_profile, name="api_me"),
    path("assets/<int:asset_id>/", views.asset_detail, name="api_asset_detail"),
    # path("how-to-play/", views.how_to_play, name="how_to_play"),
     
]
