# Elvis Yawn Bank — Getting Started Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js:** 20+ (LTS)
- **npm/yarn:** 9+
- **Docker:** 20+ (for containerized setup)
- **Docker Compose:** 1.29+
- **PostgreSQL:** 15+ (if not using Docker)
- **Redis:** 7+ (if not using Docker)
- **Git:** Latest

### Installation (Docker Recommended)

#### Option 1: Using Docker Compose (Easiest)

```bash
# Clone the repository
git clone https://github.com/Segun777/elvisyawnbank.git
cd elvisyawnbank

# Create environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Start all services
docker-compose up -d

# Wait for services to be healthy
docker-compose ps

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database Admin: http://localhost:8080 (Adminer)
# Email Testing: http://localhost:8025 (Mailhog)
```

#### Option 2: Local Development Setup

```bash
# Clone repository
git clone https://github.com/Segun777/elvisyawnbank.git
cd elvisyawnbank

# Install dependencies
npm install

# Set up environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Start PostgreSQL (on your machine or Docker)
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres_password_change_me \
  -e POSTGRES_DB=elvisyawnbank \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine

# Run database migrations
cd apps/backend
npm run migration:run

# Return to root
cd ../..

# Start development servers in separate terminals

# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend
cd apps/frontend
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

---

## 📁 Project Structure

```
elvisyawnbank/
├── apps/
│   ├── frontend/          # Next.js 14 customer portal
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── backend/           # NestJS API server
│       ├── src/
│       │   ├── modules/   # Feature modules
│       │   ├── config/    # Configuration
│       │   ├── common/    # Shared utilities
│       │   └── database/  # Database & migrations
│       └── package.json
│
├── docker/                # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── MIGRATION_PLAN.md
│   └── ...
│
├── docker-compose.yml     # Docker Compose configuration
├── turbo.json            # Monorepo build config
├── package.json          # Root package.json
└── README.md
```

---

## 🔑 Key URLs & Credentials

### Application URLs
| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Customer portal |
| **Backend API** | http://localhost:3001/api/v1 | REST API |
| **API Docs** | http://localhost:3001/api/docs | Swagger documentation |
| **Health Check** | http://localhost:3001/health | Service health status |

### Database Access
| Service | Credentials |
|---------|-------------|
| **PostgreSQL** | User: `postgres` / Password: `postgres_password_change_me` |
| **Adminer** | http://localhost:8080 |
| **Redis** | Port: 6379 / Password: `redis_password_change_me` |

### Email Testing
| Service | URL |
|---------|-----|
| **Mailhog** | http://localhost:8025 |
| **SMTP Port** | 1025 |

### Default Admin Credentials (After Seeding)
```
Email: admin@elvisyawnbank.com
Password: Admin@123456
2FA: Disabled by default (enable in /admin/security)
```

### Default Test User
```
Email: user@example.com
Password: User@123456
```

---

## 🗄️ Database Setup

### Run Migrations

```bash
# In backend directory
npm run migration:run

# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert

# Generate new migration (after changing entities)
npm run migration:generate -- src/database/migrations/YourMigrationName
```

### Seed Database with Test Data

```bash
# In backend directory
npm run seed
```

**This creates:**
- 10 test users
- 20 test accounts
- 100 sample transactions
- 50 sample transfers
- Multiple test data for each module

---

## 🏃 Running the Application

### Development Mode

```bash
# With Docker Compose
docker-compose up

# Or locally (separate terminals)
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2
cd apps/frontend && npm run dev
```

### Production Mode

```bash
# Build Docker images
docker-compose -f docker-compose.yml build

# Run in production
docker-compose -f docker-compose.yml up -d
```

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Frontend Tests

```bash
cd apps/frontend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

---

## 📚 API Documentation

### Access Swagger Documentation

1. Start the application
2. Navigate to: http://localhost:3001/api/docs
3. You'll see all available endpoints with:
   - Request/response schemas
   - Authorization requirements
   - Example payloads

