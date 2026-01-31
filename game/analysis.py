import random

def analyze(investments):
    """
    Simulates future market behavior and calculates
    profit/loss per player.
    """

    profit_map = {}
    good = []
    bad = []

    for inv in investments:
        asset = inv.asset
        base_price = asset.base_price
        amount = inv.amount

        # ----- TREND -----
        trend = asset.growth_percent / 100

        # ----- VOLATILITY -----
        if asset.risk_level == "LOW":
            volatility = random.uniform(-0.03, 0.03)
        elif asset.risk_level in ["MEDIUM", "MED"]:
            volatility = random.uniform(-0.07, 0.07)
        else:
            volatility = random.uniform(-0.15, 0.15)

        # ----- TIME COMPRESSION -----
        room = inv.room
        if room.trade_duration == 5:
            time_factor = random.uniform(0.5, 1.0)
        elif room.trade_duration == 10:
            time_factor = random.uniform(1.0, 1.5)
        else:
            time_factor = random.uniform(1.5, 2.0)

        # ----- FUTURE PRICE -----
        future_price = base_price * (1 + trend * time_factor + volatility)

        # ----- PROFIT / LOSS -----
        profit = amount * (future_price - base_price) / base_price

        profit_map.setdefault(inv.player.id, 0)
        profit_map[inv.player.id] += profit

        if profit > 0:
            good.append(asset.name)
        else:
            bad.append(asset.name)

    return {
        "profit_map": profit_map,
        "good_decisions": good,
        "bad_decisions": bad,
        "diversification_score": len(set(i.asset_id for i in investments)),
        "risk_behavior": "balanced" if len(good) >= len(bad) else "aggressive"
    }
