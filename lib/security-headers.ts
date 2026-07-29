/**
 * Security Headers Configuration
 * Standard security headers to prevent common vulnerabilities
 */

export const securityHeaders = {
  // NOTE: X-Frame-Options is intentionally OMITTED.
  // Pi Browser runs the app inside a WebView (iframe). Setting DENY or SAMEORIGIN
  // would block the app from loading inside Pi Browser entirely.
  // Framing is controlled exclusively via CSP frame-ancestors below.

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection (legacy browsers)
  "X-XSS-Protection": "1; mode=block",

  // Content Security Policy — Pi Browser compatible
  // - frame-ancestors allows minepi.com WebView to embed this app
  // - script-src includes sdk.minepi.com (official Pi SDK CDN)
  // - connect-src includes *.piappengine.com (Pi auth backend) and *.minepi.com
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.minepi.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.minepi.com https://*.minepi.com https://*.piappengine.com",
    // Allow Pi Browser (minepi.com) to embed this app in its WebView
    "frame-ancestors 'self' https://minepi.com https://*.minepi.com",
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; "),

  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy
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

  // HSTS — only for production HTTPS deployments
  "Strict-Transport-Security": "max-age=63072000",
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
