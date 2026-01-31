def analyze(investments):
    good = []
    bad = []
    profit_map = {}

    for inv in investments:
        growth = inv.asset.growth_percent / 100
        profit = inv.amount * growth

        user_id = inv.player.id
        profit_map[user_id] = profit_map.get(user_id, 0) + profit

        if growth > 0:
            good.append(inv.asset.name)
        else:
            bad.append(inv.asset.name)

    return {
        "good_decisions": list(set(good)),
        "bad_decisions": list(set(bad)),
        "diversification_score": len(set(i.asset for i in investments)),
        "risk_behavior": "Medium",
        "profit_map": profit_map   
    }
