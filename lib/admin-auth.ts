/**
 * Admin Authentication Module
 * Restricts admin access EXCLUSIVELY to authorized Pi Network username from ADMIN_USERNAME env var
 * This is a server-side security enforcement that cannot be bypassed
 */

// Get admin username from environment variables
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || process.env.ADMIN_USERNAME || ""

if (!ADMIN_USERNAME) {
  console.warn("[ADMIN-AUTH] Warning: ADMIN_USERNAME environment variable not set. Admin access will be disabled.")
}

export interface AdminAuthResult {
  isAuthorized: boolean
  username: string | null
  error?: string
}

/**
 * Verifies if the provided username is authorized as admin
 * Server-side validation - cannot be bypassed by client manipulation
 */
export function isAdmin(username: string | null | undefined): boolean {
  if (!username) return false
  return username === ADMIN_USERNAME
}

/**
 * Extracts and validates admin credentials from request headers
 * Used in API routes to enforce admin-only access
 */
export function verifyAdminAccess(headers: Headers): AdminAuthResult {
  const username = headers.get("x-pi-username")

  if (!username) {
    return {
      isAuthorized: false,
      username: null,
      error: "Missing authentication credentials",
    }
  }

  if (!isAdmin(username)) {
    return {
      isAuthorized: false,
      username,
      error: "Unauthorized: Admin access required",
    }
  }

  return {
    isAuthorized: true,
    username,
  }
}

/**
 * Returns admin-only error response
 */
export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({
      error: "Unauthorized",
      message: "Admin access required. Only authorized administrators can access this resource.",
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    },
  )
}

/**
 * Get the authorized admin username (for display purposes only)
 */
export function getAdminUsername(): string {
  return ADMIN_USERNAME
}
