import { NextResponse } from "next/server"
import { ReferralSystem } from "@/lib/referral-system"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const [stats, commissionHistory, referredUsers] = await Promise.all([
      ReferralSystem.getReferralStats(userId),
      ReferralSystem.getCommissionHistory(userId, 20),
      ReferralSystem.getReferredUsers(userId),
    ])

    return NextResponse.json({
      success: true,
      stats,
      commissionHistory,
      referredUsers,
    })
  } catch (error) {
    console.error("Error in referral stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
