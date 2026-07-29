import { type NextRequest, NextResponse } from "next/server"

// In-memory store - replace with MongoDB collection in production
const moderatorsStore = new Map()

export async function GET(request: NextRequest) {
  try {
    const moderators = Array.from(moderatorsStore.values())
    return NextResponse.json({ moderators })
  } catch (error) {
    console.error("Error fetching moderators:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { piUsername, permissions, specialization, language } = body

    const moderatorId = `mod_${Date.now()}`
    const newModerator = {
      moderatorId,
      piUsername,
      addedBy: "Axis2030",
      addedAt: new Date(),
      permissions,
      isActive: true,
      specialization,
      language,
    }

    moderatorsStore.set(moderatorId, newModerator)

    return NextResponse.json({ success: true, moderator: newModerator })
  } catch (error) {
    console.error("Error adding moderator:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
