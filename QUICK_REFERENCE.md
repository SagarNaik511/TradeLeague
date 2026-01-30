# FinTrade League - Quick Reference

## Start Development

### Windows
```bash
setup.bat
# Then in 2 terminals:
# Terminal 1:
python manage.py runserver

# Terminal 2:
cd frontend/tl-main && npm run dev
```

### Mac/Linux
```bash
./setup.sh
# Then in 2 terminals:
# Terminal 1:
python manage.py runserver

# Terminal 2:
cd frontend/tl-main && npm run dev
```

### Docker
```bash
docker-compose up
```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **Admin:** http://localhost:8000/admin
- **API Base:** http://localhost:8000/api

## API Endpoints

```
Authentication:
  POST   /api/token/              - Login
  POST   /api/token/refresh/      - Refresh token
  POST   /api/register/           - Register user

Game Management:
  GET    /api/rooms/              - List rooms
  POST   /api/create-room/        - Create room
  POST   /api/join-room/<code>/   - Join room

Assets:
  GET    /api/assets/             - List assets
  GET    /api/assets/<id>/        - Get asset detail

Gameplay:
  POST   /api/invest/             - Make investment
  GET    /api/leaderboard/        - Top 20 players
  GET    /api/me/                 - User profile
```

## Frontend Service Usage

```typescript
// Import services
import { authService, gameService } from '@/services';

// Login
await authService.login({ username: 'user', password: 'pass' });

// Get leaderboard
const { data } = await gameService.getLeaderboard();

// Create game
const { data: room } = await gameService.createRoom('stock');

// Get assets
const { data: assets } = await gameService.getAssets();

// Invest
await gameService.invest({ 
  roomId: 1, 
  assetId: 5, 
  amount: 1000 
});
```

## Common Commands

```bash
# Backend
python manage.py migrate           # Run migrations
python manage.py createsuperuser   # Create admin user
python manage.py runserver         # Start dev server
python manage.py shell             # Django shell

# Frontend
npm install                        # Install dependencies
npm run dev                        # Start dev server
npm run build                      # Build for production

# Database
rm db.sqlite3                      # Delete database
python manage.py migrate           # Recreate database
```

## Environment

**Backend:** `fintech_backend/settings.py`
- `DEBUG = True` (development)
- `ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']`
- `CORS_ALLOW_ALL_ORIGINS = True`

**Frontend:** `frontend/tl-main/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## File Structure

```
Backend:
  fintech_backend/    - Django project config
  game/              - Game app (models, views, urls, serializers)
  manage.py          - Django CLI
  requirements.txt   - Python dependencies
  db.sqlite3         - Database

Frontend:
  frontend/tl-main/
    src/
      services/      - API clients
      context/       - React context
      components/    - React components
      app/          - Next.js pages
    .env.local       - Environment variables
```

## Key Models

**User (Django built-in)**
- username, password, email

**Profile (auto-created)**
- total_profit_counter
- win_streak, games_played
- accuracy_score
- league_level (NPC/VALID/MAIN/GOAT)

**Asset**
- name, base_price, growth_percent
- info_news_text, risk_level, sector

**GameRoom**
- room_code, host, opponent
- status (waiting/active/finished)
- mode (stock/options)

**Investment**
- room, player, asset, amount

## Debug Tips

1. **Check console:** Browser DevTools Network tab
2. **Check errors:** Backend terminal and browser console
3. **Check database:** `python manage.py dbshell`
4. **Check token:** localStorage in DevTools
5. **Check API:** Visit `http://localhost:8000/api/` in browser

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Backend not running or CORS not enabled |
| 404 Error | Wrong API URL or endpoint path |
| 401 Error | Token expired or invalid |
| Module not found | Run `pip install -r requirements.txt` or `npm install` |
| Database errors | Run `python manage.py migrate` |
| Port in use | Change port: `python manage.py runserver 8001` |

## Production Checklist

- [ ] Set `DEBUG = False`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Change `SECRET_KEY`
- [ ] Update `CORS_ALLOWED_ORIGINS`
- [ ] Use PostgreSQL database
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Use production WSGI server
- [ ] Set up proper logging
- [ ] Configure static file serving
- [ ] Set up database backups

## Documentation

- `README.md` - Full documentation
- `INTEGRATION_GUIDE.md` - Integration details
- `FIXES_APPLIED.md` - What was fixed
- `QUICK_REFERENCE.md` - This file

---

**All systems ready! 🚀**
