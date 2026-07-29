// *** System Configuration - All values loaded from environment variables ***
// This file constructs configuration from environment variables set in Vercel.
// All values must be explicitly provided in the Vercel environment.

/**
 * Get App ID from environment variables
 * MUST be set in Vercel for both testnet and mainnet
 */
export const APP_ID = (() => {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NEXT_PUBLIC_APP_ID_SANDBOX || process.env.NEXT_PUBLIC_APP_ID_MAINNET || ""
  }
  // Server-side
  return process.env.PI_APP_ID || ""
})()

// Pi Network Configuration
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: process.env.NEXT_PUBLIC_PI_NETWORK === "testnet" || process.env.NEXT_PUBLIC_PI_NETWORK !== "mainnet",
} as const

// Backend Configuration
export const BACKEND_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL_MAINNET || process.env.NEXT_PUBLIC_BACKEND_URL_SANDBOX || "",
} as const

// Backend URLs - constructed from environment variables
export const BACKEND_URLS = {
  LOGIN: `${BACKEND_CONFIG.BASE_URL}/v1/login`,
  CHAT: `${BACKEND_CONFIG.BASE_URL}/v1/chat/default`,
  ANALYZE_CONFIDENCE: `${BACKEND_CONFIG.BASE_URL}/v1/source-confidence/analyze`,
} as const
