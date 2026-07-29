# P314 Production Deployment Guide

## Prerequisites

### Required
- [ ] Successful staging deployment and testing
- [ ] GitHub repository with stable `main` branch
- [ ] Production Vercel account
- [ ] MongoDB Atlas account (M10+ for production SLA)
- [ ] Pi Network App approved for Mainnet

### Recommended
- [ ] Custom domain ready (optional)
- [ ] Backup plan documented
- [ ] Rollback procedure tested
- [ ] Monitoring tools configured

---

## Step 1: Production Database Setup

### 1.1 Create Production MongoDB Atlas Cluster
1. Go to https://cloud.mongodb.com
2. Click "Create" → choose **M10** (or higher for production)
3. **Cluster Name:** `p314-production`
4. **Region:** Choose closest to majority of users
5. **Database User:** Create a dedicated user with `readWrite` on `p314_bot` only
6. **IP Access List:** Add `0.0.0.0/0` (Vercel serverless IPs are dynamic)

### 1.2 Initialize Collections and Indexes
```bash
MONGODB_URI="mongodb+srv://..." node scripts/03-mongodb-access-control.js
```

### 1.3 Get Connection String
1. Atlas → Connect → Drivers
2. Copy URI and replace `<password>`
3. This is your `MONGODB_URI`

---

## Step 2: Pi Network Production App

### 2.1 Create Production Pi App
1. Go to https://develop.pi/apps
2. Create new app (separate from staging)
3. **Redirect URL:** `https://yourdomain.com`
4. **Permissions:** Username, Roles
5. **Mode:** Set to "Production" ONLY when ready
6. Save `PI_API_KEY` and `PI_APP_ID` securely

---

## Step 3: Production Deployment to Vercel

### 3.1 Create Production Project
1. In Vercel, create NEW project (don't use staging)
2. Import GitHub repository → branch: `main`
3. Framework: Next.js (auto-detected)

### 3.2 Configure Production Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot

# Pi Network
PI_API_KEY=your_production_pi_api_key
PI_APP_ID=your-production-app-id
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
NEXT_PUBLIC_PI_NETWORK=mainnet

# Security
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=your_session_secret

# Application
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW_MS=60000
```

### 3.3 Deploy
1. Click "Deploy"
2. Wait for build completion
3. Test with Vercel preview URL before pointing domain

---

## Step 4: Pre-Launch Testing

### 4.1 Test on Preview URL
- [ ] Pi Network authentication
- [ ] MongoDB connection (`[P314 DB] ✓ Connection successful` in logs)
- [ ] All core features
- [ ] Error handling
- [ ] Performance (load times)

### 4.2 Security Audit
- [ ] No API keys in client-side code
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enforced
- [ ] Per-query userId scoping active
- [ ] Input validation working

---

## Step 5: Domain Configuration (Optional)

1. Vercel → Settings → Domains → Add domain
2. Configure DNS: `CNAME` pointing to `cname.vercel-dns.com`
3. Vercel auto-provisions SSL

---

## Step 6: Update Pi Network App

1. Pi Developer Portal → update Redirect URL to production domain
2. Switch app mode to "Production" only when fully ready

---

## Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics
- Enable in Project Settings
- Monitor Real User Monitoring (RUM), Core Web Vitals, error rates

### 7.2 MongoDB Atlas Monitoring
- Enable in Atlas → Monitoring
- Set up alerts for high connection counts, slow queries, storage limits

---

## Step 8: Backups & Recovery

### Database Backups
- Atlas M10+ includes continuous backup with point-in-time recovery
- Export snapshots monthly: Atlas → Backup → Download Snapshot

### Code Backups
- GitHub repository (primary backup)
- Tag releases: `git tag -a v1.0.0 -m "Production release v1.0.0"`
- Vercel keeps deployment history

### Recovery Plan
1. Database: restore from Atlas snapshot or export
2. Code rollback: `vercel rollback` or promote previous Vercel deployment
3. DNS failover: documented separately

---

## Production Maintenance

### Daily Tasks
- [ ] Check Vercel error logs
- [ ] Monitor MongoDB Atlas performance
- [ ] Review analytics
- [ ] Check Pi API status

### Weekly Tasks
- [ ] Review user feedback
- [ ] Update dependencies (security patches)
- [ ] Backup verification
- [ ] Performance review

### Monthly Tasks
- [ ] Security audit
- [ ] Cost optimization review
- [ ] MongoDB index usage review

---

## Emergency Procedures

### Critical Bug Found
```bash
# Rollback via Vercel CLI
vercel rollback

# Or in Vercel Dashboard: Deployments → previous build → Promote to Production
```

### Database Issues
1. Check MongoDB Atlas status page: https://status.mongodb.com
2. Review Atlas Activity Feed for recent operations
3. Check connection pool usage and slow query log

---

## Support Resources

- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Pi Network: https://develop.pi/docs

---

**Last Updated:** July 2026
**Version:** 2.0 (MongoDB)
**Status:** Production-Ready
