from game.models import Asset

data = [
("Gold ETF",100,0.08,"Safe haven demand rising","LOW","Metals"),
("TechNova",200,0.15,"AI partnership announced","MED","Tech"),
("GreenEnergy",150,-0.10,"Factory shutdown","HIGH","Energy"),
("AgroFuture",120,-0.05,"Crop risk","MED","Agri"),
("SagarCorp",180,0.20,"Gov contract","HIGH","Infra"),
("NithinLtd",220,0.50,"Product launch","HIGH","Tech"),
("FinEdge Bank",160,0.12,"Profit growth","LOW","Finance"),
("Quantum Motors",140,-0.08,"Recall news","HIGH","Auto"),
]

for d in data:
    Asset.objects.create(
        name=d[0],
        base_price=d[1],
        growth_percent=d[2],
        info_news_text=d[3],
        risk_level=d[4],
        sector=d[5]
    )
