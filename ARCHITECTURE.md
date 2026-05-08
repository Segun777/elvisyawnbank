# Elvis Yawn Bank — Architecture Document

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                          │
├──────────────────────────┬──────────────────────────────────────┤
│   Web Browser            │   Mobile App (React Native)           │
│   (Next.js Frontend)     │   (Planned Phase 2)                   │
└──────────────────────────┴──────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX REVERSE PROXY                           │
│  (SSL/TLS 1.3, Rate Limiting, CORS, Security Headers)          │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
│                    NestJS Application                            │
├──────────────────────────┬──────────────────────────────────────┤
│   Authentication         │   Request Validation                  │
│   Authorization          │   Exception Handling                  │
│   Logging                │   Rate Limiting                       │
└──────────────────────────┴──────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│                  (Feature Modules)                              │
├──────────────────────────────────────────────────────────────────┤
│ Auth │ Users │ Accounts │ Transactions │ Transfers │ Cards      │
│ Deposits │ KYC │ Notifications │ Fraud │ Audit │ Admin          │
└──────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                               │
│           (Business Logic & Rules Engine)                       │
├──────────────────────────────────────────────────────────────────┤
│ • Transaction Processing  • Fraud Detection                      │
│ • Balance Calculations    • Email Generation                     │
│ • Transfer Verification   • Document Storage                     │
└──────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────┬──────────────┬──────────────┬──────────────────┐
│              │              │              │                  │
▼              ▼              ▼              ▼                  ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│PostgreSQL│ │  Redis   │ │  S3/    │ │Mailhog/ │ │ External│
│Database  │ │  Cache   │ │FileStorage│ │SMTP    │ │Services │
│          │ │ Sessions │ │Documents │ │Email   │ │(Banks)  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

## 🗄️ Database Schema Design

### Core Entities & Relationships

#### User Management Layer

```
┌─────────────┐         ┌────────────────┐
│   Users     │◄────────┤ UserDevices    │
├─────────────┤         ├────────────────┤
│ id (UUID)   │         │ id (UUID)      │
│ email       │         │ user_id (FK)   │
│ password    │         │ device_id      │
│ first_name  │         │ ip_address     │
│ last_name   │         │ user_agent     │
│ status      │         │ last_used_at   │
│ 2fa_enabled │         │ created_at     │
│ created_at  │         └────────────────┘
│ updated_at  │
└─────────────┘         ┌────────────────────┐
      │                 │ UserLoginHistory   │
      └────────────────►├────────────────────┤
                        │ id (UUID)          │
                        │ user_id (FK)       │
                        │ ip_address         │
                        │ device_id          │
                        │ success            │
                        │ attempt_count      │
                        │ timestamp          │
                        └────────────────────┘
```

#### Banking Core Layer

```
┌──────────┐          ┌─────────────┐
│ Accounts │◄─────────┤ Balances    │
├──────────┤          ├─────────────┤
│ id (UUID)│          │ id (UUID)   │
│ user_id  │          │ account_id  │
│ type     │          │ available   │
│ number   │          │ pending     │
│ status   │          │ total       │
│ currency │          │ timestamp   │
│ apy      │          └─────────────┘
│ created_at
└──────────┘          ┌──────────────────┐
      │               │ Transactions     │
      └──────────────►├──────────────────┤
                      │ id (UUID)        │
                      │ account_id (FK)  │
                      │ type             │
                      │ amount           │
                      │ description      │
                      │ status           │
                      │ reference_id     │
                      │ created_at       │
                      └──────────────────┘
```

#### Transfer & Beneficiary Layer

```
┌──────────────┐       ┌────────────────┐
│ Beneficiaries│       │ Transfers      │
├──────────────┤       ├────────────────┤
│ id (UUID)    │       │ id (UUID)      │
│ user_id (FK) │       │ from_user (FK) │
│ name         │       │ to_account (FK)│
│ account_num  │       │ amount         │
│ bank_code    │       │ type           │
│ verified     │       │ status         │
│ created_at   │       │ reference_id   │
└──────────────┘       │ verification   │
                       │ created_at     │
                       └────────────────┘
```

