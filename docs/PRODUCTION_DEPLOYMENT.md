# P314 Production Deployment Guide

## Overview
This guide covers deploying P314 to production on Vercel with separate projects for Testnet and Mainnet.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│          Domain & DNS Management               │
├─────────────────────────────────────────────────┤
│  testnet.p314.app ──────> Testnet Project      │
│  app.p314.app / p314.app -> Mainnet Project    │
└─────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
    Vercel Project 1        Vercel Project 2
  (Testnet/Staging)        (Mainnet/Production)
         │                        │
         ├─ GitHub Branch        ├─ GitHub Branch
         │  v0/testnet           │  main
         │                        │
         └─ Environment          └─ Environment
            Variables              Variables
            (Test SDK)             (Mainnet SDK)
```

## 1. Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`pnpm exec tsc --noEmit`)
- [ ] ESLint clean (`pnpm exec eslint .`)
- [ ] No console errors or warnings
- [ ] All dependencies up-to-date
- [ ] No hardcoded credentials or secrets

### Performance
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals all green
- [ ] Database queries optimized
- [ ] Caching strategy implemented

### Security
- [ ] All inputs validated
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Dependencies scanned for vulnerabilities

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

## 2. Environment Setup

### Create Vercel Projects

#### Testnet Project
```bash
# Create new Vercel project
vercel create p314-testnet

# Or connect existing GitHub repo
cd p314-bot
vercel link

# Set project name: p314-testnet
```

#### Mainnet Project
```bash
# Create second Vercel project
vercel create p314-mainnet

# Link to same GitHub repo (different environment)
vercel link --cwd=p314-bot --project=p314-mainnet
```

### Configure Environment Variables

#### Testnet Environment (`.env.production` with Pi Testnet)
```bash
# Server Configuration
NODE_ENV=production
VERCEL_ENV=production

# Pi Network (TESTNET)
PI_SDK_URL=https://testnet-api.pi-sdk.net
PI_SDK_CONFIG=testnet
NEXT_PUBLIC_PI_NETWORK=testnet

# MongoDB (Testnet Database)
MONGODB_URI=mongodb+srv://[user]:[pass]@cluster.mongodb.net/p314_testnet?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_testnet

# Features
NEXT_PUBLIC_ENABLE_GUEST_MODE=true
NEXT_PUBLIC_ENABLE_CHANNELS=true
ENABLE_RATE_LIMITING=true

# Monitoring
SENTRY_DSN=[testnet-sentry-dsn]
POSTHOG_API_KEY=[testnet-posthog-key]
```

#### Mainnet Environment (`.env.production` with Pi Mainnet)
```bash
# Server Configuration
NODE_ENV=production
VERCEL_ENV=production

# Pi Network (MAINNET)
PI_SDK_URL=https://api.pi-sdk.net
PI_SDK_CONFIG=mainnet
NEXT_PUBLIC_PI_NETWORK=mainnet

# MongoDB (Mainnet Database)
MONGODB_URI=mongodb+srv://[user]:[pass]@cluster.mongodb.net/p314_mainnet?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_mainnet

# Features
NEXT_PUBLIC_ENABLE_GUEST_MODE=true
NEXT_PUBLIC_ENABLE_CHANNELS=true
ENABLE_RATE_LIMITING=true

# Monitoring
SENTRY_DSN=[mainnet-sentry-dsn]
POSTHOG_API_KEY=[mainnet-posthog-key]
```

### Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "env": {
    "DATABASE_URL": "@db_url",
    "REDIS_URL": "@redis_url",
    "API_KEY": "@api_key"
  },
  "buildOutputDirectory": ".next",
  "publicSource": "./public",
  "outputDirectory": ".vercel/output",
  "redirects": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
      ]
    }
  ]
}
```

## 3. GitHub Configuration

### Branch Strategy
```
main (Production)
├─ v0/testnet (Staging/Testnet)
└─ v0/... (Feature branches)
```

### Deployment Rules

Create GitHub Actions workflows:

#### Testnet Deployment (`.github/workflows/deploy-testnet.yml`)
```yaml
name: Deploy Testnet

on:
  push:
    branches: [v0/testnet]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_TESTNET }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

#### Mainnet Deployment (`.github/workflows/deploy-mainnet.yml`)
```yaml
name: Deploy Mainnet

on:
  push:
    branches: [main]
  workflow_dispatch: # Allow manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_MAINNET }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          production: true
```

## 4. Database Migration

### Testnet Database
```bash
# Create MongoDB Atlas cluster for testnet, then run index setup
MONGODB_URI="your_testnet_uri" node scripts/03-mongodb-access-control.js
```

### Mainnet Database
```bash
# Same steps with a separate mainnet cluster
MONGODB_URI="your_mainnet_uri" node scripts/03-mongodb-access-control.js
```

### Backup Strategy
```bash
# Automated backups (configure in MongoDB Atlas)
- Enable Continuous Cloud Backup in Atlas
- 30-day retention policy
- Test restoration monthly
```

## 5. Domain Configuration

### DNS Setup
```
Registrar: [Your Domain Registrar]

