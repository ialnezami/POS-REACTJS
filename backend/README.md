# POS System Backend - NestJS

Modern Cloud POS System backend API built with NestJS 10, MongoDB, and Redis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7+
- Redis 7+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start the application
npm run start:dev
```

### Using Docker

```bash
# From project root, start all services
cd ..
docker-compose up -d

# Backend will be available at http://localhost:4000
```

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:
- **Local:** http://localhost:4000/api/docs
- **Docker:** http://localhost:4000/api/docs

## 🔑 Authentication

### Register a New User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "My Business"
}
```

Response includes:
- User details
- `accessToken` (15 min expiry)
- `refreshToken` (7 day expiry)

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "tenantId": "507f1f77bcf86cd799439011"
}
```

### Using Protected Endpoints

Include the access token in the Authorization header:

```bash
GET /api/v1/users
Authorization: Bearer <your-access-token>
```

### Refresh Token

When the access token expires:

```bash
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

## 🏗️ Project Structure

```
src/
├── common/                 # Shared code
│   ├── decorators/        # Custom decorators
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── guards/            # Auth guards
│   │   ├── jwt-auth.guard.ts
│   │   ├── local-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Request interceptors
│   └── pipes/             # Validation pipes
│
├── config/                # Configuration files
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
│
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   │   ├── strategies/
│   │   ├── dto/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   │
│   ├── users/            # User management
│   │   ├── schemas/
│   │   ├── dto/
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   │
│   ├── database/         # Database configuration
│   │   └── database.module.ts
│   │
│   └── cache/            # Redis cache
│       ├── cache.service.ts
│       └── cache.module.ts
│
├── app.module.ts         # Root module
├── app.controller.ts     # Health check
└── main.ts               # Application entry
```

## 🔐 User Roles

The system supports the following roles (RBAC):

- `super_admin` - Platform administrator
- `tenant_admin` - Business owner
- `store_manager` - Store manager
- `cashier` - POS operator
- `inventory_manager` - Inventory management
- `accountant` - Financial access
- `viewer` - Read-only access

### Using Roles in Controllers

```typescript
@Get('sensitive-data')
@Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
async getSensitiveData() {
  // Only admins can access
}
```

## 🗄️ Database

### MongoDB Connection

The application connects to MongoDB using Mongoose. Connection details are in `.env`:

```env
MONGODB_URI=mongodb://admin:password@localhost:27017/pos?authSource=admin
MONGODB_DB_NAME=pos
```

### Indexes

All necessary indexes are created automatically:
- User: `tenantId + email` (unique)
- User: `tenantId + role`

## 💾 Redis Cache

Redis is used for:
- Session storage
- Refresh token storage
- API response caching
- Rate limiting

Configuration in `.env`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Environment Variables

Required environment variables:

```env
# Application
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/pos
MONGODB_DB_NAME=pos

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker build -t pos-backend .
docker run -p 4000:4000 --env-file .env pos-backend
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - List all users (admin)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (admin)
- `PATCH /api/v1/users/:id` - Update user (admin)
- `DELETE /api/v1/users/:id` - Delete user (admin)

### Health
- `GET /health` - Health check endpoint
- `GET /` - API root information

## 🛠️ Development

### Running in Development Mode

```bash
npm run start:dev
```

The server will start with hot-reload enabled on port 4000.

### Debugging

```bash
npm run start:debug
```

Then attach your debugger to port 9229.

### Linting

```bash
npm run lint
npm run format
```

## 📦 Implemented Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Multi-tenant support

✅ **Infrastructure**
- MongoDB integration with Mongoose
- Redis caching
- Swagger API documentation
- Rate limiting
- CORS configuration
- Global validation
- Error handling

✅ **Security**
- Helmet.js security headers
- Input validation with class-validator
- JWT token expiration
- Password strength requirements
- Tenant isolation

## 🔜 Next Steps

The following modules are planned for implementation:

1. **Menu Management** - Products, categories, variants
2. **Inventory Management** - Stock tracking, purchase orders
3. **POS & Orders** - Order processing, payments, cart
4. **Customer Management** - CRM, loyalty programs
5. **Analytics & Reporting** - Sales reports, dashboards
6. **WebSocket** - Real-time updates, KDS
7. **Multi-Store** - Store management, franchises

See `.taskmaster/tasks/` for detailed task breakdowns.

## 📄 License

MIT

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

---

**Built with ❤️ using NestJS**


