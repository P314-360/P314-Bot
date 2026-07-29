import { NextResponse } from "next/server"
import { ReferralSystem } from "@/lib/referral-system"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const referralLink = await ReferralSystem.getOrCreateReferralLink(userId)

    if (!referralLink) {
      return NextResponse.json({ error: "Failed to generate referral link" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      referralLink,
    })
  } catch (error) {
    console.error("Error in get-link API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
