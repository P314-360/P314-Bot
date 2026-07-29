import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const authResult = verifyAdminAccess(req.headers)

  if (!authResult.isAuthorized) {
    console.warn(`[SECURITY] Unauthorized admin treasury access attempt by: ${authResult.username || "unknown"}`)
    return unauthorizedResponse()
  }

  try {
    const db = await getDatabase()
    const treasuryCollection = db.collection("adminTreasury")

    const treasury = await treasuryCollection.findOne({})

    if (!treasury) {
      return NextResponse.json({
        totalBalance: 0,
        totalValidatorCommissions: 0,
        totalWithdrawalFees: 0,
        totalPremiumServices: 0,
        lastUpdated: new Date(),
      })
    }

    return NextResponse.json({
      totalBalance: treasury.totalBalance || 0,
      totalValidatorCommissions: treasury.totalValidatorCommissions || 0,
      totalWithdrawalFees: treasury.totalWithdrawalFees || 0,
      totalPremiumServices: treasury.totalPremiumServices || 0,
      lastUpdated: treasury.lastUpdated,
    })
  } catch (error) {
    console.error("Error fetching admin treasury:", error)
    return NextResponse.json({ error: "Failed to fetch treasury" }, { status: 500 })
  }
}
