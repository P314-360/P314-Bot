/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable instrumentation.ts to run initializeDatabaseCollections on server start
  experimental: {
    instrumentationHook: true,
  },
  // Inject NEXT_PUBLIC_APP_URL automatically from Vercel's built-in env vars.
  // Priority: explicit override → production URL → preview branch URL → deploy URL
  // This ensures the domain is always dynamic — never hardcoded.
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_ENV === "production"
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_BRANCH_URL
        ? `https://${process.env.VERCEL_BRANCH_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : ""),
  },
  async headers() {
    // Pi Browser runs the app inside a WebView — never set X-Frame-Options.
    // CSP frame-ancestors controls framing instead.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.minepi.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.minepi.com https://*.minepi.com https://*.piappengine.com",
      "frame-ancestors 'self' https://minepi.com https://*.minepi.com",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; ")

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
