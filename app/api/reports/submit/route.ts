import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with your actual database
const mockValidators = [
  { id: "validator1", reputation: 150 },
  { id: "validator2", reputation: 200 },
  { id: "validator3", reputation: 120 },
  { id: "validator4", reputation: 180 },
  { id: "validator5", reputation: 250 },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reporterId, reporterUsername, reportType, description, evidence, suspectWallet, suspectLink } = body

    // Generate unique report ID
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get validators with reputation >= 100 (excluding reporter)
    const eligibleValidators = mockValidators.filter((v) => v.reputation >= 100 && v.id !== reporterId).map((v) => v.id)

    // Randomly select 3 validators
    const shuffled = [...eligibleValidators].sort(() => Math.random() - 0.5)
    const assignedValidators = shuffled.slice(0, 3)

    // Create report object
    const report = {
      id: reportId,
      reporterId,
      reporterUsername,
      reportType,
      description,
      evidence,
      suspectWallet,
      suspectLink,
      verificationStatus: "awaiting_validators",
      assignedValidators,
      reviews: [],
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage (in production, this would be in database)
    const existingReports = JSON.parse(
      typeof window !== "undefined" ? localStorage.getItem("p314_pending_reports") || "[]" : "[]",
    )
    existingReports.push(report)

    if (typeof window !== "undefined") {
      localStorage.setItem("p314_pending_reports", JSON.stringify(existingReports))
    }

    return NextResponse.json({
      success: true,
      reportId,
      assignedValidators,
      message: "Report submitted and assigned to validators",
    })
  } catch (error) {
    console.error("[P314] Report submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 })
  }
}
