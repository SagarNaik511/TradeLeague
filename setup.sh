#!/bin/bash

echo "Starting FinTrade League Development Environment..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo ""
echo "Installing backend dependencies..."
pip install -r requirements.txt

echo ""
echo "Running Django migrations..."
python manage.py migrate

echo ""
echo "===================================="
echo "Setup complete!"
echo "===================================="
echo ""
echo "To run the development environment:"
echo ""
echo "Terminal 1 (Backend):"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend/tl-main"
echo "  npm install (if not done)"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
