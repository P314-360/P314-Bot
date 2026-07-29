// ═══════════════════════════════════════════════════════════════════════════════
// Next.js Instrumentation Hook
// Runs once when the server starts — used to initialize MongoDB collections
// and indexes so they are ready before any API request is handled.
// Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
// ═══════════════════════════════════════════════════════════════════════════════

export async function register() {
  // Only run on the Node.js server runtime — not in Edge or browser
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeDatabaseCollections } = await import("./lib/mongodb")

    try {
      await initializeDatabaseCollections()
      console.log("[Instrumentation] MongoDB collections initialized on server start")
    } catch (error) {
      // Log but do not crash — the app can still serve requests even if init fails.
      // Individual API routes will fail gracefully if the DB is truly unreachable.
      console.error("[Instrumentation] MongoDB init failed:", error)
    }
  }
}
