from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timedelta

from .forms import *
from .models import *
from .analysis import analyze


# ---------- INTRO ----------

def intro(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    return render(request, "intro.html")


# ---------- AUTH ----------

def register_view(request):
    form = RegisterForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password"])
        user.save()  # profile created via signal
        return redirect("login")
    return render(request, "register.html", {"form": form})


def login_view(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        user = authenticate(
            username=form.cleaned_data["username"],
            password=form.cleaned_data["password"]
        )
        if user:
            login(request, user)
            return redirect("dashboard")
    return render(request, "login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("login")


# ---------- DASHBOARD ----------

@login_required
def dashboard(request):
    profile = request.user.profile
    leaders = Profile.objects.order_by("-total_profit_counter")[:10]

    return render(request, "dashboard.html", {
        "profile": profile,
        "leaders": leaders
    })


# ---------- LOBBY ----------

@login_required
def lobby(request):
    rooms = GameRoom.objects.filter(status="waiting")
    return render(request, "lobby.html", {"rooms": rooms})


# ---------- CREATE ROOM ----------

@login_required
def create_room_view(request):
    active = request.user.profile.active_room

    # 🔒 SAFETY: only block if still active
    if active and active.status == "active":
        return redirect("game_board", active.id)
    else:
        request.user.profile.active_room = None
        request.user.profile.save()

    if request.method == "POST":
        duration = int(request.POST.get("trade_duration", 5))
        room = GameRoom.objects.create(
            host=request.user,
            trade_duration=duration,
            status="waiting"
        )
        return redirect("waiting", room.id)

    return render(request, "create_room.html")


# ---------- WAITING ROOM ----------

@login_required
def waiting_room(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)

    # 🔒 Only players of this room
    if request.user not in [room.host, room.opponent]:
        return redirect("lobby")

    # Already active → move both players
    if room.status == "active":
        return redirect("game_board", room.id)

    # 🚀 HOST starts game
    if (
        request.method == "POST"
        and request.user == room.host
        and room.opponent
        and room.status == "waiting"
    ):
        room.status = "active"
        room.started_at = timezone.now()
        room.settled = False
        room.save()

        # 🔥 Set active_room
        for user in [room.host, room.opponent]:
            user.profile.active_room = room
            user.profile.save()

        return redirect("game_board", room.id)

    return render(request, "waiting.html", {"room": room})


# ---------- JOIN ROOM ----------

@login_required
def join_room_view(request, room_id):
    active = request.user.profile.active_room

    if active and active.status == "active":
        return redirect("game_board", active.id)
    else:
        request.user.profile.active_room = None
        request.user.profile.save()

    room = get_object_or_404(GameRoom, id=room_id)

    if room.host == request.user:
        return redirect("waiting", room.id)

    if room.status == "waiting" and room.opponent is None:
        room.opponent = request.user
        room.save()

    return redirect("waiting", room.id)


# ---------- GAME BOARD ----------

@login_required
def game_board(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)

    # Completed → result
    if room.status == "completed":
        return redirect("result", room.id)

    # ⏱ TIMER LOGIC
    end_time = room.started_at + timedelta(minutes=room.trade_duration)

    if timezone.now() >= end_time:
        room.status = "completed"
        room.save()

        # 🔥 CLEAR ACTIVE ROOM FOR BOTH
        for user in [room.host, room.opponent]:
            if user:
                user.profile.active_room = None
                user.profile.save()

        return redirect("result", room.id)

    assets = Asset.objects.all()
    remaining_seconds = int((end_time - timezone.now()).total_seconds())

    return render(request, "game_board.html", {
        "room": room,
        "assets": assets,
        "remaining_seconds": remaining_seconds
    })


# ---------- ASSET DETAIL ----------

@login_required
def asset_detail(request, asset_id, room_id):
    room = get_object_or_404(GameRoom, id=room_id)

    if room.status != "active":
        return redirect("waiting", room.id)

    asset = get_object_or_404(Asset, id=asset_id)
    form = InvestmentForm(request.POST or None)

    if form.is_valid():
        Investment.objects.create(
            room=room,
            player=request.user,
            asset=asset,
            amount=form.cleaned_data["amount"]
        )
        return redirect("game_board", room.id)

    return render(request, "asset_detail.html", {
        "asset": asset,
        "form": form,
        "room": room
    })


# ---------- RESULT ----------

@login_required
def result_view(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)
    invs = Investment.objects.filter(room=room)
    analysis = analyze(invs)

    # 🔁 Already settled → just show
    if room.settled:
        return render(request, "result.html", {
            "room": room,
            "invs": invs,
            "analysis": analysis
        })

    # 🏁 HOST OR TIMER SETTLES GAME
    for user in [room.host, room.opponent]:
        profile = user.profile
        net_profit = analysis["profit_map"].get(user.id, 0)

        profile.account_balance += net_profit
        profile.total_profit_counter += net_profit
        profile.games_played += 1

        if net_profit > 0:
            profile.win_streak += 1
        else:
            profile.win_streak = 0

        profile.active_room = None
        profile.save()

    room.status = "completed"
    room.settled = True
    room.save()

    return render(request, "result.html", {
        "room": room,
        "invs": invs,
        "analysis": analysis
    })


# ---------- MARKET ----------

@login_required
def market_view(request):
    assets = Asset.objects.all()
    return render(request, "market.html", {"assets": assets})
