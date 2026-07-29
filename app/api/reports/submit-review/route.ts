import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportId, validatorId, validatorUsername, verdict } = body

    if (!reportId || !validatorId || !verdict) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get all reports (in production, this would be database query)
    const allReports =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("p314_pending_reports") || "[]") : []

    // Find the report
    const reportIndex = allReports.findIndex((r: any) => r.id === reportId)
    if (reportIndex === -1) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 })
    }

    const report = allReports[reportIndex]

    // Check if validator is assigned to this report
    if (!report.assignedValidators?.includes(validatorId)) {
      return NextResponse.json({ success: false, error: "Validator not assigned to this report" }, { status: 403 })
    }

    // Check if already reviewed
    if (report.reviews?.some((r: any) => r.validatorId === validatorId)) {
      return NextResponse.json({ success: false, error: "Already reviewed this report" }, { status: 400 })
    }

    // Add review
    if (!report.reviews) report.reviews = []
    report.reviews.push({
      validatorId,
      validatorUsername,
      verdict,
      reviewedAt: new Date().toISOString(),
    })

    // Update status to in_review
    if (report.verificationStatus === "awaiting_validators") {
      report.verificationStatus = "in_review"
    }

    // Check for consensus (2 out of 3)
    const fraudCount = report.reviews.filter((r: any) => r.verdict === "fraud_confirmed").length
    const safeCount = report.reviews.filter((r: any) => r.verdict === "safe").length

    let consensus = null
    let correctValidators: string[] = []
    let incorrectValidators: string[] = []

    if (fraudCount >= 2) {
      report.verificationStatus = "verified"
      report.finalVerdict = "fraud_confirmed"
      report.verifiedAt = new Date().toISOString()
      consensus = "fraud_confirmed"
      correctValidators = report.reviews
        .filter((r: any) => r.verdict === "fraud_confirmed")
        .map((r: any) => r.validatorId)
      incorrectValidators = report.reviews.filter((r: any) => r.verdict === "safe").map((r: any) => r.validatorId)
    } else if (safeCount >= 2) {
      report.verificationStatus = "rejected"
      report.finalVerdict = "safe"
      report.verifiedAt = new Date().toISOString()
      consensus = "safe"
      correctValidators = report.reviews.filter((r: any) => r.verdict === "safe").map((r: any) => r.validatorId)
      incorrectValidators = report.reviews
        .filter((r: any) => r.verdict === "fraud_confirmed")
        .map((r: any) => r.validatorId)
    }

    // Save updated report
    allReports[reportIndex] = report
    if (typeof window !== "undefined") {
      localStorage.setItem("p314_pending_reports", JSON.stringify(allReports))
    }

    // Process rewards if consensus reached
    if (consensus) {
      // Reward correct validators (+1 Pi point to wallet)
      for (const vId of correctValidators) {
        await fetch("/api/reputation/add-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: vId,
            activityType: "correct_verification",
            points: 1.0, // 1 Pi point reward
          }),
        })
      }

      // Penalize incorrect validators (-5 reputation points)
      for (const vId of incorrectValidators) {
        await fetch("/api/reputation/add-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: vId,
            activityType: "incorrect_verification",
            points: -5, // -5 reputation penalty
          }),
        })
      }
    }

    return NextResponse.json({
      success: true,
      consensus: consensus ? true : false,
      finalVerdict: consensus,
      message: consensus ? `Consensus reached: ${consensus}` : "Review submitted, waiting for more validators",
    })
  } catch (error) {
    console.error("[P314] Submit review error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 500 })
  }
}
