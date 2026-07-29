# Pi Network Environment Configuration Guide

This guide explains how to configure P314 to work with both Pi Network Testnet (Sandbox) and Mainnet environments.

## Overview

P314 supports two Pi Network environments:

1. **Sandbox (Testnet)** - For development and testing
2. **Mainnet (Production)** - For live deployment

Each environment requires different SDK URLs, App IDs, and backend endpoints.

## Environment Variables

### Switching Environments

The active environment is controlled by the `NEXT_PUBLIC_PI_ENV` variable:

```bash
# For development/testing (testnet)
NEXT_PUBLIC_PI_ENV=sandbox

# For production (mainnet)
NEXT_PUBLIC_PI_ENV=mainnet
```

### Configuration Variables

#### Sandbox (Testnet) Variables

```bash
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_APP_ID_SANDBOX=your_sandbox_app_id
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://backend-sandbox.appstudio-u7cm9zhmha0ruwv8.piappengine.com
```

#### Mainnet (Production) Variables

```bash
NEXT_PUBLIC_PI_ENV=mainnet
NEXT_PUBLIC_APP_ID_MAINNET=your_mainnet_app_id
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com
```

## Local Development Setup

### Step 1: Copy Environment Template

```bash
cp .env.local.example .env.local
```

### Step 2: Edit .env.local

Open `.env.local` and configure for your environment:

```bash
# For testing on testnet
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_APP_ID_SANDBOX=your_sandbox_app_id
NEXT_PUBLIC_BACKEND_URL_SANDBOX=your_sandbox_backend_url
```

### Step 3: Start Development Server

```bash
pnpm dev
```

The app will automatically:
1. Detect the environment from `NEXT_PUBLIC_PI_ENV`
2. Load the correct SDK URL
3. Use the appropriate backend endpoints
4. Display environment indicator (Testnet/Mainnet)

### Step 4: Debug Environment (Optional)

Press `Ctrl+Shift+D` in the app to toggle a debug panel showing:
- Current environment (sandbox/mainnet)
- SDK URL
- Backend URL
- Is Sandbox flag

## Vercel Deployment Setup

### For Testnet (Sandbox)

1. Create a new Vercel project (e.g., "p314-testnet")
2. Go to Project Settings → Environment Variables
3. Add these variables:

```
NEXT_PUBLIC_PI_ENV = sandbox
NEXT_PUBLIC_APP_ID_SANDBOX = your_sandbox_app_id
NEXT_PUBLIC_BACKEND_URL_SANDBOX = https://backend-sandbox.appstudio-u7cm9zhmha0ruwv8.piappengine.com
```

4. Deploy from main or staging branch

### For Mainnet (Production)

1. Create a separate Vercel project (e.g., "p314-mainnet")
2. Go to Project Settings → Environment Variables
3. Add these variables:

```
NEXT_PUBLIC_PI_ENV = mainnet
NEXT_PUBLIC_APP_ID_MAINNET = your_mainnet_app_id
NEXT_PUBLIC_BACKEND_URL_MAINNET = https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com
```

4. Deploy from production branch (with version tag)

### Environment-Specific Deployments

**Recommended Git Strategy:**

```
main (development)
  ↓
staging (testnet deployment)
  ↓
production (mainnet deployment)
```

**Vercel Configuration:**

| Project | Branch | Environment | NEXT_PUBLIC_PI_ENV |
|---------|--------|-------------|-------------------|
| p314-testnet | staging | Testnet | sandbox |
| p314-mainnet | production | Mainnet | mainnet |

## Using Environment Configuration in Code

### Get Current Environment

```typescript
import { getCurrentEnvironment, getPiEnvironmentConfig } from "@/lib/pi-environment-config"

// Get environment name
const env = getCurrentEnvironment() // "sandbox" or "mainnet"

// Get full configuration
const config = getPiEnvironmentConfig()
// {
//   env: "sandbox" | "mainnet"
//   sdkUrl: string
//   sandbox: boolean
//   backendUrl: string
//   appId: string
//   description: string
// }
```

