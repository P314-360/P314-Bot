// ═══════════════════════════════════════════════════════════════════════════════
// P314 Bot Environment Configuration Loader
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validates and loads environment variables
 * Throws error if required variables are missing
 */
export function getEnv() {
  // Detect Vercel environment: "production" | "preview" | undefined (local dev is never deployed)
  const vercelEnv = process.env.VERCEL_ENV // only set on Vercel — undefined outside
  const isVercelProduction = vercelEnv === "production"
  const isVercelPreview = vercelEnv === "preview"
  // isOnVercel is true for both Preview and Production deployments
  const isOnVercel = isVercelProduction || isVercelPreview

  const env = {
    // Database
    mongodbUri: process.env.MONGODB_URI,
    mongodbDbName: process.env.MONGODB_DB_NAME,

    // Pi Network
    piAppId: process.env.PI_APP_ID,
    piApiKey: process.env.PI_API_KEY,
    piNetworkUrl: process.env.NEXT_PUBLIC_PI_NETWORK_URL || "https://api.minepi.com",
    // Pi network is always derived from VERCEL_ENV — no hardcoded fallback
    piNetwork: process.env.NEXT_PUBLIC_PI_NETWORK || (isVercelProduction ? "mainnet" : "testnet"),

    // Environment detection — nodeEnv must come from NODE_ENV, no fallback to "development"
    vercelEnv,
    isVercelProduction,
    isVercelPreview,
    isOnVercel,
    nodeEnv: process.env.NODE_ENV,
    // App URL — injected by next.config.mjs from VERCEL_URL / VERCEL_BRANCH_URL automatically
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || (isVercelProduction ? "production" : "preview"),

    // Encryption
    encryptionKey: process.env.ENCRYPTION_KEY,
    encryptionIv: process.env.ENCRYPTION_IV,

    // Session
    sessionSecret: process.env.SESSION_SECRET,
    sessionTimeoutMs: parseInt(process.env.SESSION_TIMEOUT_MS || "86400000"),

    // API — NEXT_PUBLIC_APP_URL is the canonical URL; set in Vercel env vars or auto-injected
    apiUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || (isVercelPreview ? "500" : "200")),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),

    // Features
    trialMessageLimit: parseInt(process.env.NEXT_PUBLIC_TRIAL_MODE_MESSAGE_LIMIT || "50"),
    questHelpMilestone: parseInt(process.env.NEXT_PUBLIC_QUEST_HELP_MILESTONE || "10"),
    maxMessageLength: parseInt(process.env.NEXT_PUBLIC_MAX_MESSAGE_LENGTH || "1000"),

    // Logging — debug for Preview, info for Production; always explicit via env var
    logLevel: process.env.LOG_LEVEL || (isVercelPreview ? "debug" : "info"),
    logDbQueries: process.env.LOG_DB_QUERIES === "true" || isVercelPreview,

    // Admin
    adminUsername: process.env.NEXT_PUBLIC_ADMIN_USERNAME || process.env.ADMIN_USERNAME || "",

    // Pi Backend URLs — must be set in Vercel env vars per environment
    piBackendUrlSandbox: process.env.NEXT_PUBLIC_BACKEND_URL_SANDBOX || "",
    piBackendUrlMainnet: process.env.NEXT_PUBLIC_BACKEND_URL_MAINNET || "",

    // App IDs for different environments
    piAppIdSandbox: process.env.NEXT_PUBLIC_APP_ID_SANDBOX || "",
    piAppIdMainnet: process.env.NEXT_PUBLIC_APP_ID_MAINNET || "",

    // Vercel
    vercelAnalyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  } as const

  // Validate required environment variables at runtime only (not during next build).
  // Validation runs on BOTH Preview and Production — never skipped for deployed envs.
  const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

  if (isOnVercel && !isBuildTime) {
    const requiredEnvVars: Array<keyof typeof env> = [
      "mongodbUri",
      "mongodbDbName",
      "piAppId",
      "piApiKey",
      "sessionSecret",
      "encryptionKey",
      "encryptionIv",
      "adminUsername",
      "apiUrl",
    ]
    requiredEnvVars.forEach((varName) => {
      if (!env[varName]) {
        throw new Error(
          `[P314Bot] Missing required environment variable: ${String(varName)}. ` +
          `Set it in Vercel Dashboard → Settings → Environment Variables.`
        )
      }
    })
  }

  return env
}

/**
 * Get environment variable safely with fallback
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]
  if (!value && !fallback) {
    console.warn(`[ENV] Missing environment variable: ${key}`)
    return ""
  }
  return value || fallback || ""
}

/**
 * Check if variable is set
 */
export function isEnvVarSet(key: string): boolean {
  return !!process.env[key]
}

/**
 * Validate encryption keys format
 */
export function validateEncryptionKeys(): boolean {
  try {
    const env = getEnv()

    if (!env.encryptionKey || env.encryptionKey.length < 32) {
      throw new Error("ENCRYPTION_KEY must be at least 32 characters (use hex format)")
    }

    if (!env.encryptionIv || env.encryptionIv.length < 16) {
      throw new Error("ENCRYPTION_IV must be at least 16 characters (use hex format)")
    }

    // Validate hex format
    if (!/^[0-9a-f]+$/i.test(env.encryptionKey)) {
      throw new Error("ENCRYPTION_KEY must be in hex format")
    }

    if (!/^[0-9a-f]+$/i.test(env.encryptionIv)) {
      throw new Error("ENCRYPTION_IV must be in hex format")
    }

    return true
  } catch (error) {
    console.error("[ENV] Encryption key validation failed:", error)
    return false
  }
}

// Export singleton instance
export const env = getEnv()
