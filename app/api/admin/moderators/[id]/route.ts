import { type NextRequest, NextResponse } from "next/server"

// In-memory store - replace with MongoDB collection in production
const moderatorsStore = new Map()

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: moderatorId } = await params
    const body = await request.json()

    const existingModerator = moderatorsStore.get(moderatorId)
    if (!existingModerator) {
      return NextResponse.json({ error: "Moderator not found" }, { status: 404 })
    }

    const updatedModerator = {
      ...existingModerator,
      ...body,
    }

    moderatorsStore.set(moderatorId, updatedModerator)

    return NextResponse.json({ success: true, moderator: updatedModerator })
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
    moderatorsStore.delete(moderatorId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting moderator:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
