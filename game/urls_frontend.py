from django.urls import path
from . import views_frontend as v

urlpatterns = [
    path("", v.intro, name="intro"),
    path("login/", v.login_view, name="login"),
    path("register/", v.register_view, name="register"),
    path("logout/", v.logout_view, name="logout"),
    path("dashboard/", v.dashboard, name="dashboard"),
    path("lobby/", v.lobby, name="lobby"),
    path("create-room/", v.create_room_view, name="create_room"),
    path("waiting/<int:room_id>/", v.waiting_room, name="waiting"),
    path("game/<int:room_id>/", v.game_board, name="game_board"),
    path("asset/<int:asset_id>/<int:room_id>/", v.asset_detail, name="asset_detail"),
    path("result/<int:room_id>/", v.result_view, name="result"),
]
