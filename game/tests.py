from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import resolve, reverse

from .models import Asset


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = Client(HTTP_HOST='127.0.0.1:8000')
        self.user = get_user_model().objects.create_user(
            username='existing_trader',
            password='safe-test-password',
            email='existing@example.com',
        )
        self.asset = Asset.objects.create(
            name='Reliance Industries',
            sector='Energy',
            base_price=2500,
            growth_percent=2.5,
            risk_level='MEDIUM',
            info_news_text='Simulated company news for learning.',
        )

    def test_existing_password_user_can_log_in(self):
        response = self.client.post(
            '/login/',
            {'username': 'existing_trader', 'password': 'safe-test-password'},
        )
        self.assertRedirects(response, '/dashboard/')

    def test_google_callback_is_owned_by_allauth(self):
        match = resolve('/accounts/google/login/callback/')
        self.assertTrue(match.func.__module__.startswith('allauth.'))

    def test_invalid_google_callback_is_handled_safely(self):
        response = self.client.get('/accounts/google/login/callback/?error=access_denied')
        self.assertEqual(response.status_code, 401)

    def test_google_start_route_uses_allauth_when_configured(self):
        if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
            self.skipTest('Google OAuth credentials are not configured.')
        response = self.client.post('/accounts/google/login/')
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response['Location'].startswith('https://accounts.google.com/'))

    def test_login_and_registration_use_the_allauth_google_route(self):
        if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
            self.skipTest('Google OAuth credentials are not configured.')
        for url in ('/login/', '/register/'):
            response = self.client.get(url)
            self.assertContains(response, '/accounts/google/login/')
            self.assertNotContains(response, '/google-login/')

    def test_market_cards_link_to_market_asset_detail(self):
        self.client.force_login(self.user)

        response = self.client.get(reverse('market'))

        self.assertContains(response, reverse('market_asset_detail', args=[self.asset.id]))

    def test_market_asset_detail_requires_login(self):
        response = Client().get(reverse('market_asset_detail', args=[self.asset.id]))

        self.assertEqual(response.status_code, 302)

    def test_market_asset_detail_renders_without_a_game_room(self):
        self.client.force_login(self.user)

        response = self.client.get(reverse('market_asset_detail', args=[self.asset.id]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Reliance Industries')
        self.assertContains(response, 'ADVANCED CHART')
        self.assertContains(response, 'BACK TO MARKET')
        self.assertNotContains(response, 'CONFIRM INVESTMENT')

    def test_trading_academy_requires_login(self):
        response = Client().get(reverse('learn'))

        self.assertEqual(response.status_code, 302)

    def test_dashboard_links_to_trading_academy(self):
        self.client.force_login(self.user)

        response = self.client.get(reverse('dashboard'))

        self.assertContains(response, reverse('learn'))
        self.assertContains(response, 'LEARN TRADING')

    def test_trading_academy_renders_all_learning_sections(self):
        self.client.force_login(self.user)

        response = self.client.get(reverse('learn'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'TRADELEAGUE')
        self.assertContains(response, 'MARKET BASICS')
        self.assertContains(response, 'TECHNICAL INDICATORS')
        self.assertContains(response, 'RISK MANAGEMENT')
        self.assertContains(response, 'TEST YOUR TRADING KNOWLEDGE')
        self.assertContains(response, 'QUIZ COMPLETE')
        self.assertContains(response, 'TRADING PRACTICE LAB')
        self.assertContains(response, 'SCENARIO 01 / 12')
        self.assertContains(response, 'SIMULATION COMPLETE')
        self.assertContains(response, 'labScenarios')
        self.assertNotContains(response, 'READ-ONLY CHART INSPECTION')
        self.assertContains(response, reverse('market'))
        self.assertContains(response, reverse('lobby'))
