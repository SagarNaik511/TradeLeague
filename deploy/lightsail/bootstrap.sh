#!/usr/bin/env bash
# Run once on a fresh Ubuntu Lightsail instance after cloning this repository.
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/tradeleague}"
cd "$APP_DIR"

if [ ! -f .env ]; then
    echo "Create $APP_DIR/.env from .env.example before running this script."
    exit 1
fi

sudo apt-get update
sudo apt-get install -y python3-venv python3-pip nginx

# A small swap file prevents a temporary package-install or traffic spike from
# immediately exhausting a 512 MB instance. It is not a replacement for
# upgrading if normal usage consistently needs more RAM.
if ! sudo swapon --show --noheadings | grep -q .; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt

.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput
.venv/bin/python manage.py seed_assets

echo "Application dependencies, database, static files, and demo assets are ready."
