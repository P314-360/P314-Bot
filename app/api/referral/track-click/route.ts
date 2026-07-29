import { NextResponse } from "next/server"
import { ReferralSystem } from "@/lib/referral-system"

export async function POST(request: Request) {
  try {
    const { referralCode } = await request.json()

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
    }

    const tracked = await ReferralSystem.trackClick(referralCode)

    return NextResponse.json({
      success: tracked,
    })
  } catch (error) {
    console.error("Error tracking referral click:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
