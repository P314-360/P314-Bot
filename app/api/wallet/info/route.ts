import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      walletAddress: null,
      balance: null,
      message: "Guest mode - wallet feature requires authentication",
    })
  } catch (error) {
    console.error("Wallet info error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet info" }, { status: 500 })
  }
}
