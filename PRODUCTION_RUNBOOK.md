# P314 Bot - Production Runbook & Deployment Guide

## Quick Reference

**Project:** P314 Smart Support Bot for Pi Network  
**Repository:** vxvx314/P314-bot-1  
**Production URL:** https://p314-bot-1.vercel.app  
**Staging Environment:** v0/kvip9340-5616-*  
**Database:** MongoDB Atlas (staging & production clusters)  
**Status Page:** [TBD]

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript compilation passes (`pnpm exec tsc --noEmit`)
- [ ] No lint errors (`pnpm exec eslint app lib`)
- [ ] Unit tests pass (`pnpm test`)
- [ ] All 29 API routes tested manually
- [ ] No console.error in production code

### Security
- [ ] No hardcoded secrets in codebase
- [ ] All environment variables set in Vercel
- [ ] HTTPS enabled (Vercel default)
- [ ] CORS headers configured
- [ ] Rate limiting configured (200 req/min)
- [ ] Input validation on all endpoints
- [ ] Pi Network signature verification working

### Database
- [ ] MongoDB backups enabled (daily)
- [ ] Connection pooling configured
- [ ] Indexes created for all collections
- [ ] Test data cleaned from production DB
- [ ] Database user permissions restricted

### Vercel Configuration
- [ ] `.vercel.json` validated (no schema errors)
- [ ] All env vars present in production
- [ ] Build command verified: `pnpm build`
- [ ] Install command verified: `pnpm install --frozen-lockfile`
- [ ] Build succeeds locally and on Vercel

---

## Deployment Process

### Phase 1: Pre-Deployment (30 min before)

```bash
# 1. Pull latest from main
git checkout main
git pull origin main

# 2. Verify build locally
NEXT_PHASE=phase-production-build pnpm build

# 3. Run smoke tests
pnpm test:smoke

# 4. Check for any uncommitted changes
git status
```

### Phase 2: Deploy to Vercel (5 min)

**Option A: Automatic (GitHub integration)**
- Push to `main` branch → Vercel automatically deploys
- Monitor: Vercel Dashboard → Deployments

**Option B: Manual (Vercel CLI)**
```bash
# Deploy from current directory
vercel --prod --yes

# Confirm production URL
echo "Deployed to: https://p314-bot-1.vercel.app"
```

### Phase 3: Post-Deployment Verification (10 min)

```bash
# 1. Check health endpoint
curl https://p314-bot-1.vercel.app/api/health

# 2. Verify database connection
curl https://p314-bot-1.vercel.app/api/health/db

# 3. Check Pi Network integration
curl -X GET https://p314-bot-1.vercel.app/api/health/pi-network

# 4. Verify validation key accessible
curl https://p314-bot-1.vercel.app/validation-key.txt

# 5. Check error logs (last 5 min)
vercel logs https://p314-bot-1.vercel.app --no-follow | tail -20
```

### Phase 4: Smoke Test (5 min)

```bash
# Test authentication flow
STAGING_TEST=false pnpm test:smoke

# Manual test: Open in Pi Browser
# 1. Sign in with testnet credentials
# 2. Send a message
# 3. Check user profile
# 4. Verify database stores data
```

---

## Rollback Procedure

If deployment fails or critical issues emerge:

### Immediate Rollback (< 5 min)

```bash
# Option 1: Revert to previous deployment
vercel rollback --yes

# Or Option 2: Deploy previous version
git checkout HEAD~1
vercel --prod --yes

# Verify rollback succeeded
curl https://p314-bot-1.vercel.app/api/health
```

### Database Rollback

If data corruption occurred:

```bash
# 1. Stop all application traffic (block in Vercel)
# 2. Restore MongoDB from backup
#    - Go to MongoDB Atlas → Backup & Restore
#    - Select backup point before deployment
#    - Restore to new cluster
# 3. Update MONGODB_URI in Vercel env vars
# 4. Redeploy application
# 5. Verify data integrity
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

**Performance:**
- Response time (p95 < 200ms)
- Error rate (< 1%)
- Database latency (< 100ms)

**Business:**
- Active users
- Messages sent
- Transactions completed
- KYC approvals

### Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Error Rate | > 2% | > 5% | Check logs, rollback if > 10% |
| Response Time (p95) | > 300ms | > 500ms | Check database, scale if needed |
| MongoDB Latency | > 150ms | > 300ms | Check connection pool, add replicas |
| CPU Usage | > 70% | > 90% | Review slow queries, add caching |

### Daily Checks

```bash
# Morning check: Last 24h errors
vercel logs https://p314-bot-1.vercel.app --no-follow | grep -i "error\|exception" | wc -l

# Check database replication lag
# MongoDB Atlas → Networking → Replica Set Status

# Review slow queries
# MongoDB Atlas → Monitoring → Performance Advisor
```

---

## Common Issues & Resolution

### Issue: "Connection Refused" to MongoDB

**Symptoms:**
- All API requests fail with 500
- Logs show: "Failed to connect to MongoDB"

**Solution:**
```bash
# 1. Check MONGODB_URI is set
vercel env ls | grep MONGODB

# 2. Verify cluster is running
# Go to MongoDB Atlas → Clusters

# 3. Check IP whitelist
# MongoDB Atlas → Security → Network Access

# 4. Test connection
node -e "
const { MongoClient } = require('mongodb');
new MongoClient(process.env.MONGODB_URI)
  .connect()
  .then(() => console.log('✓ OK'))
  .catch(e => console.error('✗ Failed:', e.message))
