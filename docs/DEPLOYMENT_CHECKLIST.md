# P314 Pre-Launch Deployment Checklist

## Phase 1: Staging Environment Setup

### 1.1 Database Setup
- [ ] Create MongoDB Atlas cluster (M0 Free or higher)
- [ ] Copy MONGODB_URI to .env.local
- [ ] Run: `node scripts/03-mongodb-access-control.js` to create indexes
- [ ] Verify all collections created: check Atlas → Collections tab
- [ ] Test connection: check server logs for `[P314 DB] ✓ Connection successful`

### 1.2 Environment Variables
- [ ] Set DATABASE_URL
- [ ] Set NEXT_PUBLIC_PI_API_KEY (from Pi Developer Portal)
- [ ] Set ADMIN_SECRET_KEY (generate random 32-char string)
- [ ] Verify all vars loaded: `npm run check-env`

### 1.3 Build & Deploy to Vercel
```bash
# Install dependencies
npm install

# Build locally
npm run build

# Test production build
npm run start

# Deploy to Vercel
vercel --prod
```

- [ ] Build successful (no TypeScript errors)
- [ ] No console errors in browser
- [ ] All pages load correctly
- [ ] Language switcher works

---

## Phase 2: Feature Verification (Staging)

### 2.1 Authentication
- [ ] Pi Network login works
- [ ] User profile loads
- [ ] Session persists on refresh

### 2.2 Reputation System
- [ ] New user starts at 0 reputation
- [ ] Points increase on activity
- [ ] Level upgrades at correct thresholds (100, 500, 2000)
- [ ] Wallet balance updates correctly

### 2.3 Fraud Reporting
- [ ] User can submit fraud report
- [ ] Report appears in database
- [ ] Validators assigned (3 random investigators+)
- [ ] Consensus reached (2/3 agreement)
- [ ] Rewards distributed correctly

### 2.4 Validator System
- [ ] Only investigators+ see validation panel
- [ ] Reports load correctly
- [ ] Voting works (fraud_confirmed / safe)
- [ ] Rewards paid on correct verdict
- [ ] -5 reputation on wrong verdict

### 2.5 Referral System
- [ ] User can generate referral link
- [ ] New signups tracked correctly
- [ ] 5% commission paid on referred user activities
- [ ] Lifetime earnings accumulate

### 2.6 Bug Bounty
- [ ] User can submit novel fraud pattern
- [ ] Admin sees pending reports
- [ ] Approval grants 10 π + 50 reputation
- [ ] Keywords added to detection system
- [ ] Notifications sent instantly

### 2.7 Admin Dashboard
- [ ] Only admin users can access
- [ ] Treasury balance shows correctly
- [ ] Commission breakdown accurate
- [ ] Revenue config adjustable
- [ ] Transaction logs complete

### 2.8 Localization
- [ ] All 12 languages load
- [ ] Arabic shows RTL layout
- [ ] Language persists on refresh
- [ ] All UI elements translated

---

## Phase 3: Performance Testing

### 3.1 Load Testing
```bash
# Use Artillery or k6
artillery quick --count 100 --num 10 https://your-staging-url.vercel.app
```

- [ ] Homepage loads < 2s
- [ ] API routes respond < 500ms
- [ ] Database queries < 100ms
- [ ] No memory leaks after 1000 requests

### 3.2 Database Optimization
- [ ] All indexes created
- [ ] Query plan optimized (use EXPLAIN ANALYZE)
- [ ] Connection pool configured (max 20)
- [ ] No N+1 query issues

---

## Phase 4: Security Audit

### 4.1 Code Security
- [ ] No hardcoded secrets in code
- [ ] All .env files in .gitignore
- [ ] SQL injection tests pass (use sqlmap)
- [ ] XSS tests pass (use OWASP ZAP)
- [ ] CSRF protection enabled

### 4.2 API Security
- [ ] Rate limiting active (10 req/min per IP)
- [ ] Admin routes check user role
- [ ] Input validation on all forms
- [ ] File upload restrictions (if any)

### 4.3 Data Protection
- [ ] User passwords never stored (Pi auth only)
- [ ] Personal data encrypted at rest
- [ ] HTTPS enforced
- [ ] CORS configured correctly

---

## Phase 5: Monitoring Setup

### 5.1 Error Tracking
- [ ] Sentry integrated
- [ ] Error alerts to Slack/Discord
- [ ] Source maps uploaded

### 5.2 Analytics
- [ ] Vercel Analytics enabled
- [ ] Custom events tracked
- [ ] Conversion funnels defined

### 5.3 Database Monitoring
- [ ] Automated backups (daily)
- [ ] Query performance logging
- [ ] Disk space alerts

---

## Phase 6: Production Deployment

### 6.1 Pre-Deployment
- [ ] All staging tests passed
- [ ] Team review completed
- [ ] Backup current production database
- [ ] Maintenance page ready

### 6.2 Deployment Steps
1. [ ] Enable maintenance mode
2. [ ] Run database migrations
3. [ ] Deploy new code to production
4. [ ] Smoke test critical paths
5. [ ] Disable maintenance mode
6. [ ] Monitor logs for 1 hour

### 6.3 Post-Deployment
- [ ] Verify all features working
- [ ] Check error rates (should be < 0.1%)
- [ ] Monitor database performance
- [ ] Test from different regions
- [ ] Send launch announcement

---

## Phase 7: 48-Hour Monitoring

### Day 1
- [ ] Check error logs every 2 hours
- [ ] Monitor user signups
- [ ] Verify payouts processing
- [ ] Check database size growth
- [ ] Test high-traffic scenarios

### Day 2
- [ ] Review all error reports
- [ ] Check user feedback
- [ ] Optimize slow queries
- [ ] Patch any critical bugs
- [ ] Update documentation

---

## Emergency Rollback Plan

If critical issues arise:

```bash
# 1. Revert to previous deployment
vercel rollback

# 2. Restore database from backup
psql $DATABASE_URL < backup_YYYYMMDD.sql

# 3. Post incident report
- What went wrong
- How we fixed it
- How to prevent in future
```

---

## Success Metrics

### Week 1 Targets
- [ ] 100+ user signups
- [ ] 50+ fraud reports submitted
- [ ] 10+ validators active
- [ ] 5+ bug bounty submissions
- [ ] 0 critical bugs
- [ ] < 1% error rate

### Month 1 Targets
- [ ] 1000+ users
- [ ] 500+ reports validated
- [ ] $100+ in referral commissions paid
- [ ] 10+ approved bug bounties
- [ ] 99.9% uptime

---

## Sign-Off

**Staging Environment:**
- [ ] Tested by: _______________ Date: ___________
- [ ] Approved by: _____________ Date: ___________

**Production Deployment:**
- [ ] Deployed by: _____________ Date: ___________
- [ ] Verified by: _____________ Date: ___________

---

**Next Review:** 30 days after launch
**Contact:** support@p314.app (if issues arise)
