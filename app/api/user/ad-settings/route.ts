import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb-server"

const DEFAULT_AD_SETTINGS = (userId: string) => ({
  userId,
  adsEnabled: false,
  earnedRevenue: 0,
  revenueSharePercentage: 5,
  features: [] as string[],
  lastUpdated: new Date(),
})

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const col = await getCollection("userSettings")
    const existing = await col.findOne({ userId, settingType: "adSettings" })

    const settings = existing ?? DEFAULT_AD_SETTINGS(userId)
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching ad settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, adsEnabled } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const col = await getCollection("userSettings")
    const existing = await col.findOne({ userId, settingType: "adSettings" })

    const base = existing ?? DEFAULT_AD_SETTINGS(userId)
    const updatedSettings = {
      ...base,
      settingType: "adSettings",
      adsEnabled,
      features: adsEnabled
        ? ["Unlimited messages", "Priority response", "Early access to new features"]
        : [],
      lastUpdated: new Date(),
    }

    await col.updateOne(
      { userId, settingType: "adSettings" },
      { $set: updatedSettings },
      { upsert: true }
    )

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error("Error updating ad settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