"
```

### Issue: High Error Rate (> 5%)

**Solution:**
```bash
# 1. Check error logs
vercel logs https://p314-bot-1.vercel.app --no-follow | tail -50

# 2. Identify pattern
# - All errors same type? (e.g., MongoDB timeouts)
# - Affects specific endpoint?
# - Related to concurrent load?

# 3. Based on pattern:
# - MongoDB timeout → Increase connection timeout, add replicas
# - Rate limit exceeded → Check for traffic spike
# - Missing env var → Verify Vercel env vars
# - Logic error → Hotfix and redeploy
```

### Issue: Slow Responses (p95 > 300ms)

**Solution:**
```bash
# 1. Check MongoDB latency
# MongoDB Atlas → Monitoring → Latency

# 2. Review slow queries
# MongoDB Atlas → Monitoring → Performance Advisor
# Apply recommended indexes

# 3. Check for N+1 queries
grep -r "find\|findOne" app/api --include="*.ts" | grep -v "index"

# 4. Enable caching for frequently accessed data
# Update API routes with cache headers

# 5. Consider database replication
# Add read replicas for read-heavy operations
```

---

## Backup & Recovery

### Automated Backups (MongoDB Atlas)

**Status:** ✓ Enabled  
**Frequency:** Daily snapshots (7-day retention)  
**Location:** MongoDB Atlas Console → Backup & Restore  

### Manual Backup

```bash
# Export production database
mongodump \
  --uri="$MONGODB_URI" \
  --out=./backup-$(date +%Y%m%d)

# Backup size estimate
du -sh backup-*

# Store securely (S3, GitHub Releases, etc.)
```

### Restore Procedure

```bash
# 1. Create new MongoDB cluster
# 2. Restore from backup
mongorestore \
  --uri="$NEW_MONGODB_URI" \
  ./backup-20240115

# 3. Verify data integrity
# - Check user count: db.users.countDocuments()
# - Check message count: db.messages.countDocuments()

# 4. Update MONGODB_URI in Vercel
vercel env add MONGODB_URI

# 5. Redeploy and verify
vercel --prod --yes
```

---

## Scaling & Performance

### When to Scale

**Vertical Scaling (Upgrade Vercel):**
- When p99 response time > 500ms
- When seeing "Function timeout" errors
- After peak traffic events

**Horizontal Scaling (Database):**
- When MongoDB connection pool exhausted
- When database latency > 200ms
- After user count doubles

### Scaling MongoDB

```bash
# 1. Add read replicas
# MongoDB Atlas → Clusters → Add Replica Set

# 2. Increase connection pool
# Update connection string: maxPoolSize=50

# 3. Enable sharding (for > 1M documents)
# MongoDB Atlas → Enable Sharding
```

---

## Security Updates

### Regular Security Checks

**Weekly:**
- Review error logs for suspicious activity
- Check Pi Network for security advisories
- Monitor MongoDB security patches

**Monthly:**
- Rotate encryption keys (if needed)
- Audit access logs
- Run security scan: `npm audit`

**Quarterly:**
- Penetration test (engage security firm)
- Security training for team
- Update dependencies

### Responding to Security Issues

```bash
# 1. Identify issue
# 2. Create hotfix branch
git checkout -b hotfix/security-issue-name

# 3. Apply fix
# 4. Test thoroughly
pnpm test

# 5. Commit and push
git add .
git commit -m "security: fix [issue]"
git push origin hotfix/security-issue-name

# 6. Create PR and merge to main
# 7. Deploy to production immediately
vercel --prod --yes

# 8. Notify users if needed
# 9. Post-mortem: analyze root cause
```

---

## Disaster Recovery Plan

### Disaster Scenarios

| Scenario | Impact | Recovery Time | Steps |
|----------|--------|---|---|
| Vercel down | Full outage | 15 min | Wait for Vercel or failover to backup region |
| MongoDB lost | Data loss | 30 min | Restore from backup |
| Code bug | Functionality broken | 5 min | Rollback to previous deployment |
| DDoS attack | Performance degradation | Ongoing | Enable DDoS protection, rate limiting |
| Pi Network outage | Auth unavailable | N/A | Display maintenance message |

### Disaster Recovery Runbook

```
1. DETECT (Automated alerts)
   ↓
2. ASSESS (Is this critical?)
   ├─ YES → Go to 3
   └─ NO → Monitor and log
   
3. COMMUNICATE
   - Update status page
   - Notify team Slack/Email
   - Inform users if > 5min downtime
   
4. EXECUTE RECOVERY
   - Check Vercel status
   - Check MongoDB status
   - Review error logs
   - Execute appropriate runbook
   
5. VERIFY
   - Run smoke tests
   - Check all endpoints
   - Verify data integrity
   
6. DOCUMENT
   - Record incident in Slack
   - Create postmortem ticket
   - Update runbooks if needed
```

---

## Contact & Escalation

### Team
- **Tech Lead:** [Name] - [Email]
- **DevOps:** [Name] - [Email]
- **On-Call:** [Rotation Setup]

### External Support
- **Vercel Support:** support@vercel.com
- **MongoDB Support:** support.mongodb.com
- **Pi Network:** support@pi.network

### Escalation Path
1. Try to fix (5 min)
2. Reach out to team lead (5 min)
3. Page on-call engineer (1 min)
4. Contact external support if needed (15 min)

---

## Last Updated
**Date:** [Insert Date]  
**Updated By:** [Name]  
**Next Review:** [Insert Date + 30 days]
