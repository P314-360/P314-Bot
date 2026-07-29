import { type NextRequest, NextResponse } from "next/server"

// In-memory store - replace with MongoDB collection in production
const adsStore = new Map()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ads = Array.from(adsStore.values())

    return NextResponse.json({ ads })
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const adId = `ad_${Date.now()}`

    const newAd = {
      adId,
      ...body,
      impressions: 0,
      clicks: 0,
      revenue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    adsStore.set(adId, newAd)

    return NextResponse.json({ success: true, ad: newAd })
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
