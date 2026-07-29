import { type NextRequest, NextResponse } from "next/server"

// In-memory store - replace with MongoDB collection in production
const adsStore = new Map()

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: adId } = await params
    const body = await request.json()

    const existingAd = adsStore.get(adId)
    if (!existingAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    const updatedAd = {
      ...existingAd,
      ...body,
      updatedAt: new Date(),
    }

    adsStore.set(adId, updatedAd)

    return NextResponse.json({ success: true, ad: updatedAd })
  } catch (error) {
    console.error("Error updating ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: adId } = await params
    adsStore.delete(adId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
