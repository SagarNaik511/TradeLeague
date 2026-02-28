from django.urls import path
from . import views

urlpatterns = [
    path("register/",views.register),
    path("rooms/",views.list_rooms),
    path("create-room/",views.create_room),
    path("join-room/<str:code>/",views.join_room),
    path("assets/",views.assets),
    path("invest/",views.invest),
    path("leaderboard/", views.leaderboard),
    path("me/", views.my_profile),
    path("assets/<int:asset_id>/", views.asset_detail),
    # path("how-to-play/", views.how_to_play, name="how_to_play"),
     
]
