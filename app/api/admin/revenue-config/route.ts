import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const authResult = verifyAdminAccess(req.headers)

  if (!authResult.isAuthorized) {
    console.warn(`[SECURITY] Unauthorized revenue config access attempt by: ${authResult.username || "unknown"}`)
    return unauthorizedResponse()
  }

  try {
    const db = await getDatabase()
    const configCollection = db.collection("revenueConfig")

    const config = await configCollection.findOne({})

    if (!config) {
      return NextResponse.json({
        validatorCommissionRate: 0.1,
        withdrawalFeeRate: 0.05,
        premiumServiceRate: 1.0,
      })
    }

    return NextResponse.json({
      validatorCommissionRate: config.validatorCommissionRate || 0.1,
      withdrawalFeeRate: config.withdrawalFeeRate || 0.05,
      premiumServiceRate: config.premiumServiceRate || 1.0,
    })
  } catch (error) {
    console.error("Error fetching revenue config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const authResult = verifyAdminAccess(req.headers)

  if (!authResult.isAuthorized) {
    console.warn(`[SECURITY] Unauthorized revenue config update attempt by: ${authResult.username || "unknown"}`)
    return unauthorizedResponse()
  }

  try {
    const { validatorCommissionRate, withdrawalFeeRate, premiumServiceRate } = await req.json()

    const db = await getDatabase()
    const configCollection = db.collection("revenueConfig")

    const updateData: any = {}
    if (validatorCommissionRate !== undefined) updateData.validatorCommissionRate = validatorCommissionRate
    if (withdrawalFeeRate !== undefined) updateData.withdrawalFeeRate = withdrawalFeeRate
    if (premiumServiceRate !== undefined) updateData.premiumServiceRate = premiumServiceRate

    updateData.updatedAt = new Date().toISOString()
    updateData.updatedBy = authResult.username

    await configCollection.updateOne({}, { $set: updateData }, { upsert: true })

    console.log(`[P314] Revenue config updated by admin: ${authResult.username}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating revenue config:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
