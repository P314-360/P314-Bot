import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")
    const activityLog = db.collection("userActivityLog")

    await users.updateOne(
      { $or: [{ _id: userId as any }, { piUid: userId }] },
      { $set: { walletAddress: null, walletLinkedAt: null, updatedAt: new Date() } },
    )

    await activityLog.insertOne({
      userId,
      activityType: "wallet_disconnected",
      description: "User disconnected their Pi wallet",
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Wallet disconnected successfully",
    })
  } catch (error) {
    console.error("Wallet disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect wallet" }, { status: 500 })
  }
}
