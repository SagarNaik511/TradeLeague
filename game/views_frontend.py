from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.utils.crypto import get_random_string
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
    
@login_required
def how_to_play(request):
    return render(request, "how_to_play.html") 

# ---------- LOBBY ----------

@login_required
def lobby(request):
    form = RoomCodeForm(request.POST or None)
    error = None
    public_rooms = GameRoom.objects.filter(
        status="waiting",
        opponent__isnull=True,
        room_code__startswith="PUB-",
    ).exclude(host=request.user)

    if request.method == "POST" and form.is_valid():
        room_code = form.cleaned_data["room_code"]
        room = GameRoom.objects.filter(room_code=room_code).first()

        if room is None:
            error = "Invalid Room Code"
        elif room.host == request.user:
            error = "You cannot join your own room"
        elif room.status != "waiting":
            error = "Game Already Started"
        elif room.opponent is not None:
            error = "Room is Full"
        else:
            room.opponent = request.user
            room.save()
            return redirect("waiting", room.id)

    return render(request, "lobby.html", {
        "form": form,
        "error": error,
        "public_rooms": public_rooms,
    })


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
        room_type = request.POST.get("room_type", "private")
        room_code = None
        if room_type == "public":
            while True:
                room_code = f"PUB-{get_random_string(4).upper()}"
                if not GameRoom.objects.filter(room_code=room_code).exists():
                    break

        room = GameRoom.objects.create(
            host=request.user,
            room_code=room_code or "",
            trade_duration=duration,
            status="waiting"
        )
        return redirect("waiting", room.id)

    return render(request, "create_room.html")


# ---------- WAITING ROOM ----------

@login_required
def waiting_room(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)

    # Only players of this room
    if request.user not in [room.host, room.opponent]:
        return redirect("lobby")

    # If game already active, send both players to the trading screen.
    if room.status == "active":
        return redirect("game_board", room.id)

    # HOST starts game (real match)
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

        # Set active_room for both players
        for user in [room.host, room.opponent]:
            user.profile.active_room = room
            user.profile.save()

        return redirect("game_board", room.id)

    return render(request, "waiting.html", {
        "room": room,
        "is_public_room": room.room_code.startswith("PUB-"),
    })


# ---------- JOIN PUBLIC ROOM ----------

@login_required
def join_public_room(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)

    if not room.room_code.startswith("PUB-"):
        return redirect("lobby")

    if room.host == request.user:
        return redirect("waiting", room.id)

    if room.status != "waiting" or room.opponent is not None:
        return redirect("lobby")

    room.opponent = request.user
    room.save()
    return redirect("waiting", room.id)


# ---------- GAME BOARD ----------

@login_required
def game_board(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)
    profile = request.user.profile

    if request.user not in [room.host, room.opponent]:
        return redirect("lobby")

    # If game finished
    if room.status == "completed":
        return redirect("result", room.id)

    if room.status == "waiting":
        return redirect("waiting", room.id)

    assets = Asset.objects.all()

    # PRACTICE / PREVIEW MODE (no opponent, not started)
    if room.started_at is None:
        return render(request, "game_board.html", {
            "room": room,
            "assets": assets,
            "profile": profile,
            "remaining_seconds": None  # no timer
        })

    # REAL GAME TIMER
    end_time = room.started_at + timedelta(minutes=room.trade_duration)

    if timezone.now() >= end_time:
        room.status = "settling"
        room.save()
        return redirect("result", room.id)

    remaining_seconds = int((end_time - timezone.now()).total_seconds())

    return render(request, "game_board.html", {
        "room": room,
        "assets": assets,
        "profile": profile,
        "remaining_seconds": remaining_seconds
    })


# ---------- ASSET DETAIL ----------

@login_required
def asset_detail(request, asset_id, room_id):
    room = get_object_or_404(GameRoom, id=room_id)
    asset = get_object_or_404(Asset, id=asset_id)

    form = InvestmentForm(request.POST or None)

    profile = request.user.profile

    # Block investing if game not active
    if request.method == "POST" and room.status != "active":
        return redirect("game_board", room.id)

    # Allow viewing asset anytime
    if form.is_valid():
        amount = form.cleaned_data["amount"]
        # Enforce balance check
        if amount > profile.account_balance:
            form.add_error("amount", f"Insufficient funds! You have ₹{profile.account_balance:,.0f}")
        else:
            Investment.objects.create(
                room=room,
                player=request.user,
                asset=asset,
                amount=amount
            )
            profile.account_balance -= amount
            profile.save()
            return redirect("game_board", room.id)

    return render(request, "asset_detail.html", {
        "asset": asset,
        "form": form,
        "room": room,
        "profile": profile,
    })



# ---------- RESULT ----------

@login_required
def result_view(request, room_id):
    room = get_object_or_404(GameRoom, id=room_id)
    invs = Investment.objects.filter(room=room)
    analysis = analyze(invs)
    current_user_profit = analysis["profit_map"].get(request.user.id, 0)
    opponent = room.opponent if request.user == room.host else room.host
    opponent_profit = analysis["profit_map"].get(opponent.id, 0) if opponent else 0
    is_draw = current_user_profit == opponent_profit
    did_win = current_user_profit > opponent_profit
    user_invs = [inv for inv in invs if inv.player_id == request.user.id]
    weak_picks = [inv.asset.name for inv in user_invs if inv.asset.growth_percent < 0]
    missed_growth = [
        inv.asset.name
        for inv in user_invs
        if inv.asset.growth_percent > 0 and inv.amount < 1000
    ]
    result_context = {
        "current_user_profit": current_user_profit,
        "opponent_profit": opponent_profit,
        "did_win": did_win,
        "is_draw": is_draw,
        "weak_picks": weak_picks,
        "missed_growth": missed_growth,
        "user_investment_count": len(user_invs),
    }

    # Already settled → just show
    if room.settled:
        return render(request, "result.html", {
            "room": room,
            "invs": invs,
            "analysis": analysis,
            "result_context": result_context,
        })

    # HOST OR TIMER SETTLES GAME
    for user in [room.host, room.opponent]:
        if user is None:          
            continue

        profile = user.profile
        net_profit = analysis["profit_map"].get(user.id, 0)

        # Return invested amount + profit/loss
        user_invested = sum(inv.amount for inv in invs if inv.player == user)
        profile.account_balance += user_invested + net_profit

        profile.total_profit_counter += net_profit
        profile.games_played += 1

        other_user = room.opponent if user == room.host else room.host
        other_profit = analysis["profit_map"].get(other_user.id, 0) if other_user else 0

        if net_profit > other_profit:
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
        "analysis": analysis,
        "result_context": result_context,
    })


# ---------- MARKET ----------

@login_required
def market_view(request):
    assets = Asset.objects.all()
    return render(request, "market.html", {"assets": assets})
