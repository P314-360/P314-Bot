# P314 Bot - Pi Network Validation & Security Checklist

## Overview
Comprehensive checklist for validating Pi Network integration and security before staging deployment.

---

## Phase 1: Pi Network Authentication

### 1.1 Authentication Endpoint Testing

```bash
# Test Pi Signin
curl -X POST https://p314-bot-1.vercel.app/api/auth/pi-signin \
  -H "Content-Type: application/json" \
  -d '{
    "piUid": "test-user-001",
    "username": "testuser",
    "signature": "[pi-auth-signature]"
  }'

# Expected: { "success": true, "sessionId": "...", "user": {...} }
```

**Validation Points:**
- [ ] Returns 200 OK with sessionId
- [ ] Session stored in MongoDB with correct TTL
- [ ] Signature verification working
- [ ] User record created/updated

### 1.2 Session Management

```bash
# Test Session Retrieval
curl -X GET https://p314-bot-1.vercel.app/api/user/profile \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "user": {...} }
```

**Validation Points:**
- [ ] Valid session returns user data
- [ ] Expired session returns 401 Unauthorized
- [ ] Invalid token returns 401 Unauthorized
- [ ] Session timeout enforced (24 hours default)

### 1.3 Logout Flow

```bash
# Test Logout
curl -X POST https://p314-bot-1.vercel.app/api/auth/logout \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "success": true }
```

**Validation Points:**
- [ ] Session deleted from MongoDB
- [ ] Subsequent requests with same token return 401
- [ ] No cached data persists

---

## Phase 2: Pi Network Wallet Integration

### 2.1 Wallet Connection

```bash
# Test Wallet Linking
curl -X POST https://p314-bot-1.vercel.app/api/wallet/link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [sessionId]" \
  -d '{ "walletAddress": "pi1qxxxxxxxxxxxx" }'

# Expected: { "success": true, "wallet": {...} }
```

**Validation Points:**
- [ ] Wallet address stored with user record
- [ ] Address format validated (Pi Network testnet format)
- [ ] Duplicate wallet prevented
- [ ] Timestamp recorded

### 2.2 Wallet Verification

```bash
# Test Wallet Status
curl -X GET https://p314-bot-1.vercel.app/api/wallet/status \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "verified": true|false, "address": "..." }
```

**Validation Points:**
- [ ] Returns correct verification status
- [ ] Shows masked wallet address (for security)
- [ ] Last verified timestamp accurate

### 2.3 Wallet Disconnection

```bash
# Test Wallet Disconnect
curl -X POST https://p314-bot-1.vercel.app/api/wallet/disconnect \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "success": true }
```

**Validation Points:**
- [ ] Wallet removed from user record
- [ ] Transactions still visible (audit trail)
- [ ] Reconnection possible

---

## Phase 3: KYC Integration

### 3.1 KYC Submission

```bash
# POST KYC Form
curl -X POST https://p314-bot-1.vercel.app/api/kyc/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [sessionId]" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "country": "US",
    "birthDate": "1990-01-01"
  }'

# Expected: { "success": true, "status": "pending" }
```

**Validation Points:**
- [ ] KYC record created in MongoDB
- [ ] Status set to "pending"
- [ ] Email validation working
- [ ] No SQL/NoSQL injection in fields

### 3.2 KYC Status Retrieval

```bash
# GET KYC Status
curl -X GET https://p314-bot-1.vercel.app/api/kyc/status \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "status": "pending|verified|rejected", "submittedAt": "..." }
```

**Validation Points:**
- [ ] Returns correct status
- [ ] Timestamp accurate
- [ ] User can only view own KYC

### 3.3 KYC Admin Verification

```bash
# Admin Approves KYC
curl -X POST https://p314-bot-1.vercel.app/api/admin/kyc/verify \
  -H "Authorization: Bearer [admin-token]" \
  -d '{ "userId": "test-user-001", "status": "verified" }'

# Expected: { "success": true }
```

**Validation Points:**
- [ ] Admin token required (not regular user)
- [ ] KYC status updated
- [ ] User notified (webhook)

---

## Phase 4: Transaction & Wallet Operations

