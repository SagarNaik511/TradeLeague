from django.db import models
from django.contrib.auth.models import User
import uuid

def get_league(total):
    if total < 50000:
        return "NPC"
    elif total < 200000:
        return "VALID"
    elif total < 1000000:
        return "MAIN"
    return "GOAT"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_profit_counter = models.IntegerField(default=0)
    win_streak = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    accuracy_score = models.FloatField(default=0)
    league_level = models.CharField(max_length=20, default="NPC")
    account_balance = models.FloatField(default=0)

    def update_league(self):
        self.league_level = get_league(self.total_profit_counter)
        self.save()


class Asset(models.Model):
    name = models.CharField(max_length=100)
    base_price = models.FloatField()
    growth_percent = models.FloatField()
    info_news_text = models.TextField()
    risk_level = models.CharField(max_length=20)
    sector = models.CharField(max_length=50)


class GameRoom(models.Model):
    room_code = models.CharField(max_length=10, unique=True, default=uuid.uuid4)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="host")
    opponent = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="opponent")
    status = models.CharField(max_length=20, default="waiting")
    mode = models.CharField(max_length=20, default="stock")
    created = models.DateTimeField(auto_now_add=True)


class Investment(models.Model):
    room = models.ForeignKey(GameRoom, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    amount = models.FloatField()
