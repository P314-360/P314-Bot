import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb-server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: moderatorId } = await params
    const body = await request.json()

    const col = await getCollection("moderators")
    const existing = await col.findOne({ moderatorId })

    if (!existing) {
      return NextResponse.json({ error: "Moderator not found" }, { status: 404 })
    }

    const { _id, ...updateFields } = body
    await col.updateOne({ moderatorId }, { $set: { ...updateFields, updatedAt: new Date() } })

    const updated = await col.findOne({ moderatorId })
    return NextResponse.json({ success: true, moderator: updated })
  } catch (error) {
    console.error("Error updating moderator:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: moderatorId } = await params
    const col = await getCollection("moderators")
    await col.deleteOne({ moderatorId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting moderator:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