### Common API Endpoints

**Authentication**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
```

**Users**
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/devices
```

**Accounts**
```
GET    /api/v1/accounts
POST   /api/v1/accounts
GET    /api/v1/accounts/{id}
PUT    /api/v1/accounts/{id}
```

**Transactions**
```
GET    /api/v1/transactions
GET    /api/v1/transactions/{id}
GET    /api/v1/transactions/search?q=...
```

**Transfers**
```
POST   /api/v1/transfers
GET    /api/v1/transfers/{id}
POST   /api/v1/transfers/{id}/verify
```

### Making API Requests

**With cURL**
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"User@123456"}'

# Use returned JWT token
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With JavaScript/Fetch**
```javascript
// Login
const response = await fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'User@123456'
  })
});

const { data: { token } } = await response.json();

// Use token
const profileResponse = await fetch('http://localhost:3001/api/v1/users/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🔐 Security Notes

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|-----------|
| SSL/TLS | Self-signed | Valid certificates |
| CORS | Open to localhost | Restricted domains |
| JWT Secret | Simple string | 64+ character random |
| Rate Limiting | Disabled | Enabled |
| Logging | Verbose | Minimal |
| Email | Mailhog (testing) | Real SMTP |

### Environment Variables to Change in Production

```bash
# Backend (.env)
NODE_ENV=production
JWT_SECRET=your_secure_random_key_here
JWT_REFRESH_SECRET=your_secure_random_refresh_key
DB_PASSWORD=strong_database_password
REDIS_PASSWORD=strong_redis_password
ENCRYPTION_KEY=your_encryption_key_32_chars
ENCRYPTION_IV=your_encryption_iv_16_chars
MAIL_PASSWORD=your_email_password

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.elvisyawnbank.com/api/v1
```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Ready check
curl http://localhost:3001/ready

# Response example
{
  "status": "healthy",
  "timestamp": "2026-05-08T10:30:00Z",
  "services": {
    "database": true,
    "redis": true,
    "disk": true
  }
}
```

### Logs

```bash
# Backend logs
docker-compose logs backend -f

# Frontend logs
docker-compose logs frontend -f

# All services
docker-compose logs -f
```

### Performance Metrics (Prometheus)

Access Prometheus metrics at: `http://localhost:3001/metrics`

---

## 🐛 Troubleshooting

### "Connection refused" errors

```bash
# Check if services are running
docker-compose ps

# Restart services
docker-compose restart

# View logs
docker-compose logs backend
```

### Database migration errors

```bash
# Revert all migrations
npm run migration:revert -- --all

# Re-run migrations
npm run migration:run
```

### Port already in use

```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Kill process (if needed)
kill -9 <PID>

# Or use different port in .env
```

### Clear cache/reset data

```bash
# Reset Docker environment
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-seed database
npm run seed
```

---

## 📖 Documentation

- **Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Migration Plan:** See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- **Backend Guide:** See [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
- **API Docs:** http://localhost:3001/api/docs (when running)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 Common Tasks

### Create a new database entity

```bash
# Generate entity
cd apps/backend

# Create migration
npm run migration:generate -- src/database/migrations/YourEntityName

# Edit the generated file, then run
npm run migration:run
```

### Add a new API endpoint

See [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for step-by-step module creation.

### Deploy to production

1. Build Docker images: `docker-compose build`
2. Push to registry: `docker push your-registry/image`
3. Deploy to Kubernetes or VM
4. Run database migrations: `npm run migration:run`
5. Set up SSL certificates
6. Configure environment variables

---

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review error logs
3. Create a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

---

## 📄 License

PROPRIETARY — Elvis Yawn Bank © 2026

---

**Next Steps:**
1. ✅ Set up local environment
2. ✅ Explore the codebase
3. ✅ Run tests
4. ✅ Check API documentation
5. ✅ Start implementing features!

**Happy banking! 🏦💳**

