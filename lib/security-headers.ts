/**
 * Security Headers Configuration
 * Standard security headers to prevent common vulnerabilities
 */

export const securityHeaders = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection (legacy, but still useful)
  "X-XSS-Protection": "1; mode=block",

  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://sdk.pi-sdk.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.pi-sdk.net https://testnet-api.pi-sdk.net https://api.minepi.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; "),

  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy (formerly Feature Policy)
  "Permissions-Policy": [
    "accelerometer=()",
    "camera=()",
    "geolocation=()",
    "gyroscope=()",
    "magnetometer=()",
    "microphone=()",
    "payment=()",
    "usb=()",
  ].join(", "),

  // HSTS (HTTP Strict Transport Security)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    ...securityHeaders,
  }
}
