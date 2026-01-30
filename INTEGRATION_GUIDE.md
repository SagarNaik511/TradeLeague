# Frontend-Backend Integration Guide

## Setup Instructions

### Backend (Django)
1. Navigate to the backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Load seed data: `python manage.py shell < game/seed_assets.py`
5. Start the server: `python manage.py runserver`

The backend will run on `http://localhost:8000`

### Frontend (Next.js)
1. Navigate to `frontend/tl-main`
2. Install dependencies: `npm install`
3. The `.env.local` file is already configured with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
4. Start the dev server: `npm run dev`

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- **POST** `/api/token/` - Login (returns access & refresh tokens)
- **POST** `/api/token/refresh/` - Refresh access token
- **POST** `/api/register/` - Register new user

### Game Management
- **GET** `/api/rooms/` - List available game rooms
- **POST** `/api/create-room/` - Create a new game room
- **POST** `/api/join-room/<code>/` - Join an existing room

### Assets
- **GET** `/api/assets/` - List all assets
- **GET** `/api/assets/<id>/` - Get asset details

### Gameplay
- **POST** `/api/invest/` - Make an investment
- **GET** `/api/leaderboard/` - Get top players
- **GET** `/api/me/` - Get current user profile

## Frontend Services

### apiClient.ts
Low-level HTTP client that handles:
- Base URL configuration
- JWT token management
- Request/response handling

### authService.ts
Authentication operations:
- `register()` - Create new account
- `login()` - Authenticate and get tokens
- `refreshToken()` - Refresh expired tokens
- `getProfile()` - Get user profile
- `setToken()`/`clearToken()` - Token management

### gameService.ts
Game operations:
- `listRooms()` - Get available rooms
- `createRoom()` - Create new game
- `joinRoom()` - Join existing game
- `getAssets()` - Get tradeable assets
- `getAssetDetail()` - Get specific asset info
- `invest()` - Make investment
- `getLeaderboard()` - Get rankings
- `getMyProfile()` - Get user stats

## Token Management

Tokens are stored in `localStorage`:
- `access_token` - JWT access token for API requests
- Refresh token should be stored separately for security

## CORS Configuration

Backend is configured with `CORS_ALLOW_ALL_ORIGINS = True` for development.

## Common Issues & Solutions

### CORS Errors
- Ensure Django backend is running on `http://localhost:8000`
- Check that `.env.local` has correct `NEXT_PUBLIC_API_URL`

### 401 Unauthorized Errors
- Token may be expired, call `authService.refreshToken()`
- User may need to login again

### 404 Errors
- Verify endpoint path in the service files matches Django urls.py
- Check that base API URL doesn't have trailing slash

### Profile Not Found
- Run migrations: `python manage.py migrate`
- Create a new user (signal will create profile automatically)
