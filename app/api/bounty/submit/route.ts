import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reporterId, reporterUsername, title, description, evidenceUrl, keywords } = body

    if (!reporterId || !reporterUsername || !title || !description) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const reportsCollection = db.collection("novelFraudReports")

    const BOUNTY_AMOUNT = 5.0
    const REPUTATION_BONUS = 50

    const report = {
      reporterId,
      reporterUsername,
      fraudMethodTitle: title,
      description,
      evidenceImageUrl: evidenceUrl ?? null,
      keywords: Array.isArray(keywords) ? keywords : [],
      bountyAmount: BOUNTY_AMOUNT,
      reputationBonus: REPUTATION_BONUS,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await reportsCollection.insertOne(report)

    console.log("[P314] Novel fraud report submitted:", result.insertedId)

    return NextResponse.json({
      success: true,
      reportId: result.insertedId.toString(),
      message: "Your novel fraud pattern report has been submitted for admin review!",
      bountyAmount: BOUNTY_AMOUNT,
      reputationBonus: REPUTATION_BONUS,
    })
  } catch (error) {
    console.error("[P314] Error submitting bounty report:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
