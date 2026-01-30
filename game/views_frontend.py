from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import *
from .models import *
from .analysis import analyze


# ---------- INTRO ----------

def intro(request):
    return render(request, "intro.html")


# ---------- AUTH ----------

def register_view(request):
    form = RegisterForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=False)
        user.set_password(form.cleaned_data["password"])
        user.save()
        return redirect("login")
    return render(request, "register.html", {"form": form})


def login_view(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        u = authenticate(
            username=form.cleaned_data["username"],
            password=form.cleaned_data["password"]
        )
        if u:
            login(request, u)
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


@login_required
def create_room_view(request):
    room = GameRoom.objects.create(host=request.user)
    return redirect("waiting", room.id)


@login_required
def waiting_room(request, room_id):
    room = GameRoom.objects.get(id=room_id)
    return render(request, "waiting.html", {"room": room})


# ---------- GAME BOARD ----------

@login_required
def game_board(request, room_id):
    assets = Asset.objects.all()
    return render(request, "game_board.html", {
        "assets": assets,
        "room_id": room_id
    })


@login_required
def asset_detail(request, asset_id, room_id):
    asset = Asset.objects.get(id=asset_id)
    form = InvestmentForm(request.POST or None)

    if form.is_valid():
        Investment.objects.create(
            room_id=room_id,
            player=request.user,
            asset=asset,
            amount=form.cleaned_data["amount"]
        )
        return redirect("game_board", room_id)

    return render(request, "asset_detail.html", {
        "asset": asset,
        "form": form,
        "room_id": room_id
    })


# ---------- RESULT ----------

@login_required
def result_view(request, room_id):
    room = GameRoom.objects.get(id=room_id)
    invs = Investment.objects.filter(room=room)

    analysis = analyze(invs)

    return render(request, "result.html", {
        "room": room,
        "invs": invs,
        "analysis": analysis
    })