CNAME Records:
testnet.p314.app    -> cname.vercel-dns.com
app.p314.app        -> cname.vercel-dns.com
p314.app            -> cname.vercel-dns.com
www.p314.app        -> cname.vercel-dns.com

TXT Record (SSL Verification):
_vercel=acme-challenge....
```

### Vercel Domain Setup
```bash
# Add custom domain to Testnet project
vercel domain add testnet.p314.app --project p314-testnet

# Add custom domains to Mainnet project
vercel domain add p314.app --project p314-mainnet
vercel domain add www.p314.app --project p314-mainnet
vercel domain add app.p314.app --project p314-mainnet
```

## 6. Monitoring & Analytics

### Error Tracking (Sentry)
```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_PI_NETWORK,
  tracesSampleRate: 1.0,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
})
```

### Performance Monitoring
```typescript
// lib/monitoring.ts
import { performanceMonitor } from "@/lib/performance"

// Log key metrics
setInterval(() => {
  const summary = performanceMonitor.getSummary()
  analytics.track("performance_metrics", summary)
}, 60000) // Every minute
```

### Analytics
- Set up PostHog or Plausible
- Track user journeys
- Monitor conversion funnel
- Alert on anomalies

## 7. Pre-Deployment Testing

### Staging Tests
```bash
# Test on testnet environment
curl https://testnet.p314.app/api/health
curl https://app.p314.app/api/health

# Verify Pi SDK connection
curl https://testnet.p314.app/api/pi/verify

# Test guest mode
curl -X POST https://testnet.p314.app/api/guest/login
```

### Smoke Tests
```bash
# Load tests before production
npx artillery quick --count 100 --num 10 https://app.p314.app

# Check critical endpoints
- /api/health
- /api/channels
- /api/auth/me
```

## 8. Deployment Process

### Testnet Deployment
```bash
# 1. Create feature branch
git checkout -b v0/testnet

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to testnet branch
git push origin v0/testnet

# 4. GitHub Actions triggers deployment to testnet
# 5. Monitor deployment in Vercel dashboard
# 6. Run smoke tests

# 7. Create PR to main when ready
gh pr create --base main --head v0/testnet
```

### Mainnet Deployment
```bash
# 1. Review and merge testnet PR
gh pr review --approve
gh pr merge --squash

# 2. Wait for main branch deployment
# 3. GitHub Actions triggers mainnet deployment
# 4. Manual approval may be required
# 5. Monitor production metrics

# 6. Verify in real-time
tail -f logs/production.log
```

## 9. Post-Deployment Checklist

- [ ] All endpoints responding
- [ ] Database connectivity confirmed
- [ ] Monitoring dashboards showing data
- [ ] No errors in Sentry
- [ ] Performance metrics normal
- [ ] Guest mode working
- [ ] Pi SDK authentication working
- [ ] Channels functionality verified
- [ ] Rate limiting active
- [ ] Security headers present

## 10. Rollback Procedure

### If Issues Detected
```bash
# Immediate rollback to previous version
vercel rollback --project p314-mainnet

# Or deploy previous commit
git revert HEAD
git push origin main

# Manual rollback in Vercel dashboard
# 1. Go to Deployments tab
# 2. Click on previous successful deployment
# 3. Click "Promote to Production"
```

## 11. Maintenance Windows

### Scheduled Maintenance
- Every Sunday 2-3 AM UTC
- Notify users 24 hours before
- Database backups run during maintenance
- Deploy non-critical updates

### Emergency Maintenance
- Non-negotiable security issues
- Critical bugs affecting users
- Database corruption
- Service outages

## 12. Disaster Recovery

### Backup & Restore
```bash
# Test backup restoration monthly
vercel env pull # Local testing
pnpm exec prisma migrate reset # Local reset

# Full system recovery
1. Restore database from backup
2. Redeploy application
3. Verify data integrity
4. Run smoke tests
```

### Communication
- Update status page immediately
- Notify stakeholders
- Provide ETA for resolution
- Post-incident review within 24 hours

## 13. Performance Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time | < 500ms | > 2s |
| Error Rate | < 0.1% | > 1% |
| Uptime | 99.9% | < 99% |
| Database Latency | < 100ms | > 500ms |
| Page Load | < 2.5s | > 5s |

## 14. Troubleshooting

### Common Issues

**Deployment Fails**
```bash
# Check build output
vercel logs --project p314-mainnet

# Check environment variables
vercel env list --project p314-mainnet

# Redeploy
vercel --prod --force --project p314-mainnet
```

**High Response Times**
```bash
# Check database performance
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC

# Check function memory
vercel list functions --project p314-mainnet

# Increase memory if needed
```

**Database Connection Issues**
```bash
# Verify connection string
vercel env list --sensitive --project p314-mainnet

# Check MongoDB status
# Test connection from Atlas Dashboard → Connect → Compass
```
