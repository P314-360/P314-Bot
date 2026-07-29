import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb-server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: adId } = await params
    const body = await request.json()

    const col = await getCollection("advertisements")
    const existing = await col.findOne({ adId })

    if (!existing) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    const { _id, ...updateFields } = body
    await col.updateOne({ adId }, { $set: { ...updateFields, updatedAt: new Date() } })

    const updated = await col.findOne({ adId })
    return NextResponse.json({ success: true, ad: updated })
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
    const col = await getCollection("advertisements")
    await col.deleteOne({ adId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ad:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
