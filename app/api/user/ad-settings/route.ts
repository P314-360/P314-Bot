import { type NextRequest, NextResponse } from "next/server"

// In-memory store - replace with MongoDB collection in production
const adSettingsStore = new Map()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const settings = adSettingsStore.get(userId) || {
      userId,
      adsEnabled: false,
      earnedRevenue: 0,
      revenueSharePercentage: 5,
      features: [],
      lastUpdated: new Date(),
    }

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

    const currentSettings = adSettingsStore.get(userId) || {
      userId,
      adsEnabled: false,
      earnedRevenue: 0,
      revenueSharePercentage: 5,
      features: [],
      lastUpdated: new Date(),
    }

    const updatedSettings = {
      ...currentSettings,
      adsEnabled,
      features: adsEnabled ? ["Unlimited messages", "Priority response", "Early access to new features"] : [],
      lastUpdated: new Date(),
    }

    adSettingsStore.set(userId, updatedSettings)

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error("Error updating ad settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