### 4.1 Transaction Creation

```bash
# Create Test Transaction
curl -X POST https://p314-bot-1.vercel.app/api/wallet/transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [sessionId]" \
  -d '{
    "to": "pi1recipient",
    "amount": 10,
    "type": "transfer"
  }'

# Expected: { "success": true, "transactionId": "..." }
```

**Validation Points:**
- [ ] Transaction recorded in MongoDB
- [ ] Amount validated (>0, not exceeding balance)
- [ ] Recipient address validated
- [ ] Timestamp recorded

### 4.2 Transaction History

```bash
# Get User Transactions
curl -X GET "https://p314-bot-1.vercel.app/api/wallet/transactions?limit=10" \
  -H "Authorization: Bearer [sessionId]"

# Expected: [ { "id": "...", "amount": 10, ... } ]
```

**Validation Points:**
- [ ] Returns paginated results
- [ ] Sorted by date (newest first)
- [ ] Only user's own transactions visible

### 4.3 Balance Query

```bash
# Check Balance
curl -X GET https://p314-bot-1.vercel.app/api/wallet/balance \
  -H "Authorization: Bearer [sessionId]"

# Expected: { "balance": 1000, "currency": "pi" }
```

**Validation Points:**
- [ ] Accurate balance returned
- [ ] Real-time (not cached)

---

## Phase 5: Security Audit

### 5.1 SQL/NoSQL Injection Prevention

**Test 1: Message with injection payload**

```bash
curl -X POST https://p314-bot-1.vercel.app/api/chat/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{ \$where: \"1==1\" }",
    "sessionId": "..."
  }'

# Should be rejected or safely escaped
```

**Test 2: Username with injection**

```bash
curl -X POST https://p314-bot-1.vercel.app/api/auth/pi-signin \
  -d '{
    "username": "admin' OR '1'='1",
    "piUid": "..."
  }'

# Should be rejected
```

**Validation Points:**
- [ ] Payloads rejected or sanitized
- [ ] No database query errors exposed
- [ ] Error messages generic (no schema info leaks)

### 5.2 Authentication Bypass Prevention

**Test 1: Missing auth header**

```bash
curl -X GET https://p314-bot-1.vercel.app/api/user/profile

# Expected: 401 Unauthorized
```

**Test 2: Invalid token**

```bash
curl -X GET https://p314-bot-1.vercel.app/api/user/profile \
  -H "Authorization: Bearer invalid-token"

# Expected: 401 Unauthorized
```

**Test 3: Cross-user access**

```bash
# After logging in as user1, try to access user2's data
curl -X GET https://p314-bot-1.vercel.app/api/user/profile?userId=user2 \
  -H "Authorization: Bearer [user1-token]"

# Expected: 403 Forbidden (or returns user1's data)
```

**Validation Points:**
- [ ] All protected routes require auth
- [ ] Token validation strict
- [ ] Cross-user access prevented
- [ ] Admin endpoints check admin role

### 5.3 Secrets & Credentials Leakage

```bash
# Check for exposed secrets
grep -r "mongodb\|api_key\|secret" app/ lib/ --include="*.ts" \
  | grep -v "\.env" | grep -v "node_modules"

# Should return NOTHING
```

**Validation Points:**
- [ ] No hardcoded MongoDB URIs
- [ ] No Pi API keys in code
- [ ] No encryption keys in source
- [ ] All secrets in environment variables

### 5.4 Rate Limiting

```bash
# Send 250 requests in quick succession
for i in {1..250}; do
  curl -s https://p314-bot-1.vercel.app/api/health
done | grep -c "429"

# Expected: Should block requests after ~200 (rate limit: 200/min)
```

**Validation Points:**
- [ ] Rate limit enforced
- [ ] Returns 429 Too Many Requests
- [ ] Resets after time window

### 5.5 CORS Configuration

```bash
# Check CORS headers
curl -i -X OPTIONS https://p314-bot-1.vercel.app/api/chat/send-message \
  -H "Origin: https://pi-browser.example.com"

# Should allow pi-browser origin
```

