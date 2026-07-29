import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validatorId = searchParams.get("validatorId")

    if (!validatorId) {
      return NextResponse.json({ success: false, error: "Validator ID required" }, { status: 400 })
    }

    // Get all pending reports (in production, query database)
    const allReports =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("p314_pending_reports") || "[]") : []

    // Filter reports assigned to this validator that haven't been reviewed yet
    const pendingReports = allReports.filter((report: any) => {
      const isAssigned = report.assignedValidators?.includes(validatorId)
      const notReviewed = !report.reviews?.some((r: any) => r.validatorId === validatorId)
      const stillPending =
        report.verificationStatus === "awaiting_validators" || report.verificationStatus === "in_review"

      return isAssigned && notReviewed && stillPending
    })

    return NextResponse.json({
      success: true,
      reports: pendingReports,
      count: pendingReports.length,
    })
  } catch (error) {
    console.error("[P314] Fetch pending reviews error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pending reviews" }, { status: 500 })
  }
}
