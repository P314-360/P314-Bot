import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { language, userId } = await request.json()

    if (!language || !userId) {
      return NextResponse.json({ error: "Missing language or userId" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    await users.updateOne(
      { $or: [{ _id: userId as any }, { piUid: userId }] },
      { $set: { languagePreference: language, updatedAt: new Date() } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Language update error:", error)
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 })
  }
}
