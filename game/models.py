from django.db import models
from django.contrib.auth.models import User
import uuid


# ---------- LEAGUE HELPER ----------

def get_league(total):
    if total < 50000:
        return "NPC"
    elif total < 200000:
        return "VALID"
    elif total < 1000000:
        return "MAIN"
    return "GOAT"


# ---------- ASSET ----------

class Asset(models.Model):
    name = models.CharField(max_length=100)
    base_price = models.FloatField()
    growth_percent = models.FloatField()
    info_news_text = models.TextField()
    risk_level = models.CharField(max_length=20)
    sector = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# ---------- GAME ROOM (SINGLE, CLEAN) ----------

class GameRoom(models.Model):
    DURATION_CHOICES = [
        (5, "5 Minutes"),
        (10, "10 Minutes"),
        (15, "15 Minutes"),
    ]

    room_code = models.CharField(max_length=8, unique=True, blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_rooms")
    opponent = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="joined_rooms"
    )

    status = models.CharField(max_length=20, default="waiting")
    trade_duration = models.IntegerField(choices=DURATION_CHOICES, default=5)
    started_at = models.DateTimeField(null=True, blank=True)
    settled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.room_code:
            self.room_code = uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Room {self.room_code}"


# ---------- PROFILE ----------

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    account_balance = models.FloatField(default=100000)
    total_profit_counter = models.FloatField(default=0)

    games_played = models.IntegerField(default=0)
    win_streak = models.IntegerField(default=0)
    league_level = models.CharField(max_length=20, default="NPC")

    active_room = models.ForeignKey(
        GameRoom,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="active_players"
    )

    def update_league(self):
        self.league_level = get_league(self.total_profit_counter)
        self.save()

    def __str__(self):
        return self.user.username


# ---------- INVESTMENT ----------

class Investment(models.Model):
    room = models.ForeignKey(GameRoom, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    amount = models.FloatField()

    def __str__(self):
        return f"{self.player.username} → {self.asset.name}"
