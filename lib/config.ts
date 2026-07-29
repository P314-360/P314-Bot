// ═══════════════════════════════════════════════════════════════════════════════
// P314 Configuration - Loaded from Environment Variables
// ═══════════════════════════════════════════════════════════════════════════════

import { env } from "./env"

export const P314_CONFIG = {
  // Pi Network Configuration (MUST be set in environment)
  PI_APP_ID: env.piAppId,
  PI_API_KEY: env.piApiKey,
  PI_NETWORK_URL: env.piNetworkUrl,

  // Database Configuration (MongoDB - MUST be set in environment)
  MONGODB_URI: env.mongodbUri,
  MONGODB_DB_NAME: env.mongodbDbName,

  // Session Configuration (MUST be set in environment)
  SESSION_TIMEOUT_MS: env.sessionTimeoutMs,
  SESSION_SECRET: env.sessionSecret,

  // Feature Limits
  TRIAL_MODE_MESSAGE_LIMIT: env.trialMessageLimit,
  EPHEMERAL_MESSAGE_TTL: 30000, // 30 seconds
  QUEST_HELP_MILESTONE: env.questHelpMilestone,
  MAX_MESSAGE_LENGTH: env.maxMessageLength,

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: env.rateLimitMaxRequests,
  RATE_LIMIT_WINDOW_MS: env.rateLimitWindowMs,

  // Encryption (MUST be set in environment with proper hex values)
  ENCRYPTION_KEY: env.encryptionKey,
  ENCRYPTION_IV: env.encryptionIv,

  // API Endpoints (relative paths)
  API_ENDPOINTS: {
    COMMUNITY_CHAT: "/api/channels/chat",
    FRAUD_REPORT: "/api/fraud/report",
    WALLET_VERIFY: "/api/wallet/verify",
    INIT_USER: "/api/init-user",
    GET_REPUTATION: "/api/reputation/get-user-stats",
    ADD_ACTIVITY: "/api/reputation/add-activity",
    WITHDRAWAL_REQUEST: "/api/withdrawal/request",
  },

  // Environment
  NODE_ENV: env.nodeEnv,
  ENVIRONMENT: env.environment,
  IS_PRODUCTION: env.nodeEnv === "production",
  IS_DEVELOPMENT: env.nodeEnv === "development",

  // Logging
  LOG_LEVEL: env.logLevel,
  LOG_DB_QUERIES: env.logDbQueries,
} as const
