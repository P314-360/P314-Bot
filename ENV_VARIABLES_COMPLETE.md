# Complete Environment Variables Reference

## Security Audit Summary

✓ FIXED: Removed all hardcoded values and secrets from codebase
✓ FIXED: All configuration now reads from Vercel environment variables
✓ FIXED: Admin username moved to environment variable (ADMIN_USERNAME)
✓ FIXED: Encryption keys must be explicitly set
✓ FIXED: App IDs and Backend URLs no longer have defaults

---

## Required Environment Variables for Vercel

### 1. MongoDB Configuration (CRITICAL)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db?retryWrites=true
MONGODB_DB_NAME=p314_bot (for staging), p314_mainnet (for production)
```

### 2. Pi Network Authentication (CRITICAL)
```
PI_APP_ID=<your-pi-app-id>
PI_API_KEY=<your-pi-api-key>
NEXT_PUBLIC_PI_NETWORK=testnet (for Preview), mainnet (for Production)
```

### 3. Encryption (CRITICAL)
```
ENCRYPTION_KEY=<64-character hex string from: openssl rand -hex 32>
ENCRYPTION_IV=<32-character hex string from: openssl rand -hex 16>
```

### 4. Session Management (CRITICAL)
```
SESSION_SECRET=<generate with: openssl rand -base64 32>
SESSION_TIMEOUT_MS=86400000 (24 hours default)
```

### 5. Admin User (CRITICAL for admin features)
```
ADMIN_USERNAME=<pi-network-username-of-admin>
NEXT_PUBLIC_ADMIN_USERNAME=<same as ADMIN_USERNAME>
```

### 6. Pi Network Backend URLs (Environment-specific)

**For Testnet (Preview environment):**
```
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://backend-sandbox.appstudio-u7cm9zhmha0ruwv8.piappengine.com
NEXT_PUBLIC_APP_ID_SANDBOX=<your-sandbox-app-id>
```

**For Mainnet (Production environment):**
```
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com
NEXT_PUBLIC_APP_ID_MAINNET=<your-mainnet-app-id>
```

### 7. Application URLs
```
NEXT_PUBLIC_API_URL=https://p314-bot-1-staging.vercel.app (Preview)
NEXT_PUBLIC_API_URL=https://p314-bot-1.vercel.app (Production)
```

### 8. Rate Limiting
```
RATE_LIMIT_MAX_REQUESTS=500 (Preview/testing), 200 (Production)
RATE_LIMIT_WINDOW_MS=60000 (1 minute)
```

### 9. Features and Limits
```
NEXT_PUBLIC_TRIAL_MODE_MESSAGE_LIMIT=50
NEXT_PUBLIC_QUEST_HELP_MILESTONE=10
NEXT_PUBLIC_MAX_MESSAGE_LENGTH=1000
```

### 10. Logging
```
LOG_LEVEL=debug (Preview), info (Production)
LOG_DB_QUERIES=true (Preview), false (Production)
```

### 11. Environment Detection
```
NEXT_PUBLIC_ENVIRONMENT=staging (Preview), production (Production)
VERCEL_ENV=preview (auto-set by Vercel), production (auto-set by Vercel)
```

---

## Vercel Configuration by Environment

### Preview Branch (Develop) - Testnet
```json
{
  "env": {
    "MONGODB_DB_NAME": "p314_staging",
    "NEXT_PUBLIC_PI_NETWORK": "testnet",
    "NEXT_PUBLIC_APP_ID_SANDBOX": "your-sandbox-app-id",
    "NEXT_PUBLIC_BACKEND_URL_SANDBOX": "https://backend-sandbox...",
    "RATE_LIMIT_MAX_REQUESTS": "500",
    "LOG_LEVEL": "debug"
  }
}
```

### Production Branch (Main) - Mainnet
```json
{
  "env": {
    "MONGODB_DB_NAME": "p314_mainnet",
    "NEXT_PUBLIC_PI_NETWORK": "mainnet",
    "NEXT_PUBLIC_APP_ID_MAINNET": "your-mainnet-app-id",
    "NEXT_PUBLIC_BACKEND_URL_MAINNET": "https://backend...",
    "RATE_LIMIT_MAX_REQUESTS": "200",
    "LOG_LEVEL": "info"
  }
}
```

---

## Code References

### Where Variables Are Used

1. **lib/env.ts** - Master environment loader with validation
2. **lib/config.ts** - Configuration object (reads from env.ts)
3. **lib/admin-auth.ts** - Admin authentication (reads ADMIN_USERNAME)
4. **lib/system-config.ts** - System configuration (reads from env vars)
5. **lib/pi-environment-config.ts** - Pi Network config (reads from env vars)

### Validation

All critical variables are validated at runtime:
- Missing required variables throw errors
- Encryption keys must be in proper hex format
- Admin username must be explicitly set

---

## Setup Checklist

Before deploying to Vercel:

- [ ] MongoDB URI added to Vercel env (staging and production)
- [ ] Pi App ID and API Key added (testnet and mainnet)
- [ ] Encryption keys generated and added (32 hex chars for key, 16 for IV)
- [ ] Session secret generated and added
- [ ] Admin username set for both environments
- [ ] Backend URLs configured (sandbox and mainnet)
- [ ] App IDs configured (sandbox and mainnet)
- [ ] Rate limiting configured appropriately
- [ ] Environment names configured correctly

---

## Security Reminders

✓ Never commit secrets to GitHub
✓ Use Vercel Environment Variables exclusively
✓ Different credentials for Preview (testnet) and Production (mainnet)
✓ Admin username cannot be empty
✓ Encryption keys must be cryptographically strong
✓ All URLs must use HTTPS

