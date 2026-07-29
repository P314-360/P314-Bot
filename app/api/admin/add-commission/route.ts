import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAdminAccess } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const adminVerified = verifyAdminAccess(req.headers)
    if (!adminVerified.isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { transactionType, amount, sourceUserId, description } = await req.json()

    if (!transactionType || amount === undefined || amount < 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    const db = await getDatabase()
    const treasuryCollection = db.collection("adminTreasury")

    // Add commission transaction
    const transaction = {
      transactionType,
      amount,
      sourceUserId: sourceUserId || null,
      description: description || null,
      createdAt: new Date().toISOString(),
      status: "completed",
    }

    await treasuryCollection.insertOne(transaction)

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error("[API] Error adding admin commission:", error)
    return NextResponse.json({ error: "Failed to add commission" }, { status: 500 })
  }
}
