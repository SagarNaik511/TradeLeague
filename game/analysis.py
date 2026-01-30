def analyze(investments):
    good = []
    bad = []

    for inv in investments:
        if inv.asset.growth_percent > 0:
            good.append(inv.asset.name)
        else:
            bad.append(inv.asset.name)

    return {
        "good_decisions": good,
        "bad_decisions": bad,
        "diversification_score": len(investments),
        "risk_behavior": "medium"
    }
