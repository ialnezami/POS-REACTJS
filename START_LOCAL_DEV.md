# Start Local Development (MongoDB in Docker)

This guide shows you how to run the POS system with **only MongoDB and Redis in Docker**, while running the backend and frontend **locally on your machine**.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Start MongoDB and Redis (Docker)

```bash
# Start only MongoDB and Redis
docker-compose -f docker-compose.dev.yml up -d

# Check if containers are running
docker ps

# View logs if needed
docker-compose -f docker-compose.dev.yml logs -f
```

### 2. Setup and Run Backend (Local)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start backend in development mode with hot reload
npm run start:dev
```

The backend will start on **http://localhost:4000**

Backend Scripts:
- `npm run start:dev` - Development mode with hot reload
- `npm run start` - Production mode
- `npm run start:debug` - Debug mode

### 3. Setup and Run Frontend (Local)

Open a **new terminal window/tab**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend in development mode
npm run dev
```

The frontend will start on **http://localhost:3000**

Frontend Scripts:
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production build

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api/v1
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

## Default Credentials

```
Username: admin@pos.com
Password: Admin@123
```

## Environment Variables

### Backend (.env)
Located at `backend/.env`:
```env
PORT=4000
MONGODB_URI=mongodb://admin:pos_password_123@localhost:27017/pos?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123
```

### Frontend (.env.local)
Located at `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

## Managing Docker Services

```bash
# Stop MongoDB and Redis
docker-compose -f docker-compose.dev.yml down

# Stop and remove all data (CAUTION: This deletes the database!)
docker-compose -f docker-compose.dev.yml down -v

# Restart services
docker-compose -f docker-compose.dev.yml restart

# View logs
docker-compose -f docker-compose.dev.yml logs -f mongodb
docker-compose -f docker-compose.dev.yml logs -f redis
```

## Troubleshooting

### Backend won't connect to MongoDB
1. Check if MongoDB is running: `docker ps`
2. Verify MongoDB URI in `backend/.env`
3. Test connection: `docker exec -it pos_mongodb mongosh -u admin -p pos_password_123`

### Backend won't connect to Redis
1. Check if Redis is running: `docker ps`
2. Test connection: `docker exec -it pos_redis redis-cli -a redis_password_123 ping`

### Port already in use
If you see "port already in use" errors:

**Backend (port 4000):**
```bash
# Find and kill process using port 4000
lsof -ti:4000 | xargs kill -9
```

**Frontend (port 3000):**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB (port 27017):**
```bash
# Stop any local MongoDB instances
brew services stop mongodb-community
# or
sudo systemctl stop mongodb
```

### Hot Reload Not Working

**Backend:**
- Make sure you're using `npm run start:dev` (not `start`)
- Check for TypeScript errors in the terminal

**Frontend:**
- Make sure you're using `npm run dev`
- Clear `.next` folder: `rm -rf .next` and restart

## Development Workflow

1. **Start Docker services once:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Start backend in one terminal:**
   ```bash
   cd backend && npm run start:dev
   ```

3. **Start frontend in another terminal:**
   ```bash
   cd frontend && npm run dev
   ```

4. **Make changes and see live updates** - Both backend and frontend will automatically reload on code changes

5. **When done, stop everything:**
   - Press `Ctrl+C` in both backend and frontend terminals
   - Stop Docker: `docker-compose -f docker-compose.dev.yml down`

## Benefits of This Setup

✅ **Fast Development** - Hot reload on code changes  
✅ **Easy Debugging** - Direct access to logs and debugger  
✅ **Less Resource Usage** - Only database runs in Docker  
✅ **Native Performance** - Backend and frontend run at full speed  
✅ **Easy Testing** - Can run tests directly without Docker overhead

## Switching Back to Full Docker

If you want to run everything in Docker again:

```bash
# Stop local dev setup
docker-compose -f docker-compose.dev.yml down

# Start full Docker setup
docker-compose up -d
```

---

**Happy Coding! 🚀**

