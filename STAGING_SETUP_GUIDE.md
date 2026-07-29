# P314 Bot - Staging Environment Setup Guide

## Overview
This guide prepares the P314 Bot project for the **staging phase** on Pi Network's testnet/sandbox environment.

## Prerequisites
- MongoDB Atlas staging cluster created
- Pi Network testnet/sandbox credentials obtained from Pi Developer Portal
- Vercel project linked and configured
- Environment variables set in Vercel dashboard

---

## Phase 1: Environment Setup

### 1.1 Vercel Environment Variables Configuration

Add these to Vercel project settings (Settings → Environment Variables):

**Database:**
```
MONGODB_URI: mongodb+srv://[user]:[pass]@[cluster].mongodb.net/p314_staging?retryWrites=true&w=majority
MONGODB_DB_NAME: p314_staging
```

**Pi Network (Testnet):**
```
PI_APP_ID: p314-aa57cb98de8ff227
PI_API_KEY: [your-pi-testnet-api-key]
NEXT_PUBLIC_PI_NETWORK_URL: https://api.sandbox.pi-testnet.com
NEXT_PUBLIC_PI_ENV: sandbox
NEXT_PUBLIC_PI_NETWORK: testnet
```

**Encryption (Generate new keys for staging):**
```bash
# Generate 32-byte hex key
openssl rand -hex 32

# Generate 16-byte hex key
openssl rand -hex 16
```

**Session & API:**
```
SESSION_SECRET: [generate-with: openssl rand -base64 32]
NEXT_PUBLIC_API_URL: https://p314-bot-1.vercel.app
NEXT_PUBLIC_ENVIRONMENT: staging
```

### 1.2 Verify Environment Configuration

```bash
cd /vercel/share/v0-project

# Check local env file
cat .env.staging

# Verify Vercel has variables
vercel env ls --yes
```

---

## Phase 2: MongoDB Staging Cluster Setup

### 2.1 Create Staging Collections

Connect to your staging MongoDB cluster and run:

```javascript
// Initialize collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["piUid", "createdAt"],
      properties: {
        piUid: { bsonType: "string" },
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        walletAddress: { bsonType: "string" },
        kycStatus: { enum: ["pending", "verified", "rejected"] },
        reputation: { bsonType: "int" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ piUid: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { sparse: true });
db.users.createIndex({ createdAt: -1 });
```

### 2.2 Run MongoDB Initialization Script

```bash
node scripts/03-mongodb-access-control.js
```

This will:
- Create 11 collections with proper validation
- Build compound indexes for all hot queries
- Set up TTL indexes for ephemeral data

### 2.3 Load Test Data (Optional)

```bash
# Create sample users, messages, and transactions for testing
node scripts/seed-staging-data.js
```

---

## Phase 3: Pi Network Authentication Testing

### 3.1 Validate Pi Auth Flow

Test the authentication endpoint:

```bash
curl -X POST https://p314-bot-1.vercel.app/api/auth/pi-signin \
  -H "Content-Type: application/json" \
  -d '{
    "piUid": "test-user-123",
    "username": "testuser",
    "signature": "[pi-auth-signature]"
  }'

# Expected Response:
# { "success": true, "sessionId": "...", "user": {...} }
```

### 3.2 Validate Wallet Operations

```bash
# Test wallet linking
curl -X POST https://p314-bot-1.vercel.app/api/wallet/link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [session-token]" \
  -d '{ "walletAddress": "0x..." }'
```

### 3.3 Test KYC Verification Flow

Access `/kyc` page in Pi Browser and verify:
- KYC form displays correctly
- Submission saves to MongoDB
- Status updates reflected in user profile

---

## Phase 4: API Routes Testing

### 4.1 Critical API Routes (Must Test First)

```bash
# Chat API
POST /api/chat/send-message

# Bounty System
POST /api/bounty/submit
GET /api/bounty/list

# User Management
GET /api/user/profile
POST /api/user/update-language

# Wallet Operations
POST /api/wallet/connect
POST /api/wallet/disconnect
```

### 4.2 Automated API Testing

```bash
# Run API test suite
pnpm test:api
```

### 4.3 Performance Testing

Monitor database response times and API latency:

```bash
# Check MongoDB connection pool status
node -e "
const { getDatabase } = require('./lib/mongodb-server');
getDatabase().then(db => {
  console.log('Connection successful');
  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
"
```

---

## Phase 5: Security Audit

### 5.1 Check for Secrets Leakage

```bash
# Scan codebase for hardcoded secrets
grep -r "mongodb+srv" app/ lib/ --exclude-dir=node_modules
grep -r "secret\|key\|password" --include="*.ts" app/ lib/ | grep -v "\.env"
```

### 5.2 Validate Rate Limiting

```bash
# Test rate limit (200 requests/min on staging)
for i in {1..250}; do
  curl -s https://p314-bot-1.vercel.app/api/health
done | grep -c "429"  # Should block requests after 200
```

### 5.3 SQL/NoSQL Injection Prevention

Test with malicious payload:

```bash
curl -X POST https://p314-bot-1.vercel.app/api/chat/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{ \$where: \"1==1\" }",
    "sessionId": "..."
  }'

# Should reject or sanitize safely
```

---

## Phase 6: Monitoring & Alerts

### 6.1 Configure Vercel Monitoring

1. Go to Vercel Dashboard → Settings → Monitoring
2. Enable Real-time Alerts
3. Set thresholds:
   - Error Rate: > 5%
   - Response Time: > 2s
   - Cold Starts: > 3s

### 6.2 Database Monitoring

In MongoDB Atlas:
1. Go to Monitoring → Performance Advisor
2. Review slow queries
3. Enable database profiling (sample rate: 10%)

### 6.3 Set Up Error Tracking

```bash
# Install Sentry (optional but recommended)
pnpm add @sentry/nextjs

# Configure in next.config.mjs
```

---

## Phase 7: Deployment Checklist

Before going live, verify:

- [ ] All 8 environment variables set in Vercel
- [ ] MongoDB staging cluster responding (< 100ms)
- [ ] Pi Network testnet credentials validated
- [ ] All 29 API routes tested and working
- [ ] No console errors in browser/server logs
- [ ] Rate limiting working correctly
- [ ] CORS headers configured for Pi Browser
- [ ] Validation key file accessible at `/.well-known/pi-association.json`
- [ ] Domain association verified

---

## Phase 8: Troubleshooting

### Connection Issues

```bash
# Test MongoDB connection
MONGODB_URI="your_uri" node -e "
const { MongoClient } = require('mongodb');
new MongoClient(process.env.MONGODB_URI)
  .connect()
  .then(() => console.log('✓ Connected'))
  .catch(err => console.error('✗ Failed:', err.message))
"
```

### Pi Network Authentication Fails

- Verify `PI_APP_ID` matches Pi Developer Portal
- Check testnet URL is correct: `https://api.sandbox.pi-testnet.com`
- Ensure signature verification in `/api/auth/pi-signin`

### 404 on Validation Key

```bash
# Verify file exists
ls -la public/validation-key.txt
ls -la public/.well-known/pi-association.json

# Check Vercel is serving static files
curl -I https://p314-bot-1.vercel.app/validation-key.txt
```

---

## Ready for Production?

Once all phases complete successfully, the project is ready to:
1. Deploy to Pi Browser staging
2. Invite testnet users for beta testing
3. Collect feedback and iterate
4. Prepare for mainnet production release

Contact Pi Network team: `support@pi.network`
