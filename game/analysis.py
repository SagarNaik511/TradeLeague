import random

def analyze(investments):
    """
    Simulates future market behavior and calculates
    profit/loss per player.
    """

    investments = list(
        investments
        .select_related("asset", "room", "player")
        .order_by("id")
    )
    seed = "|".join(
        f"{inv.room_id}:{inv.id}:{inv.player_id}:{inv.asset_id}:{inv.amount}"
        for inv in investments
    )
    rng = random.Random(seed)

    profit_map = {}
    good = []
    bad = []
    investment_results = {}

    for inv in investments:
        asset = inv.asset
        base_price = asset.base_price
        amount = inv.amount

        # ----- TREND -----
        trend = asset.growth_percent / 100

        # ----- VOLATILITY -----
        if asset.risk_level == "LOW":
            volatility = rng.uniform(-0.03, 0.03)
        elif asset.risk_level in ["MEDIUM", "MED"]:
            volatility = rng.uniform(-0.07, 0.07)
        else:
            volatility = rng.uniform(-0.15, 0.15)

        # ----- TIME COMPRESSION -----
        room = inv.room
        if room.trade_duration == 5:
            time_factor = rng.uniform(0.5, 1.0)
        elif room.trade_duration == 10:
            time_factor = rng.uniform(1.0, 1.5)
        else:
            time_factor = rng.uniform(1.5, 2.0)

        # The displayed growth is the asset's baseline direction. Each room
        # then simulates a time-adjusted trend plus a risk-based market move.
        # Keeping these values lets the result page explain an unexpected
        # outcome instead of presenting the final P/L as a mystery.
        trend_return = trend * time_factor
        final_return = trend_return + volatility

        # ----- FUTURE PRICE -----
        future_price = base_price * (1 + final_return)

        # ----- PROFIT / LOSS -----
        profit = amount * (future_price - base_price) / base_price

        profit_map.setdefault(inv.player.id, 0)
        profit_map[inv.player.id] += profit

        investment_results[inv.id] = {
            "base_growth_percent": asset.growth_percent,
            "trend_return_percent": trend_return * 100,
            "volatility_percent": volatility * 100,
            "final_return_percent": final_return * 100,
            "profit": profit,
            "risk_level": asset.risk_level,
        }

        if profit > 0:
            good.append(asset.name)
        else:
            bad.append(asset.name)

    return {
        "profit_map": profit_map,
        "good_decisions": good,
        "bad_decisions": bad,
        "investment_results": investment_results,
        "diversification_score": len(set(i.asset_id for i in investments)),
        "risk_behavior": "balanced" if len(good) >= len(bad) else "aggressive"
    }
