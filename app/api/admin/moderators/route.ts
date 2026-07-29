import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb-server"

export async function GET() {
  try {
    const col = await getCollection("moderators")
    const moderators = await col.find({}).sort({ addedAt: -1 }).toArray()
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

    if (!piUsername) {
      return NextResponse.json({ error: "piUsername is required" }, { status: 400 })
    }

    const col = await getCollection("moderators")

    const moderatorId = `mod_${Date.now()}`
    const newModerator = {
      moderatorId,
      piUsername,
      addedBy: "Axis2030",
      addedAt: new Date(),
      permissions: permissions ?? [],
      isActive: true,
      specialization: specialization ?? "",
      language: language ?? "en",
    }

    await col.insertOne(newModerator)

    return NextResponse.json({ success: true, moderator: newModerator })
  } catch (error) {
    console.error("Error adding moderator:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
