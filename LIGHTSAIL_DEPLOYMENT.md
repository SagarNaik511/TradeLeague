# TradeLeague on AWS Lightsail (512 MB + IPv4)

This deployment intentionally uses one Ubuntu Lightsail instance, SQLite, Nginx,
and one Daphne process. It does **not** use Docker, RDS, ElastiCache, or Redis.
That keeps the project within the smallest practical Lightsail plan and avoids
separate managed-service charges.

> The 512 MB plan is suitable for a demo, portfolio, or light classroom usage.
> It is not a high-traffic production architecture. Upgrade to 1 GB if the
> instance regularly runs out of memory or several rooms are active at once.

## Before you start

- Push the current project to a **private** GitHub repository.
- Do not commit `.env`, `db.sqlite3`, or your Google client secret.
- You need a domain name if you want Google sign-in in production. Google OAuth
  requires HTTPS for normal web redirect URLs; an IP-only HTTP site is not a
  suitable final Google OAuth deployment.

## 1. Create the Lightsail server

1. Open the [Lightsail console](https://lightsail.aws.amazon.com/).
2. Create an instance in a region near your users.
3. Choose **Linux operating system** (not **Linux apps**), then choose
   **Ubuntu 24.04 LTS** from the blueprint list. AWS previously labelled this
   choice **Linux/Unix → OS Only**.
4. Select **0.5 GB / 512 MB with public IPv4** (not IPv6-only).
5. Name it `tradeleague` and create it.
6. In the instance **Networking** tab, allow:
   - HTTP — TCP 80 — everyone
   - HTTPS — TCP 443 — everyone (needed once TLS is enabled)
7. In Lightsail **Networking**, create and attach a **static IP**. Record it as
   `YOUR_STATIC_IP`.

## 2. Connect and clone

Use the browser SSH button in Lightsail, or connect from PowerShell:

```powershell           
ssh ubuntu@YOUR_STATIC_IP
```                      

On the server, clone the repository. For a private repository, use an SSH deploy
key or a GitHub fine-grained access token; never paste a token into this guide or
commit it.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git tradeleague
cd ~/tradeleague
```

## 3. Create the production environment file

```bash
cp .env.example .env
nano .env
```

For the first IP-only test, use this minimum configuration (replace values):

```dotenv
SECRET_KEY=PASTE_A_NEW_LONG_RANDOM_SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=YOUR_STATIC_IP
CSRF_TRUSTED_ORIGINS=http://YOUR_STATIC_IP
USE_HTTPS=False

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://YOUR_STATIC_IP
```

Leave every `DB_*` and `REDIS_URL` line empty or absent. That selects the local
SQLite database and the single-process in-memory WebSocket layer.

Generate a new secret key on the server:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

## 4. Install the application

```bash
cd ~/tradeleague
bash deploy/lightsail/bootstrap.sh
```

This installs only Ubuntu's Nginx/Python prerequisites, creates `.venv`, installs
the project requirements, applies migrations, collects static files, and seeds
the existing simulated assets.

Create your admin account:

```bash
~/tradeleague/.venv/bin/python ~/tradeleague/manage.py createsuperuser
```

## 5. Install Nginx and the app service

```bash
sudo cp ~/tradeleague/deploy/lightsail/nginx-tradeleague.conf /etc/nginx/sites-available/tradeleague
sudo ln -s /etc/nginx/sites-available/tradeleague /etc/nginx/sites-enabled/tradeleague
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

sudo cp ~/tradeleague/deploy/lightsail/tradeleague.service /etc/systemd/system/tradeleague.service
sudo systemctl daemon-reload
sudo systemctl enable --now tradeleague
sudo systemctl status tradeleague --no-pager
```

Open `http://YOUR_STATIC_IP/` and verify the home page, registration, a game
room, and `http://YOUR_STATIC_IP/admin/` work.

Useful diagnostics:

```bash
sudo journalctl -u tradeleague -n 100 --no-pager
sudo systemctl status nginx --no-pager
curl -H 'Host: YOUR_STATIC_IP' http://127.0.0.1:8000/api/health/
```

## 6. Add domain, HTTPS, and Google login

1. At your domain registrar, add an A record from `yourdomain.com` to
   `YOUR_STATIC_IP`. Add `www` only if you plan to use it.
2. Wait until `http://yourdomain.com` opens the site.
3. Install a certificate with Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

4. Update `~/tradeleague/.env`:

```dotenv
ALLOWED_HOSTS=YOUR_STATIC_IP,yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com
USE_HTTPS=True
GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-real-client-secret
```

5. In Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 web
   client, add this **exact** authorized redirect URI:

```text
https://yourdomain.com/accounts/google/login/callback/
```

Keep the localhost callback too if you still develop locally. Save in Google
Cloud, then restart TradeLeague:

```bash
sudo systemctl restart tradeleague
```

Confirm automatic certificate renewal:

```bash
sudo certbot renew --dry-run
```

## Updates and backups

Before deployment updates, create a Lightsail snapshot in the console. SQLite
contains your users and game data, so it is important to back up `db.sqlite3`.

For each code update:

```bash
cd ~/tradeleague
git pull origin main
~/tradeleague/.venv/bin/pip install -r requirements.txt
~/tradeleague/.venv/bin/python manage.py migrate --noinput
~/tradeleague/.venv/bin/python manage.py collectstatic --noinput
sudo systemctl restart tradeleague
```

Do not run `git clean`, delete `db.sqlite3`, or replace `.env` during an update.

## Cost and limits

The public-IPv4 512 MB Linux bundle is listed by Lightsail as **US$5/month**
(pricing varies by region/tax and can change). A static IP attached to the active
instance is included in the bundle. The smaller US$3.50 plan is IPv6-only, so it
does not meet your IPv4 requirement. Set an AWS Budget alert before launch.
