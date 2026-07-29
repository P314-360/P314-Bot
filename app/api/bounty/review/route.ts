import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const authResult = verifyAdminAccess(request.headers)

  if (!authResult.isAuthorized) {
    console.warn(`[SECURITY] Unauthorized bounty review attempt by: ${authResult.username ?? "unknown"}`)
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { reportId, adminId, action, notes } = body

    if (!reportId || !adminId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
    }

    if (adminId !== authResult.username) {
      console.warn(`[SECURITY] Admin ID mismatch. Header: ${authResult.username}, Body: ${adminId}`)
      return NextResponse.json({ success: false, error: "Authentication mismatch" }, { status: 403 })
    }

    const db = await getDatabase()
    const reportsCollection = db.collection("novelFraudReports")

    const report = await reportsCollection.findOne({ _id: reportId as any })
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 })
    }

    const isApproved = action === "approve"
    const bountyPaid = isApproved ? (report.bountyAmount ?? 0) : 0
    const reputationBonus = isApproved ? (report.reputationBonus ?? 0) : 0

    await reportsCollection.updateOne(
      { _id: reportId as any },
      {
        $set: {
          status: isApproved ? "approved" : "rejected",
          reviewedBy: adminId,
          reviewNotes: notes ?? "",
          reviewedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    console.log(`[P314] Bounty report ${action}d:`, reportId, "by", adminId)

    return NextResponse.json({
      success: true,
      action,
      bountyPaid,
      reputationBonus,
    })
  } catch (error) {
    console.error("[P314] Error reviewing bounty report:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