#### Card Management Layer

```
┌────────┐         ┌──────────────────┐
│ Cards  │◄────────┤ CardTransactions │
├────────┤         ├──────────────────┤
│ id     │         │ id (UUID)        │
│account │         │ card_id (FK)     │
│ type   │         │ merchant         │
│ number │         │ amount           │
│ status │         │ currency         │
│ limits │         │ status           │
│ frozen │         │ created_at       │
│ expiry │         └──────────────────┘
└────────┘
```

#### Compliance Layer

```
┌────────────────┐    ┌──────────────┐
│ KycVerification│    │ KycDocuments │
├────────────────┤    ├──────────────┤
│ id (UUID)      │    │ id (UUID)    │
│ user_id (FK)   │    │ kyc_id (FK)  │
│ status         │    │ type         │
│ rejection_reason│   │ file_path    │
│ verified_at    │    │ verified_at  │
│ expires_at     │    │ created_at   │
└────────────────┘    └──────────────┘

┌──────────────┐       ┌────────────┐
│ Deposits     │       │ DepositImages
├──────────────┤       ├────────────┤
│ id (UUID)    │       │ id (UUID)  │
│ user_id (FK) │       │ deposit_id │
│ amount       │◄──────│ side       │
│ status       │       │ image_path │
│ fraud_score  │       │ ocr_data   │
│ admin_note   │       │ created_at │
│ created_at   │       └────────────┘
└──────────────┘
```

#### Notifications & Audit Layer

```
┌──────────────────┐  ┌─────────────┐
│ Notifications    │  │ AuditLogs   │
├──────────────────┤  ├───��─────────┤
│ id (UUID)        │  │ id (UUID)   │
│ user_id (FK)     │  │ user_id     │
│ type             │  │ action      │
│ recipient_email  │  │ entity_type │
│ subject          │  │ entity_id   │
│ body             │  │ changes     │
│ status           │  │ ip_address  │
│ sent_at          │  │ timestamp   │
│ created_at       │  └─────────────┘
└──────────────────┘

┌──────────────┐
│ FraudFlags   │
├──────────────┤
│ id (UUID)    │
│ user_id (FK) │
│ type         │
│ score        │
│ reason       │
│ resolved     │
│ created_at   │
└──────────────┘
```

### Key Indexes for Performance

```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Accounts table
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_status ON accounts(status);

-- Transactions table
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Transfers table
CREATE INDEX idx_transfers_from_user ON transfers(from_user_id);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_transfers_created_at ON transfers(created_at DESC);

-- Login history
CREATE INDEX idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX idx_login_history_timestamp ON user_login_history(timestamp DESC);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```

---

## 🔌 REST API Endpoints (50+)

### Authentication Endpoints

```
POST   /api/v1/auth/register          # User registration
POST   /api/v1/auth/login             # Login with email/password
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/refresh           # Refresh JWT token
POST   /api/v1/auth/2fa/setup         # Enable 2FA (TOTP)
POST   /api/v1/auth/2fa/verify        # Verify 2FA code
POST   /api/v1/auth/password/forgot   # Request password reset
POST   /api/v1/auth/password/reset    # Reset password with token
POST   /api/v1/auth/email/verify      # Verify email address
```

### User Management

```
GET    /api/v1/users/profile          # Get current user profile
PUT    /api/v1/users/profile          # Update profile
GET    /api/v1/users/devices          # List user devices
DELETE /api/v1/users/devices/{id}     # Remove device
GET    /api/v1/users/login-history    # Get login history
GET    /api/v1/users (ADMIN)          # List all users
POST   /api/v1/users (ADMIN)          # Create user
PUT    /api/v1/users/{id} (ADMIN)     # Update user
DELETE /api/v1/users/{id} (ADMIN)     # Delete user
```

### Account Management

