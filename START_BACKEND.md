# How to Start the Backend

## Prerequisites
- Docker Desktop installed and running
- Or MongoDB 7+ and Redis 7+ running locally

## Method 1: Using Docker Compose (Recommended)

### Step 1: Start Docker Desktop
Make sure Docker Desktop is running on your Mac.

### Step 2: Start All Services

```bash
cd /Users/ibrahim.alnezami/Desktop/POS-REACTJS
docker-compose up -d
```

This will start:
- ✅ MongoDB (port 27017)
- ✅ Redis (port 6379)
- ✅ Backend API (port 4000)
- ✅ Frontend (port 3000) - when implemented

### Step 3: Verify Services

```bash
# Check running containers
docker-compose ps

# View backend logs
docker-compose logs -f backend

# View all logs
docker-compose logs -f
```

### Step 4: Access the Application

- **Backend API:** http://localhost:4000
- **API Docs:** http://localhost:4000/api/docs
- **Health Check:** http://localhost:4000/health

### Step 5: Test the API

```bash
# Health check
curl http://localhost:4000/health

# Register a user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "My Business"
  }'
```

## Method 2: Local Development (Without Docker)

### Step 1: Start MongoDB

```bash
# Using Homebrew
brew services start mongodb-community@7.0

# Or manually
mongod --config /opt/homebrew/etc/mongod.conf
```

### Step 2: Start Redis

```bash
# Using Homebrew
brew services start redis

# Or manually
redis-server
```

### Step 3: Start Backend

```bash
cd /Users/ibrahim.alnezami/Desktop/POS-REACTJS/backend
npm run start:dev
```

The backend will be available at http://localhost:4000

## Stopping Services

### Docker Compose

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Local Services

```bash
# Stop MongoDB
brew services stop mongodb-community@7.0

# Stop Redis
brew services stop redis

# Backend stops when you Ctrl+C
```

## Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**
- Start Docker Desktop application
- Wait for it to fully start (whale icon in menu bar)

**"Port already in use"**
```bash
# Find what's using port 4000
lsof -i :4000
# Kill the process or change the port in .env
```

### MongoDB Issues

**"Connection refused"**
- Check if MongoDB is running: `brew services list`
- Check MongoDB logs: `brew services log mongodb-community`

### Redis Issues

**"Connection refused"**
- Check if Redis is running: `brew services list`
- Test Redis: `redis-cli ping` (should return PONG)

### Backend Issues

**"Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**"Build errors"**
```bash
cd backend
npm run build
```

## Development Commands

```bash
# Start with hot reload
npm run start:dev

# Start with debugger
npm run start:debug

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm test

# Lint code
npm run lint
```

## Environment Variables

The backend uses these environment variables (in `backend/.env`):

```env
NODE_ENV=development
PORT=4000

MONGODB_URI=mongodb://admin:pos_password_123@localhost:27017/pos?authSource=admin
MONGODB_DB_NAME=pos

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123
REDIS_DB=0

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

## Next Steps

Once the backend is running:

1. ✅ Visit http://localhost:4000/api/docs for API documentation
2. ✅ Test the health endpoint: http://localhost:4000/health
3. ✅ Register a test user via API
4. ✅ Start implementing frontend or more backend features

## Quick Reference

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down

# Restart backend only
docker-compose restart backend

# Open API docs in browser
open http://localhost:4000/api/docs
```


