from django.core.management.base import BaseCommand
from game.models import Asset


class Command(BaseCommand):
    help = "Seed dummy stock assets"

    def handle(self, *args, **kwargs):
        if Asset.objects.exists():
            self.stdout.write(self.style.WARNING("Assets already exist. Skipping."))
            return

        assets = [
            
            Asset(
                name="Reliance Industries",
                base_price=2500,
                growth_percent=4.2,
                risk_level="MEDIUM",
                sector="Energy",
                info_news_text="Strong quarterly earnings driven by refining and retail growth."
            ),
            Asset(
                name="TCS",
                base_price=3600,
                growth_percent=3.1,
                risk_level="LOW",
                sector="IT",
                info_news_text="Stable IT demand with long-term enterprise contracts."
            ),
            Asset(
                name="Adani Ports",
                base_price=820,
                growth_percent=-2.4,
                risk_level="HIGH",
                sector="Infrastructure",
                info_news_text="Regulatory scrutiny affecting short-term investor sentiment."
            ),
            Asset(
                name="HDFC Bank",
                base_price=1650,
                growth_percent=2.8,
                risk_level="LOW",
                sector="Banking",
                info_news_text="Healthy loan growth and strong balance sheet."
            ),
            Asset(
                name="Zomato",
                base_price=145,
                growth_percent=6.5,
                risk_level="HIGH",
                sector="Consumer Tech",
                info_news_text="Aggressive expansion with improving unit economics."
            ),
            Asset(
                name="Infosys",
                base_price=1500,
                growth_percent=1.9,
                risk_level="MEDIUM",
                sector="IT",
                info_news_text="Cautious guidance amid global economic uncertainty."
            ),

            # ❌ NEW LOSING ASSETS (ADDED ONLY)
            Asset(
                name="Paytm",
                base_price=420,
                growth_percent=-6.8,
                risk_level="HIGH",
                sector="FinTech",
                info_news_text="Continued losses and regulatory pressure impacting investor confidence."
            ),
            Asset(
                name="Byju's",
                base_price=75,
                growth_percent=-12.4,
                risk_level="HIGH",
                sector="EdTech",
                info_news_text="Debt issues and declining user base causing sharp valuation drop."
            ),
            Asset(
                name="Yes Bank",
                base_price=18,
                growth_percent=-4.9,
                risk_level="MEDIUM",
                sector="Banking",
                info_news_text="Weak balance sheet and asset quality concerns continue."
            ),
        ]

        Asset.objects.bulk_create(assets)
        self.stdout.write(self.style.SUCCESS("Dummy assets created successfully 🚀"))
