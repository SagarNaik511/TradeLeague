from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from django.utils.crypto import get_random_string

# ---------- AUTH ----------

@api_view(['POST'])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    s.save()
    return Response({"msg":"user created"})


# ---------- ROOM ----------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    code = get_random_string(6)
    room = GameRoom.objects.create(
        room_code=code,
        host=request.user,
        mode=request.data.get("mode","stock")
    )
    return Response(GameRoomSerializer(room).data)


@api_view(['GET'])
def list_rooms(request):
    rooms = GameRoom.objects.filter(status="waiting")
    return Response(GameRoomSerializer(rooms,many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_room(request, code):
    room = GameRoom.objects.get(room_code=code)
    room.opponent = request.user
    room.status = "active"
    room.save()
    return Response({"msg":"joined"})


# ---------- ASSETS ----------

@api_view(['GET'])
def assets(request):
    return Response(AssetSerializer(Asset.objects.all(),many=True).data)


# ---------- INVEST ----------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invest(request):
    Investment.objects.create(
        room_id=request.data["roomId"],
        player=request.user,
        asset_id=request.data["assetId"],
        amount=request.data["amount"]
    )

    return Response({"ok": True})


from django.db.models import F
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def leaderboard(request):
    qs = Profile.objects.select_related("user")\
        .order_by("-total_profit_counter")[:20]

    return Response([
        {
            "username": p.user.username,
            "profit": p.total_profit_counter,
            "league": p.league_level,
            "winStreak": p.win_streak
        }
        for p in qs
    ])


from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    p = request.user.profile
    return Response({
        "username": request.user.username,
        "profit": p.total_profit_counter,
        "league": p.league_level,
        "win_streak": p.win_streak,
        "games_played": p.games_played
    })

@api_view(['GET'])
def asset_detail(request, asset_id):
    a = Asset.objects.get(id=asset_id)
    return Response({
        "id": a.id,
        "name": a.name,
        "basePrice": a.base_price,
        "growthPercent": a.growth_percent,
        "news": a.info_news_text.split(";"),
        "risk": a.risk_level,
        "sector": a.sector
    })
from django.utils import timezone
from datetime import timedelta

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_game(request, room_id):
    room = GameRoom.objects.get(id=room_id)

    trade_end = timezone.now() + timedelta(minutes=3)

    assets = AssetSerializer(
        Asset.objects.all().order_by("?")[:6],
        many=True
    ).data

    return Response({
        "room": room.room_code,
        "startingBalance": 100000,
        "tradeEndTime": trade_end,
        "assets": assets
    })
