import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { calculateLevel } from "@/lib/reputation-system"

const LEVEL_THRESHOLDS = {
  beginner: { min: 0, max: 99 },
  investigator: { min: 100, max: 499 },
  expert: { min: 500, max: 1999 },
  master: { min: 2000, max: Infinity },
}

const NEXT_LEVEL: Record<string, string | null> = {
  beginner: "investigator",
  investigator: "expert",
  expert: "master",
  master: null,
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")
    const reputationActivities = db.collection("reputationActivities")

    // Get user reputation stats
    const user = await users.findOne(
      { $or: [{ _id: userId as any }, { piUid: userId }] },
      {
        projection: {
          reputationPoints: 1,
          walletBalance: 1,
          userLevel: 1,
          referralCount: 1,
          totalReports: 1,
          accurateReports: 1,
          falseReports: 1,
          accuracyRate: 1,
        },
      },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent activities
    const recentActivities = await reputationActivities
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    const currentRep = user.reputationPoints ?? 0
    const currentLevelName = (user.userLevel ?? calculateLevel(currentRep)) as string
    const nextLevelName = NEXT_LEVEL[currentLevelName] ?? null

    const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevelName as keyof typeof LEVEL_THRESHOLDS] ?? {
      min: 0,
      max: 99,
    }
    const nextLevelThreshold = nextLevelName
      ? LEVEL_THRESHOLDS[nextLevelName as keyof typeof LEVEL_THRESHOLDS]
      : null

    const progressToNextLevel = nextLevelThreshold
      ? Math.min(
          100,
          Math.round(
            ((currentRep - currentLevelThreshold.min) /
              (nextLevelThreshold.min - currentLevelThreshold.min)) *
              100,
          ),
        )
      : 100

    return NextResponse.json({
      success: true,
      stats: {
        reputationPoints: currentRep,
        walletBalance: user.walletBalance ?? 0,
        userLevel: currentLevelName,
        referralCount: user.referralCount ?? 0,
        totalReports: user.totalReports ?? 0,
        accurateReports: user.accurateReports ?? 0,
        falseReports: user.falseReports ?? 0,
        accuracyRate: user.accuracyRate ?? 0,
      },
      currentLevel: { level_name: currentLevelName, ...currentLevelThreshold },
      nextLevel: nextLevelName ? { level_name: nextLevelName, ...nextLevelThreshold } : null,
      progressToNextLevel,
      recentActivities: recentActivities.map((activity) => ({
        type: activity.activityType,
        pointsChange: activity.pointsChange ?? 0,
        balanceChange: activity.balanceChange ?? 0,
        description: activity.description ?? "",
        createdAt: activity.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
