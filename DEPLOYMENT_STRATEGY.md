# P314 Bot - Production Deployment Strategy

## Overview

This project uses **Vercel Preview and Production environments** for deployment:
- **Preview Branch** (develop): Testnet/Staging - Pi Network testnet credentials
- **Production Branch** (main): Mainnet - Pi Network mainnet credentials

**Local development has been completely eliminated.** All development happens via Vercel Preview.

---

## Environment Strategy

### Preview Environment (Vercel Preview - Staging/Testing)

**Branch:** `develop`  
**URL:** `https://p314-bot-1-[random].vercel.app`  
**Pi Network:** Testnet (Sandbox)  
**Database:** MongoDB staging cluster  
**Features:**
- ✓ Debug logging enabled
- ✓ Relaxed rate limiting (500 req/min)
- ✓ Full KYC/fraud reporting testing
- ✓ Test user accounts loaded

**When to use:**
- Testing new features
- Testing Pi Network integration
- Load testing (up to 100 concurrent)
- Staging validation before production

### Production Environment (Vercel Production)

**Branch:** `main`  
**URL:** `https://p314-bot-1.vercel.app`  
**Pi Network:** Mainnet  
**Database:** MongoDB mainnet cluster  
**Features:**
- ✓ Info logging only
- ✓ Strict rate limiting (200 req/min)
- ✓ All features enabled
- ✓ Production user data

**When to use:**
- End users (real Pi Network transactions)
- Public launch
- Permanent deployment

---

## Git Workflow

### Branch Structure

```
main (Production - Mainnet)
 └─ Production deployment with Pi Network mainnet
 └─ Environment: VERCEL_ENV=production
 └─ Database: p314_mainnet
 └─ URL: https://p314-bot-1.vercel.app

develop (Preview - Staging/Testnet)
 └─ Staging deployment for testing
 └─ Environment: VERCEL_ENV=preview
 └─ Database: p314_staging
 └─ URL: https://p314-bot-1-[random].vercel.app
```

**No local branches needed.** Deleted all `v0/*` feature branches.

### Deployment Flow

```
Feature Development
    ↓
Commit to GitHub
    ↓
Push to develop → Vercel Preview deploys
    ↓
Test on Preview (testnet)
    ↓
PR to main → Merge
    ↓
Vercel Production deploys
    ↓
Live on mainnet
```

---

## Environment Variables

### Setup Instructions

1. **For Preview (Testnet):**
   ```
   Add to Vercel Preview environment:
   - MONGODB_URI: staging MongoDB URI
   - PI_APP_ID: testnet app ID
   - PI_API_KEY: testnet API key
   - ENCRYPTION_KEY & ENCRYPTION_IV: your staging keys
   - SESSION_SECRET: your staging secret
   - NEXT_PUBLIC_API_URL: https://p314-bot-1-[preview-url].vercel.app
   ```

2. **For Production (Mainnet):**
   ```
   Add to Vercel Production environment:
   - MONGODB_URI: mainnet MongoDB URI
   - PI_APP_ID: mainnet app ID
   - PI_API_KEY: mainnet API key
   - ENCRYPTION_KEY & ENCRYPTION_IV: your production keys
   - SESSION_SECRET: your production secret
   - NEXT_PUBLIC_API_URL: https://p314-bot-1.vercel.app
   ```

### Environment Variable Mapping

| Variable | Preview | Production |
|----------|---------|------------|
| `MONGODB_URI` | staging-cluster | production-cluster |
| `MONGODB_DB_NAME` | p314_staging | p314_mainnet |
| `PI_APP_ID` | testnet app ID | mainnet app ID |
| `PI_API_KEY` | testnet key | mainnet key |
| `NEXT_PUBLIC_PI_NETWORK` | testnet | mainnet |
| `LOG_LEVEL` | debug | info |
| `RATE_LIMIT_MAX_REQUESTS` | 500 | 200 |
| `NEXT_PUBLIC_ENVIRONMENT` | staging | production |

---

## Automatic Environment Detection

The application automatically detects the Vercel environment via `process.env.VERCEL_ENV`:

- **`VERCEL_ENV=preview`**: Activates staging/testnet configuration
- **`VERCEL_ENV=production`**: Activates production/mainnet configuration

See `lib/env.ts` for auto-detection logic.

---

## Local Development Setup

**No local development.** All development happens on Vercel Preview.

To develop:
1. Commit changes to `develop` branch
2. Push to GitHub
3. Vercel auto-deploys to Preview
4. Test at `https://p314-bot-1-[preview-url].vercel.app`
5. View real-time logs in Vercel dashboard

---

## Deployment Checklist

### Before Merging to Main (Production)

- [ ] All tests pass on Preview
- [ ] Pi Network testnet transactions verified
- [ ] KYC flows tested end-to-end
- [ ] Load test on Preview (100+ concurrent)
- [ ] Database backups created
- [ ] Encryption keys verified
- [ ] Rate limiting verified
- [ ] All API endpoints tested

### After Merging to Main

- [ ] Production deployment completes (check Vercel dashboard)
- [ ] Production URL loads without errors
- [ ] Pi Network mainnet integration verified
- [ ] Real transaction test (small amount)
- [ ] Monitor production logs for errors
- [ ] Verify rate limiting is strict (200 req/min)

---

## Monitoring & Alerts

### Preview Environment
- Monitor testnet transactions
- Watch for auth errors
- Check database connections
- Alert on error rate > 5%

### Production Environment
- Monitor mainnet transactions
- Alert on error rate > 1%
- Track latency (p95 < 200ms)
- Monitor database performance
- Alert on rate limit violations

---

## Rollback Procedures

### If Production Has Issues

1. Check Vercel dashboard for deployment status
2. View logs: Vercel → Deployments → [production] → Logs
3. Options:
   - **Quick fix**: Revert last commit to main, push, Vercel auto-deploys
   - **Hotfix**: Create hotfix branch from main, merge, Vercel auto-deploys
   - **Full rollback**: Redeploy previous deployment from Vercel dashboard

### Database Rollback
- MongoDB snapshots taken before each production deployment
- Restore from timestamp if data corruption detected
- Contact MongoDB Atlas support for point-in-time restore

---

## Vercel Configuration

All Vercel settings are in `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "env": { ... }    // Environment variable declarations
  "headers": [ ... ]  // CORS, security headers, caching
  "functions": { ... }  // API route configuration (1024MB, 30s timeout)
}
```

---

## Git Workflow Example

```bash
# 1. Work on develop for staging
git checkout develop
git pull origin develop

# 2. Make changes, commit, push
git add .
git commit -m "feat: add new feature"
git push origin develop

# 3. Vercel auto-deploys to Preview
# 4. Test at https://p314-bot-1-[preview].vercel.app

# 5. When ready for production
git checkout main
git pull origin main
git merge develop
git push origin main

# 6. Vercel auto-deploys to Production
# 7. Live on https://p314-bot-1.vercel.app
```

---

## FAQs

**Q: How do I test a change before production?**  
A: Push to `develop` branch. Vercel auto-deploys to Preview. Test at the Preview URL.

**Q: How do I rollback if production breaks?**  
A: Revert the commit to `main` and push. Vercel auto-deploys the previous version.

**Q: Can I run locally?**  
A: No. Local development has been completely removed. Use Vercel Preview for all testing.

**Q: How do I switch between testnet and mainnet?**  
A: `develop` branch = testnet (Preview), `main` branch = mainnet (Production).

**Q: What if I need hotfixes?**  
A: Create a hotfix branch from `main`, merge to `main`, Vercel deploys immediately.

