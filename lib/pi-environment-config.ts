/**
 * Pi Network Environment Configuration
 * Supports dual environments: Sandbox (Testnet) and Mainnet
 */

export type PiEnvironment = "sandbox" | "mainnet"

export interface PiEnvironmentConfig {
  env: PiEnvironment
  sdkUrl: string
  sandbox: boolean
  backendUrl: string
  appId: string
  description: string
}

// Get environment from environment variable or default to sandbox
const getEnvironment = (): PiEnvironment => {
  if (typeof window === "undefined") {
    // Server-side
    const env = process.env.NEXT_PUBLIC_PI_ENV as PiEnvironment | undefined
    return env || "sandbox"
  }

  // Client-side
  const env = process.env.NEXT_PUBLIC_PI_ENV as PiEnvironment | undefined
  return env || "sandbox"
}

// Environment-specific configurations
const ENVIRONMENTS: Record<PiEnvironment, PiEnvironmentConfig> = {
  sandbox: {
    env: "sandbox",
    sdkUrl: "https://sdk.minepi.com/pi-sdk.js",
    sandbox: true,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL_SANDBOX || "",
    appId: process.env.NEXT_PUBLIC_APP_ID_SANDBOX || "",
    description: "Pi Network Sandbox (Testnet)",
  },
  mainnet: {
    env: "mainnet",
    sdkUrl: "https://sdk.minepi.com/pi-sdk.js",
    sandbox: false,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL_MAINNET || "",
    appId: process.env.NEXT_PUBLIC_APP_ID_MAINNET || "",
    description: "Pi Network Mainnet (Production)",
  },
}

/**
 * Get current Pi environment configuration
 */
export function getPiEnvironmentConfig(): PiEnvironmentConfig {
  const env = getEnvironment()
  return ENVIRONMENTS[env]
}

/**
 * Get current environment name
 */
export function getCurrentEnvironment(): PiEnvironment {
  return getEnvironment()
}

/**
 * Check if running in sandbox/testnet
 */
export function isSandboxEnvironment(): boolean {
  const config = getPiEnvironmentConfig()
  return config.sandbox === true
}

/**
 * Check if running in mainnet/production
 */
export function isMainnetEnvironment(): boolean {
  const config = getPiEnvironmentConfig()
  return config.sandbox === false
}

/**
 * Get environment description
 */
export function getEnvironmentDescription(): string {
  const config = getPiEnvironmentConfig()
  return config.description
}

/**
 * Get all available environments
 */
export function getAllEnvironments(): PiEnvironmentConfig[] {
  return Object.values(ENVIRONMENTS)
}

/**
 * Validate environment configuration
 */
export function validateEnvironmentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const config = getPiEnvironmentConfig()

  if (!config.sdkUrl) {
    errors.push("SDK URL is not configured")
  }

  if (!config.backendUrl) {
    errors.push("Backend URL is not configured")
  }

  if (!config.appId) {
    errors.push("App ID is not configured")
  }

  // Validate URLs
  try {
    new URL(config.sdkUrl)
  } catch {
    errors.push("Invalid SDK URL format")
  }

  try {
    new URL(config.backendUrl)
  } catch {
    errors.push("Invalid Backend URL format")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Log environment configuration (sanitized for security)
 */
export function logEnvironmentConfig(): void {
  const config = getPiEnvironmentConfig()
  console.log("[Pi Environment Config]", {
    environment: config.env,
    sandbox: config.sandbox,
    description: config.description,
    sdkUrl: config.sdkUrl,
    backendUrl: config.backendUrl.replace(/\/+$/, ""), // Remove trailing slashes
    appId: `${config.appId.substring(0, 8)}...${config.appId.substring(config.appId.length - 4)}`, // Mask sensitive parts
  })
}
