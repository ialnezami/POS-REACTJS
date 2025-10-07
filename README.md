# Modern Cloud POS System

A modern, cloud-native Point of Sale (POS) system built with cutting-edge web technologies.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (React 18, TypeScript, Tailwind CSS)
- **Backend**: NestJS 10+ (TypeScript, MongoDB, Redis)
- **Database**: MongoDB 7+
- **Cache**: Redis 7+
- **Infrastructure**: Docker, Docker Compose

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: v18+ (LTS)
- **npm**: v9+
- **Docker**: v24+
- **Docker Compose**: v2.20+
- **Git**: v2.40+

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd POS-REACTJS
```

### 2. Environment Setup

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Edit `.env` and update the following critical variables:
- `JWT_SECRET` - Change to a strong secret
- `JWT_REFRESH_SECRET` - Change to a strong secret
- `MONGO_PASSWORD` - Change to a secure password
- `REDIS_PASSWORD` - Change to a secure password

### 3. Start with Docker Compose

Start all services (MongoDB, Redis, Backend, Frontend):

```bash
docker-compose up -d
```

To view logs:

```bash
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **API Documentation**: http://localhost:4000/api/docs
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🔧 Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

The backend will be available at http://localhost:4000

### Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
npm test
```

## 🐳 Docker Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mongodb redis

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ will delete data)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p pos_password_123
```

## 📁 Project Structure

```
POS-REACTJS/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js 14 app router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and helpers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── stores/       # Zustand state management
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   ├── Dockerfile        # Frontend Docker configuration
│   └── package.json
│
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared code
│   │   ├── config/       # Configuration
│   │   └── main.ts       # Entry point
│   ├── test/             # Tests
│   ├── Dockerfile        # Backend Docker configuration
│   └── package.json
│
├── scripts/              # Utility scripts
│   └── mongo-init.js     # MongoDB initialization
│
├── docker-compose.yml    # Docker Compose configuration
├── .env.example          # Environment variables template
├── PRD.md               # Product Requirements Document
└── README.md            # This file
```

## 🔐 Security

### Important Security Notes

1. **Change Default Passwords**: Always change default passwords in production
2. **JWT Secrets**: Use strong, random secrets for JWT tokens
3. **Environment Variables**: Never commit `.env` files to version control
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Configure appropriate rate limits
6. **CORS**: Configure CORS to allow only trusted origins

### Security Checklist for Production

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Enable Redis password
- [ ] Set up proper CORS policies
- [ ] Configure rate limiting
- [ ] Enable security headers (Helmet.js)
- [ ] Regular security updates
- [ ] Set up monitoring and alerts

## 📊 Database

### MongoDB

Access MongoDB shell:

```bash
docker-compose exec mongodb mongosh -u admin -p pos_password_123
```

### Redis

Access Redis CLI:

```bash
docker-compose exec redis redis-cli -a redis_password_123
```

### Backup & Restore

**MongoDB Backup:**
```bash
docker-compose exec mongodb mongodump --uri="mongodb://admin:pos_password_123@localhost:27017/pos?authSource=admin" --out=/backup
```

**MongoDB Restore:**
```bash
docker-compose exec mongodb mongorestore --uri="mongodb://admin:pos_password_123@localhost:27017/pos?authSource=admin" /backup/pos
```

## 🚀 Deployment

### Production Deployment

For production deployment, consider:

1. **Frontend**: Deploy to Vercel, Netlify, or AWS Amplify
2. **Backend**: Deploy to AWS ECS, Google Cloud Run, or Kubernetes
3. **Database**: Use MongoDB Atlas (managed service)
4. **Cache**: Use Redis Cloud or AWS ElastiCache
5. **CDN**: Use Cloudflare or AWS CloudFront

### Environment Variables for Production

Update the following in production:

```bash
NODE_ENV=production
MONGO_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
JWT_SECRET=<random-256-bit-secret>
JWT_REFRESH_SECRET=<random-256-bit-secret>
NEXT_PUBLIC_API_URL=https://api.yourpos.com/api/v1
CORS_ORIGIN=https://yourpos.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@yourpos.com or join our Slack channel.

## 🙏 Acknowledgments

- Built with ❤️ by the POS System Team
- Special thanks to all contributors

---

**Documentation**: See [PRD.md](PRD.md) for detailed product requirements and architecture.

