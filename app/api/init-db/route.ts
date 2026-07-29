// ═══════════════════════════════════════════════════════════════════════════════
// Database Initialization API
// Creates all collections and indexes on first run.
// Protected by INIT_SECRET env var — never expose publicly.
// ═══════════════════════════════════════════════════════════════════════════════

import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabaseCollections } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  // Protect with a secret token — set INIT_SECRET in Vercel env vars
  const secret = request.headers.get("x-init-secret")
  const expectedSecret = process.env.INIT_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "INIT_SECRET is not configured in environment variables" },
      { status: 500 },
    )
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await initializeDatabaseCollections()

    return NextResponse.json({
      success: true,
      message: "All MongoDB collections and indexes initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[init-db] Failed to initialize collections:", error)
    return NextResponse.json(
      {
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
