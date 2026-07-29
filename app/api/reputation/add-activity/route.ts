import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { calculateReward, calculateLevel } from "@/lib/reputation-system"
import type { ActivityType, UserLevel } from "@/lib/reputation-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, activityType, description, relatedId } = body

    if (!userId || !activityType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")
    const reputationActivities = db.collection("reputationActivities")

    // Get current user
    const user = await users.findOne({ $or: [{ _id: userId as any }, { piUid: userId }] })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const currentLevel = (user.userLevel ?? "beginner") as UserLevel
    const reward = calculateReward(activityType as ActivityType, currentLevel)

    // Update reputation atomically
    const updatedUser = await users.findOneAndUpdate(
      { $or: [{ _id: userId as any }, { piUid: userId }] },
      {
        $inc: {
          reputationPoints: reward.points,
          walletBalance: reward.balance,
        },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    // Recalculate level
    const newLevel = calculateLevel(updatedUser.reputationPoints ?? 0)
    const leveledUp = newLevel !== currentLevel

    if (leveledUp) {
      await users.updateOne(
        { $or: [{ _id: userId as any }, { piUid: userId }] },
        { $set: { userLevel: newLevel, updatedAt: new Date() } },
      )
    }

    // Record the activity
    await reputationActivities.insertOne({
      userId,
      activityType,
      pointsChange: reward.points,
      balanceChange: reward.balance,
      description: description ?? "",
      relatedId: relatedId ?? null,
      createdAt: new Date(),
    })

    if (leveledUp) {
      await reputationActivities.insertOne({
        userId,
        activityType: "level_up",
        pointsChange: 0,
        balanceChange: 0,
        description: `Congratulations! You reached ${newLevel} level!`,
        relatedId: null,
        createdAt: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      reward,
      leveledUp,
      newLevel: leveledUp ? newLevel : currentLevel,
      currentReputation: updatedUser.reputationPoints ?? 0,
      currentBalance: updatedUser.walletBalance ?? 0,
      accuracyRate: updatedUser.accuracyRate ?? 0,
    })
  } catch (error) {
    console.error("Error adding reputation activity:", error)
    return NextResponse.json({ error: "Failed to add reputation activity" }, { status: 500 })
  }
}