```
GET    /api/v1/accounts               # List user accounts
POST   /api/v1/accounts               # Create new account
GET    /api/v1/accounts/{id}          # Get account details
PUT    /api/v1/accounts/{id}          # Update account
DELETE /api/v1/accounts/{id}          # Close account
GET    /api/v1/accounts/{id}/balance  # Get current balance
POST   /api/v1/accounts/{id}/freeze   # Freeze account
POST   /api/v1/accounts/{id}/unfreeze # Unfreeze account
GET    /api/v1/accounts/{id}/statement # Download statement (PDF)
```

### Transactions

```
GET    /api/v1/transactions           # List transactions
GET    /api/v1/transactions/{id}      # Get transaction details
GET    /api/v1/transactions/search    # Search transactions
GET    /api/v1/transactions/export    # Export to CSV/PDF
```

### Transfers

```
POST   /api/v1/transfers              # Initiate transfer
GET    /api/v1/transfers/{id}         # Get transfer details
POST   /api/v1/transfers/{id}/verify  # Verify transfer
POST   /api/v1/transfers/{id}/cancel  # Cancel transfer
GET    /api/v1/transfers/history      # Transfer history
POST   /api/v1/transfers/schedule     # Schedule transfer
GET    /api/v1/transfers/recurring    # List recurring transfers
```

### Beneficiaries

```
GET    /api/v1/beneficiaries          # List beneficiaries
POST   /api/v1/beneficiaries          # Add beneficiary
PUT    /api/v1/beneficiaries/{id}     # Update beneficiary
DELETE /api/v1/beneficiaries/{id}     # Remove beneficiary
```

### Cards

```
GET    /api/v1/cards                  # List cards
POST   /api/v1/cards                  # Create card (virtual)
GET    /api/v1/cards/{id}             # Get card details
POST   /api/v1/cards/{id}/freeze      # Freeze card
POST   /api/v1/cards/{id}/unfreeze    # Unfreeze card
PUT    /api/v1/cards/{id}/limits      # Update spending limits
GET    /api/v1/cards/{id}/transactions # Card transactions
```

### Check Deposits

```
POST   /api/v1/deposits               # Upload check deposit
GET    /api/v1/deposits/{id}          # Get deposit status
GET    /api/v1/deposits               # List user deposits
```

### KYC Verification

```
POST   /api/v1/kyc/verify             # Start KYC process
POST   /api/v1/kyc/documents          # Upload documents
GET    /api/v1/kyc/status             # Get KYC status
```

### Admin Endpoints

```
GET    /api/v1/admin/users            # Admin: list all users
GET    /api/v1/admin/transactions     # Admin: all transactions
POST   /api/v1/admin/transactions/{id}/approve  # Approve transaction
POST   /api/v1/admin/transactions/{id}/reject   # Reject transaction
GET    /api/v1/admin/deposits         # Admin: all deposits
POST   /api/v1/admin/deposits/{id}/approve      # Approve deposit
POST   /api/v1/admin/deposits/{id}/reject       # Reject deposit
GET    /api/v1/admin/fraud-flags      # Fraud monitoring
GET    /api/v1/admin/audit-logs       # Audit logs
GET    /api/v1/admin/analytics        # Platform analytics
```

---

## 🔐 Security Implementation

### Authentication Flow

```
1. User enters credentials
                ▼
2. Hash password with bcrypt
                ▼
3. Verify password hash
                ▼
4. Generate JWT token (15 min expiry)
                ▼
5. Generate Refresh token (7 days expiry)
                ▼
6. Store refresh token in Redis
                ▼
7. Return both tokens to client
                ▼
8. Client stores JWT in memory, refresh token in secure cookie
                ▼
9. All subsequent requests include JWT in Authorization header
                ▼
10. JWT expires → Client uses refresh token to get new JWT
```

### Authorization (RBAC)

```
Super Admin
├── Manage all users
├── Manage all transactions
├── Manage system settings
├── View all audit logs
└── Emergency access controls

Admin
├── Manage transactions
├── Approve/reject deposits
├── Manage fraud flags
├── View audit logs
└── Generate reports

Manager
├── View transactions
├── Review deposits (read-only)
├── View user accounts
└── Generate reports

Support
├── View customer accounts
├── View transactions
└── Submit support tickets

User
├── View own accounts
├── Make transfers
├── Manage cards
└── View own transactions
```