**Validation Points:**
- [ ] Pi Browser origin allowed
- [ ] Credentials allowed (if needed)
- [ ] Other origins rejected

---

## Phase 6: Data Validation

### 6.1 Input Validation

**Tests for each field:**

```bash
# Test max length
curl -X POST https://p314-bot-1.vercel.app/api/chat/send-message \
  -d '{ "message": "[2000+ character string]" }'

# Expected: 400 Bad Request (message too long)

# Test empty/null
curl -X POST https://p314-bot-1.vercel.app/api/chat/send-message \
  -d '{ "message": "" }'

# Expected: 400 Bad Request (empty message)
```

**Validation Points:**
- [ ] Max length enforced (1000 chars for messages)
- [ ] Min length enforced (1 char minimum)
- [ ] Null/undefined rejected
- [ ] Invalid types rejected (e.g., number instead of string)

### 6.2 Email Validation

```bash
# Test valid email
curl -X POST https://p314-bot-1.vercel.app/api/kyc/submit \
  -d '{ "email": "test@example.com" }'

# Test invalid email
curl -X POST https://p314-bot-1.vercel.app/api/kyc/submit \
  -d '{ "email": "invalid-email" }'

# Expected: 400 Bad Request
```

**Validation Points:**
- [ ] RFC 5322 compliant email validation
- [ ] Rejects obvious invalid formats
- [ ] Duplicates prevented

---

## Phase 7: Performance Testing

### 7.1 Response Time SLA

```bash
# Measure response times (should be < 200ms for 95th percentile)
ab -n 100 -c 10 https://p314-bot-1.vercel.app/api/health
```

**Validation Points:**
- [ ] Median response time < 100ms
- [ ] 95th percentile < 200ms
- [ ] No timeouts (p100 < 10s)

### 7.2 Database Query Performance

```bash
# Check slow queries in MongoDB
# Go to MongoDB Atlas → Monitoring → Performance Advisor
# Should see no red flags
```

**Validation Points:**
- [ ] No queries taking > 100ms
- [ ] Indexes properly utilized
- [ ] No N+1 query patterns

### 7.3 Concurrent User Load

```bash
# Simulate 100 concurrent users
ab -n 1000 -c 100 https://p314-bot-1.vercel.app/api/health
```

**Validation Points:**
- [ ] No connection pool exhaustion
- [ ] Error rate < 1%
- [ ] Response times don't degrade under load

---

## Phase 8: Monitoring & Alerting

### 8.1 Vercel Monitoring

- [ ] Error tracking enabled
- [ ] Real-time alerts configured
- [ ] Critical functions instrumented
- [ ] Database performance tracked

### 8.2 MongoDB Monitoring

- [ ] Atlas monitoring enabled
- [ ] Replication lag checked
- [ ] Connection pool monitored
- [ ] Slow query profiler active

### 8.3 Error Logging

```bash
# Check application logs
vercel logs https://p314-bot-1.vercel.app --no-follow | tail -100
```

**Validation Points:**
- [ ] No unhandled exceptions
- [ ] Meaningful error messages
- [ ] Stack traces not exposed to users

---

## Pre-Launch Checklist

- [ ] All authentication tests passed
- [ ] All wallet operations working
- [ ] KYC flow complete
- [ ] No injection vulnerabilities
- [ ] Rate limiting enforced
- [ ] CORS properly configured
- [ ] Data validation strict
- [ ] Performance within SLA
- [ ] Monitoring active
- [ ] Backup/restore tested
- [ ] Rollback plan documented

---

## Failure Resolution

If any test fails:

1. **Document the failure** - Note test name, steps, expected vs actual
2. **Reproduce locally** - Ensure it's reproducible
3. **Fix in code** - Apply fix to source
4. **Test locally** - Verify fix
5. **Re-deploy to staging** - Push to Vercel
6. **Re-run test** - Confirm fix in staging
7. **Document resolution** - Update this document

---

## Sign-Off

**Tested By:** [Your Name]
**Date:** [Date]
**Status:** [ ] PASS [ ] FAIL

**Comments:**
```
[Add any notes here]
```

**Ready for Production:** [ ] YES [ ] NO
