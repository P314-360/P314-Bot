import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  const authResult = verifyAdminAccess(request.headers)
  if (!authResult.isAuthorized) {
    return unauthorizedResponse()
  }

  try {
    const db = await getDatabase()
    const adsCollection = db.collection("advertisements")
    const ads = await adsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ ads })
  } catch (error) {
    console.error("[API] Error fetching ads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = verifyAdminAccess(request.headers)
  if (!authResult.isAuthorized) {
    return unauthorizedResponse()
  }

  try {
    const db = await getDatabase()
    const adsCollection = db.collection("advertisements")
    const body = await request.json()

    const newAd = {
      ...body,
      impressions: 0,
      clicks: 0,
      revenue: 0,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await adsCollection.insertOne(newAd)

    return NextResponse.json({
      success: true,
      ad: { _id: result.insertedId, ...newAd },
    })
  } catch (error) {
    console.error("[API] Error creating ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
