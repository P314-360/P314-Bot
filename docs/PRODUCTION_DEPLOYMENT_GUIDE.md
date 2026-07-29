# P314 Production Deployment Guide (MongoDB + Vercel)

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account
- [ ] MongoDB Atlas account
- [ ] Pi Network Developer account

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Project
1. Go to https://cloud.mongodb.com
2. Click "New Project" → name: `p314-production`
3. Create cluster (M10+ recommended for production, M0 Free for testing)

### Step 2: Create Database User
1. Atlas → Database Access → Add Database User
2. Username/Password auth
3. Role: `readWrite` on database `p314_bot`
4. Save credentials securely

### Step 3: Set IP Allowlist
1. Atlas → Network Access → Add IP Address
2. Add `0.0.0.0/0` (required for Vercel serverless)

### Step 4: Initialize Collections and Indexes
```bash
MONGODB_URI="your_uri" node scripts/03-mongodb-access-control.js
```

### Step 5: Get Connection String
1. Atlas → Connect → Drivers → Node.js
2. Copy the URI and replace `<password>`
3. This is your `MONGODB_URI`

---

## Part 2: Pi Network Configuration

### Step 1: Register Your App
1. Go to https://develop.pi
2. Click "Create App"
3. Fill in: Name: P314, Homepage URL: `https://your-app.vercel.app`

### Step 2: Get Pi Credentials
- `App ID` → `PI_APP_ID`
- `API Key` → `PI_API_KEY`

---

## Part 3: Vercel Deployment

### Step 1: Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/p314.git
git push -u origin main
```

### Step 2: Import to Vercel
1. https://vercel.com → "Add New Project"
2. Import GitHub repository
3. Framework: Next.js, Build Command: `pnpm build`

### Step 3: Add Environment Variables

#### MongoDB Variables
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot
```

#### Pi Network Variables
```
PI_API_KEY=your_pi_api_key_here
PI_APP_ID=your_pi_app_id_here
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
NEXT_PUBLIC_PI_NETWORK=mainnet
```

#### Security Variables
```
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=your_session_secret
```

#### Application Variables
```
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW_MS=60000
```

### Step 4: Deploy
1. Click "Deploy" → wait 2-3 minutes
2. Once deployed, click "Visit" to test

---

## Part 4: Post-Deployment Configuration

### Step 1: Update Pi App URLs
1. Pi Developer Portal → update Homepage and Redirect URLs

### Step 2: Test MongoDB Connection
1. Visit deployed app
2. Open browser console → look for `[P314 DB] ✓ Connection successful`

### Step 3: Test Pi Authentication
1. Click login → complete Pi Network authentication
2. Verify user appears in MongoDB Atlas → Collections → users

### Step 4: Verify Admin Access
1. Log in with your Pi username (`Axis2030`)
2. Confirm Admin tab is visible in Dashboard

---

## Troubleshooting

### MongoDB Connection Errors

**Error**: `MONGODB_URI environment variable is not set`
- Add `MONGODB_URI` in Vercel environment variables and redeploy

**Error**: `Connection timeout`
- Check MongoDB Atlas IP allowlist includes `0.0.0.0/0`
- Verify the URI is correct

### Pi Authentication Errors

**Error**: `Pi SDK not available`
- Check Pi Developer Portal approval status
- Verify `PI_API_KEY` and `PI_APP_ID` are set

### Build Errors

**Error**: `Module not found`
- Run `pnpm install` locally and commit lockfile

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Review MongoDB Atlas logs for errors
- [ ] Monitor user signups and activity

### Weekly Checks
- [ ] Review admin revenue dashboard
- [ ] Check MongoDB storage usage
- [ ] Verify all API endpoints working

### Monthly Checks
- [ ] Review and optimize MongoDB indexes
- [ ] Update dependencies
- [ ] Export Atlas backup snapshot

---

## Security Checklist

- [x] Per-query userId scoping on all user data
- [x] Environment variables never committed to Git
- [x] Admin access restricted to Axis2030 only
- [x] SSL/TLS enabled (Atlas + Vercel HTTPS)
- [x] API keys rotated regularly
- [x] CORS configured correctly

---

## Production Launch Checklist

- [ ] All environment variables set
- [ ] MongoDB collections initialized
- [ ] Pi authentication working
- [ ] Admin access verified
- [ ] All features tested
- [ ] Monitoring enabled
- [ ] Backup strategy documented

---

**Last Updated:** July 2026
**Version:** 2.0 (MongoDB)
