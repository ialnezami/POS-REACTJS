# Backend Quick Start Guide

## ✅ What's Been Implemented

The NestJS backend has been successfully created with the following features:

### Core Infrastructure
- ✅ NestJS 10 project structure
- ✅ TypeScript 5+ with strict mode
- ✅ MongoDB 7+ integration with Mongoose
- ✅ Redis caching layer
- ✅ Environment configuration
- ✅ API versioning (v1)
- ✅ Swagger/OpenAPI documentation

### Authentication & Authorization (Tasks 1-15)
- ✅ JWT authentication with access & refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Local strategy for email/password login
- ✅ JWT strategy for protected routes
- ✅ Role-Based Access Control (RBAC)
- ✅ Multi-tenant architecture
- ✅ User schema with roles
- ✅ Guards and decorators
- ✅ Token refresh mechanism

### User Roles Supported
- `super_admin` - Platform administrator
- `tenant_admin` - Business owner
- `store_manager` - Store manager
- `cashier` - POS operator
- `inventory_manager` - Inventory management
- `accountant` - Financial access
- `viewer` - Read-only access

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

```bash
# From project root
docker-compose up -d

# Backend will be available at http://localhost:4000
```

### Option 2: Local Development

```bash
# 1. Start MongoDB and Redis
# Using Docker:
docker run -d -p 27017:27017 --name pos-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=pos_password_123 \
  mongo:7.0

docker run -d -p 6379:6379 --name pos-redis \
  redis:7-alpine

# 2. Navigate to backend folder
cd backend

# 3. Install dependencies (if not done already)
npm install

# 4. Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=4000

MONGODB_URI=mongodb://admin:pos_password_123@localhost:27017/pos?authSource=admin
MONGODB_DB_NAME=pos

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
EOF

# 5. Start the backend
npm run start:dev
```

The server will start on http://localhost:4000

## 📚 API Documentation

Once running, access Swagger documentation at:
**http://localhost:4000/api/docs**

## 🧪 Testing the API

### 1. Register a New User

```bash
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

Response will include:
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "tenant_admin",
    "tenantId": "...",
    "storeId": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### 2. Login

```bash
# Save the tenantId from registration response
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "tenantId": "YOUR_TENANT_ID"
  }'
```

### 3. Access Protected Endpoints

```bash
# Get current user profile
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# List all users (admin only)
curl http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token

```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.controller.ts           # Health check
│   ├── app.module.ts                # Root module
│   ├── main.ts                      # App entry point
│   │
│   ├── common/                      # Shared code
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       ├── local-auth.guard.ts
│   │       └── roles.guard.ts
│   │
│   ├── config/                      # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   │
│   └── modules/
│       ├── auth/                    # Authentication
│       │   ├── dto/
│       │   ├── strategies/
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   └── auth.service.ts
│       │
│       ├── users/                   # User management
│       │   ├── dto/
│       │   ├── schemas/
│       │   ├── users.controller.ts
│       │   ├── users.module.ts
│       │   └── users.service.ts
│       │
│       ├── cache/                   # Redis cache
│       │   ├── cache.module.ts
│       │   └── cache.service.ts
│       │
│       └── database/                # MongoDB
│           └── database.module.ts
│
├── dist/                            # Compiled output
├── node_modules/
├── .env                             # Environment variables
├── Dockerfile                       # Docker configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiration (15min access, 7 day refresh)
- ✅ Token rotation on refresh
- ✅ Multi-tenant data isolation
- ✅ Role-based access control
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/min)
- ✅ Input validation with class-validator

## 🗄️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId
  email: string (unique per tenant)
  password: string (hashed)
  firstName: string
  lastName: string
  role: enum (super_admin, tenant_admin, etc.)
  tenantId: ObjectId (indexed)
  storeId?: ObjectId
  isActive: boolean
  isEmailVerified: boolean
  lastLogin?: Date
  twoFactorSecret?: Object
  refreshTokens: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `{ tenantId: 1, email: 1 }` - Unique compound index
- `{ tenantId: 1, role: 1 }` - Role-based queries
- `{ email: 1 }` - Email lookup

## 📦 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Testing
npm test                   # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Test coverage

# Code Quality
npm run lint              # Lint code
npm run format            # Format code
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new tenant & user
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/logout` - Logout and invalidate token
- `POST /api/v1/auth/refresh-token` - Get new access token
- `GET /api/v1/auth/me` - Get current user profile

### Users (Protected)
- `GET /api/v1/users` - List all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (admin only)
- `PATCH /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Health
- `GET /health` - Health check
- `GET /` - API information

## 🔜 Next Steps

The following modules are ready to be implemented (see `.taskmaster/tasks/`):

1. **Menu Management** (Tasks 26-40)
   - Products, categories, variants, modifiers
   - Pricing rules, recipes, nutritional info

2. **Inventory Management** (Tasks 41-55)
   - Ingredients, stock tracking
   - Purchase orders, suppliers
   - Batch & expiry tracking

3. **POS & Orders** (Tasks 56-70)
   - Order processing, cart management
   - Multiple payment methods
   - Cash drawer, receipts

4. **Customer Management** (Tasks 71-85)
   - CRM, loyalty programs
   - Segmentation, analytics

5. **Analytics & Reporting** (Tasks 86-100)
   - Sales reports, dashboards
   - Product performance, forecasting

6. **WebSocket/Real-time** (Tasks 101-115)
   - Live order updates
   - Kitchen Display System
   - Notifications

7. **Multi-Store** (Tasks 116-130)
   - Store management
   - Franchise features
   - Consolidated reporting

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker logs pos_mongodb

# Connect to MongoDB shell
docker exec -it pos_mongodb mongosh -u admin -p pos_password_123
```

### Redis Connection Issues

```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
docker exec -it pos_redis redis-cli ping
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📞 Support

For issues or questions:
1. Check the Swagger docs at `/api/docs`
2. Review the task files in `.taskmaster/tasks/`
3. Check the main README.md

## ✨ Summary

You now have a fully functional NestJS backend with:
- ✅ Complete authentication system
- ✅ JWT tokens with refresh capability
- ✅ Role-based access control
- ✅ Multi-tenant support
- ✅ MongoDB & Redis integration
- ✅ API documentation
- ✅ Docker support
- ✅ Production-ready structure

Ready to add more features! 🚀


