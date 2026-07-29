import { type NextRequest, NextResponse } from "next/server"
import { getReputationCollection, getWithdrawalsCollection } from "@/lib/mongodb-server"
import { calculateWithdrawalFee, addAdminCommission, getRevenueConfig } from "@/lib/admin-revenue"

export async function POST(req: NextRequest) {
  try {
    const { userId, username, amount, walletAddress } = await req.json()

    if (!userId || !username || !amount || !walletAddress || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    const reputationCollection = await getReputationCollection()

    // Check user balance
    const userRep = await reputationCollection.findOne({ userId })

    if (!userRep || (userRep.walletBalance ?? 0) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Get revenue config and calculate fee
    const revenueConfig = await getRevenueConfig()
    const { fee, netAmount } = calculateWithdrawalFee(amount, revenueConfig.withdrawalFeeRate)

    // Deduct amount from user balance
    await reputationCollection.updateOne(
      { userId },
      { $inc: { walletBalance: -amount }, $set: { updatedAt: new Date() } },
    )

    // Create withdrawal request
    const withdrawalsCollection = await getWithdrawalsCollection()
    const withdrawal = {
      userId,
      username,
      amount,
      feeAmount: fee,
      netAmount,
      walletAddress,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await withdrawalsCollection.insertOne(withdrawal)

    // Add fee to admin treasury
    await addAdminCommission("withdrawal_fee", fee, userId, `Withdrawal fee from ${username}`)

    return NextResponse.json({
      success: true,
      withdrawalId: result.insertedId.toString(),
      amount,
      fee,
      netAmount,
    })
  } catch (error) {
    console.error("Error processing withdrawal:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}
