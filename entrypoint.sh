#!/bin/sh
set -e

echo "Waiting for database..."
while ! python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintech_backend.settings')
django.setup()
from django.db import connections
connections['default'].ensure_connection()
" 2>/dev/null; do
    echo "Database unavailable - sleeping 2s..."
    sleep 2
done
echo "Database ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Seeding assets..."
python manage.py seed_assets 2>/dev/null || echo "Seed command skipped or already seeded."

echo "Starting Daphne (ASGI) server..."
exec daphne -b 0.0.0.0 -p 8000 fintech_backend.asgi:application