### Encryption Strategy

```
At Rest:
├── Sensitive fields (SSN, passwords) → AES-256-CBC
├── Credit card data → Tokenization (not stored)
└── PII → Encrypted with keys rotated monthly

In Transit:
├── All API traffic → TLS 1.3
├── JWT tokens → Signed with HS256
└── Passwords → Never transmitted in plaintext

Key Management:
├── Master key stored in environment
├── Per-request keys rotated
├── Separate keys for different data types
└── Key rotation schedule: Monthly
```

### Threat Protection

```
Rate Limiting:
├── 10 failed login attempts → 15 min lockout
├── API: 1000 req/min per user
├── Auth: 5 req/min per IP
└── Admin: 100 req/min per admin

Fraud Detection:
├── Geo-location mismatch detection
├── Unusual transaction patterns
├── Multiple device login detection
├── Velocity checks (max transfers/day)
└── Manual review workflow for high-risk transactions

Device Fingerprinting:
├── User-Agent tracking
├── IP address tracking
├── Device ID tracking
├── Time zone validation
└── Browser fingerprinting
```

---

## 📊 Performance Optimization

### Caching Strategy

```
Redis Caching:
├── User profiles (TTL: 1 hour)
├── Account balances (TTL: 5 min)
├── Exchange rates (TTL: 30 min)
├── JWT blacklist (TTL: token expiry)
├── Session data (TTL: 24 hours)
└── Rate limit counters (TTL: 1 min)

Database Query Optimization:
├── Connection pooling (min: 5, max: 20)
├── Query batching
├── N+1 query prevention
├── Index optimization
└── Query result caching
```

### Database Performance

```
Transaction Handling:
├── ACID compliance enforced
├── Optimistic locking for concurrent updates
├── Connection pooling
├── Statement caching
└── Query timeout: 30 seconds

Pagination:
├── Default page size: 20
├── Max page size: 100
├── Cursor-based for large datasets
└── Server-side sorting/filtering
```

---

## 📈 Scalability Architecture

### Horizontal Scaling

```
Load Balancer (Nginx)
        ▼
    ┌───┴───┬───────┬────────┐
    ▼       ▼       ▼        ▼
  Pod 1   Pod 2   Pod 3   Pod N
  (App)   (App)   (App)   (App)
    │       │       │        │
    └───┬───┴───┬───┴────┬───┘
        ▼       ▼        ▼
    PostgreSQL PostgreSQL (Replica)
    (Primary)  (Backup)

    Redis Cluster (3+ nodes)
```

### Database Replication

```
Primary Database (Write)
        ▼
    ┌───┬───────┬──────┐
    ▼   ▼       ▼      ▼
  Read Replica (Read Only)
  Read Replica (Read Only)
  Backup (Async)
```

### Message Queue Architecture

```
Application
    ▼
Bull Queue (Redis-backed)
    ├── Email sending
    ├── Fraud detection
    ├── Report generation
    ├── Notifications
    └── Backup jobs
    
    ▼
Workers (Separate process)
    ├── Email Worker
    ├── Notification Worker
    ├── Fraud Worker
    └── Report Worker
```

---

## 🔍 Monitoring & Observability

### Metrics Collection

```
Application Metrics:
├── Request count (per endpoint)
├── Response time (p50, p95, p99)
├── Error rate (5xx, 4xx)
├── Authentication attempts
├── Active sessions
└── Queue depth

System Metrics:
├── CPU usage
├── Memory usage
├── Disk usage
├── Network I/O
└── Connection count

Database Metrics:
├── Query response time
├── Connection count
├── Slow query log
├── Replication lag
└── Backup status
```

### Alerting Thresholds

```
Critical (Page):
├── Error rate > 5%
├── Response time p95 > 5s
├── Database down
├── Memory > 90%

Warning (Email):
├── Error rate > 2%
├── Response time p95 > 1s
├── CPU > 80%
├── Disk > 70%

Info (Logs):
├── Deployment events
├── Large transactions
├── Admin actions
└── Configuration changes
```

