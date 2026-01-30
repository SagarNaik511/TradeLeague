@echo off
echo Starting FinTrade League Development Environment...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

echo.
echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo Running Django migrations...
python manage.py migrate

echo.
echo ====================================
echo Setup complete!
echo ====================================
echo.
echo To run the development environment:
echo.
echo Terminal 1 (Backend):
echo   python manage.py runserver
echo.
echo Terminal 2 (Frontend):
echo   cd frontend/tl-main
echo   npm install (if not done)
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