### Check Environment Type

```typescript
import { isSandboxEnvironment, isMainnetEnvironment } from "@/lib/pi-environment-config"

if (isSandboxEnvironment()) {
  // Testnet-specific logic
}

if (isMainnetEnvironment()) {
  // Mainnet-specific logic
}
```

### Validate Configuration

```typescript
import { validateEnvironmentConfig } from "@/lib/pi-environment-config"

const validation = validateEnvironmentConfig()
if (!validation.valid) {
  console.error("Configuration errors:", validation.errors)
}
```

### Log Configuration (Development)

```typescript
import { logEnvironmentConfig } from "@/lib/pi-environment-config"

logEnvironmentConfig() // Logs sanitized config to console
```

## Testing Environment Switching

### Local Testing

1. Stop dev server: `Ctrl+C`
2. Switch environment:
   ```bash
   # Test sandbox
   NEXT_PUBLIC_PI_ENV=sandbox pnpm dev

   # Test mainnet
   NEXT_PUBLIC_PI_ENV=mainnet pnpm dev
   ```
3. Check debug panel: `Ctrl+Shift+D`
4. Observe environment change

### Guest Mode with Environments

Guest users can browse P314 in any environment without authentication. The environment doesn't affect guest mode functionality - guests still see:
- Environment indicator (Testnet/Mainnet)
- Same feature restrictions
- Same 24-hour session duration

## Environment-Specific Features

Some features may behave differently based on environment:

| Feature | Sandbox | Mainnet |
|---------|---------|---------|
| Guest Mode | ✅ Enabled | ✅ Enabled |
| AI Chat | ✅ Available | ✅ Available |
| Channels | ✅ Available | ✅ Available |
| Pi Authentication | ✅ Testnet | ✅ Mainnet |
| NFT Minting | ⚠️ Test NFTs | ✅ Real NFTs |
| Data Persistence | ✅ Sandbox DB | ✅ Production DB |

## Troubleshooting

### "SDK URL is not configured"

**Problem:** Environment configuration is invalid
**Solution:** 
```bash
# Check .env.local has NEXT_PUBLIC_PI_ENV set
echo $NEXT_PUBLIC_PI_ENV

# Verify SDK URL in configuration
# Press Ctrl+Shift+D in app to see debug info
```

### "Backend login failed"

**Problem:** Backend URL is wrong or server is down
**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_URL_*` is correct
2. Check if backend is running
3. Verify app ID matches backend configuration
4. Check browser console for detailed error

### Environment not changing

**Problem:** Environment variable not picked up
**Solution:**
```bash
# Restart dev server after changing .env.local
pnpm dev

# Force clear cache
rm -rf .next
pnpm dev
```

### "Pi object not available after script load"

**Problem:** SDK script failed to load
**Solution:**
1. Check SDK URL in debug panel
2. Verify SDK URL is accessible in browser
3. Check browser console for CORS errors
4. Verify correct sandbox/mainnet SDK URL

## Production Checklist

- [ ] Create separate Vercel projects for testnet and mainnet
- [ ] Configure environment variables in each project
- [ ] Test authentication in both environments
- [ ] Test guest mode in both environments
- [ ] Verify backend URLs are correct
- [ ] Set up monitoring/error tracking per environment
- [ ] Configure custom domains (optional)
- [ ] Enable auto-deployments from appropriate branches
- [ ] Set up environment-specific analytics
- [ ] Document environment-specific processes

## Additional Resources

- [Pi Network Documentation](https://developers.minepi.com/)
- [Pi SDK Integration Guide](https://developers.minepi.com/sdk)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Support

For issues with Pi Network environments:
1. Check the debug panel (Ctrl+Shift+D)
2. Review console logs for error messages
3. Verify environment variables are set
4. Check Pi Network developer documentation
5. Contact Pi Network support for SDK issues