---

## 🚀 Deployment Stages

### Development
- Single Docker container
- SQLite or local PostgreSQL
- Redis on localhost
- Hot reload enabled

### Staging
- 2 application pods
- PostgreSQL with replication
- Redis cluster
- Full monitoring enabled

### Production
- 3+ application pods (auto-scaling)
- PostgreSQL with HA setup
- Redis Cluster (6 nodes)
- CDN for static assets
- Full observability stack

---

## 📡 External Integrations

### Banking APIs
```
ACH Network Integration:
├── API: FedACH compatible
├── Processing: T+1 (next business day)
├── Confirmation: Immediate

Wire Transfer Integration:
├── API: SWIFT compatible
├── Processing: Immediate
├── Confirmation: Real-time

Check Processing:
├── OCR: Tesseract integration
├── Validation: Check21 standards
├── Fraud: Score calculation
```

### Third-party Services
```
Email Service:
├── Primary: SendGrid/AWS SES
├── Fallback: SMTP relay
├── Retry: 5 attempts

SMS (Future):
├── Twilio integration
├── Rate limiting: 5 per hour per user
├── Opt-in management

Analytics:
├── Segment integration
├── Event tracking
├── Custom dashboards
```

---

## 🔄 Data Flow Examples

### Transaction Flow

```
User Initiates Transfer
    ▼
Validate amount & balance
    ▼
Check fraud score
    ▼
Create transaction record (PENDING)
    ▼
Queue email notification
    ▼
Process transfer (debit account A, credit account B)
    ▼
Update balance in Redis cache
    ▼
Mark transaction COMPLETED
    ▼
Queue confirmation email
    ▼
Log audit trail
```

### Check Deposit Flow

```
User Uploads Check Images
    ▼
Validate file format & size
    ▼
Store in S3/storage
    ▼
Queue OCR processing
    ▼
Extract check data
    ▼
Check for duplicates
    ▼
Calculate fraud score
    ▼
Mark as PENDING_REVIEW
    ▼
Notify admin
    ▼
Admin Reviews & Approves
    ▼
Process deposit (same as transaction)
    ▼
Send confirmation email
```

---

## 💾 Disaster Recovery

### RTO & RPO Targets
- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 15 minutes

### Backup Strategy
```
Database:
├── Daily full backup (retained 30 days)
├── Hourly incremental backup (retained 7 days)
├── Real-time replication to backup region
└── Test recovery: Monthly

Files/Storage:
├── S3 versioning enabled
├── Cross-region replication
├── Lifecycle policies
└── Immutable backups

Configuration:
├── Infrastructure as Code (Terraform)
├── GitOps for deployments
├── Configuration snapshots
└── Secret rotation logs
```

### Failover Procedures
```
Database Failover:
├── Detect primary failure (3 consecutive failed health checks)
├── Promote read replica to primary (< 1 minute)
├── Update connection strings (< 30 seconds)
├── Resume write operations

Application Failover:
├── Traffic rerouted to healthy pods (Kubernetes)
├── Auto-scale to maintain capacity
├── Health checks every 10 seconds
└── Circuit breakers prevent cascading failures
```

---

## 🎯 Success Metrics

**Reliability:**
- Uptime: 99.95%+
- MTTF (Mean Time To Failure): > 1 month
- MTTR (Mean Time To Recovery): < 1 hour

**Performance:**
- Response time p95: < 200ms
- Response time p99: < 500ms
- Error rate: < 0.1%

**Security:**
- Zero data breaches
- 100% encryption compliance
- Audit log completeness: 100%
- Security scan findings: 0 critical

**Scalability:**
- Support 100M+ users
- Handle 10K requests/second
- Support 1M+ concurrent users
- Database growth: 1TB+/year

---

**Created:** 2026-05-08  
**Status:** Production-Ready  
**Owner:** Elvis Yawn Bank Engineering Team

