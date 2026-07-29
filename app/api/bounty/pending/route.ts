import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from database
    // For now, return mock data
    const pendingReports = [
      {
        id: "1",
        reporterUsername: "SecurityHunter",
        fraudMethodTitle: "Fake KYC Verification Site",
        description:
          "Scammers are creating fake KYC verification websites that look identical to the official Pi Network KYC portal...",
        evidenceImageUrl: "/placeholder.jpg",
        keywords: ["fake kyc", "phishing", "identity theft"],
        bountyAmount: 10.0,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    return NextResponse.json({ success: true, reports: pendingReports })
  } catch (error) {
    console.error("[P314] Error fetching pending bounty reports:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
