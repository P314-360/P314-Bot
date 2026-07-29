# P314 Staging Deployment Guide

## Overview
Deploy P314 to a staging environment for testing before production.

---

## Prerequisites

### Required Accounts
- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] MongoDB Atlas account (free M0 works for staging)
- [ ] Pi Network Developer account

### Local Setup
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## Step 1: Prepare Your Code

```bash
git init
git add .
git commit -m "Initial commit for staging"
git remote add origin https://github.com/YOUR_USERNAME/p314-staging.git
git branch -M main
git push -u origin main
```

Ensure `.env.local` is in `.gitignore`:
```
.env.local
.env*.local
```

---

## Step 2: Set Up MongoDB (Staging)

### 2.1 Create Free Cluster
1. Go to https://cloud.mongodb.com
2. Click "Create" → select **M0 Free**
3. Name it: `p314-staging`
4. Create a database user with `readWrite` on `p314_bot`
5. Set IP access to `0.0.0.0/0`

### 2.2 Initialize Collections
```bash
MONGODB_URI="mongodb+srv://..." node scripts/03-mongodb-access-control.js
```

### 2.3 Get Connection String
1. Atlas → Connect → Drivers
2. Copy URI (replace `<password>`)
3. This is your `MONGODB_URI`

---

## Step 3: Configure Pi Network (Staging)

1. Go to https://develop.pi/apps → Create New App
2. **Name:** P314 Staging, **Mode:** Development
3. **Redirect URL:** `https://your-staging-app.vercel.app`
4. Enable permissions: Username, Roles
5. Note your `PI_APP_ID` and `PI_API_KEY`

---

## Step 4: Deploy to Vercel (Staging)

### 4.1 Import Project
1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repository → `main` branch

### 4.2 Configure Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot

# Pi Network
PI_API_KEY=your_pi_staging_api_key
PI_APP_ID=your-pi-staging-app-id
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
NEXT_PUBLIC_PI_NETWORK=testnet
NEXT_PUBLIC_PI_ENV=sandbox

# Security
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=staging_session_secret

# Application
NEXT_PUBLIC_API_URL=https://your-staging-app.vercel.app
NEXT_PUBLIC_ENVIRONMENT=staging
NODE_ENV=production
```

### 4.3 Deploy
1. Click "Deploy" → wait for build to complete
2. Note your deployment URL: `https://p314-staging.vercel.app`

---

## Step 5: Update Pi App Redirect

1. Pi Developer Portal → update **Redirect URL** to your Vercel staging URL
2. Save changes

---

## Step 6: Test Staging Environment

### Basic Tests
- [ ] Open staging URL
- [ ] Check language switcher works
- [ ] Login with Pi Network
- [ ] Verify user data saves to MongoDB (check Atlas → Collections → users)
- [ ] Test chat functionality
- [ ] Check channel creation
- [ ] Verify fraud reporting works

### MongoDB Verification
In MongoDB Atlas:
1. Go to Collections
2. Check `users` collection has test users
3. Verify `messages` collection logs conversations
4. Confirm `chat_sessions` are created

### Error Monitoring
1. Vercel Dashboard → project → Logs tab
2. MongoDB Atlas → Activity Feed

---

## Step 7: Branch Strategy

```bash
git checkout -b staging
git push -u origin staging
```

In Vercel: Settings → Git → set `staging` branch to auto-deploy with separate env variables.

---

## Step 8: Testing Checklist

### Functionality Tests
- [ ] User authentication via Pi Network
- [ ] Language switching (test 2-3 languages)
- [ ] Chat with AI assistant
- [ ] Create user channel
- [ ] Join existing channel
- [ ] Send E2EE messages
- [ ] Submit fraud report
- [ ] Wallet verification
- [ ] Quest system
- [ ] Notifications

### Security Tests
- [ ] Environment variables not exposed to client
- [ ] API endpoints require authentication
- [ ] E2EE encryption working
- [ ] No sensitive data in logs

---

## Common Issues & Solutions

### Login fails with Pi Network
1. Verify `PI_APP_ID` matches Developer Portal
2. Check redirect URL is exactly your Vercel URL
3. Ensure app is in "Development" mode

### MongoDB connection errors
1. Verify `MONGODB_URI` is correct
2. Check IP allowlist includes `0.0.0.0/0`
3. Confirm database user has correct permissions

### Environment variables not working
1. Redeploy in Vercel after adding variables
2. Check variable names match exactly (case-sensitive)
3. Use `NEXT_PUBLIC_` prefix for client-side vars

---

## Rollback Procedure

```bash
# Revert to previous commit
git log  # Find working commit hash
git revert <commit-hash>
git push origin staging
# Or redeploy previous Vercel deployment
```

---

## Next Steps

After successful staging testing:
- Fix any bugs found
- Prepare for production deployment (see `DEPLOYMENT_PRODUCTION.md`)

---

**Last Updated:** July 2026
**Status:** Active Staging Guide (MongoDB)
