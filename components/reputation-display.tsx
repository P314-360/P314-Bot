"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getLevelBadge, getLevelColor } from "@/lib/reputation-system"
import type { UserLevel } from "@/lib/reputation-system"
import { Trophy, Coins, Target, TrendingUp } from "lucide-react"

interface ReputationDisplayProps {
  reputationPoints: number
  walletBalance: number
  userLevel: UserLevel
  accuracyRate: number
  progressToNextLevel: number
  nextLevelName?: string
  compact?: boolean
}

export function ReputationDisplay({
  reputationPoints,
  walletBalance,
  userLevel,
  accuracyRate,
  progressToNextLevel,
  nextLevelName,
  compact = false,
}: ReputationDisplayProps) {
  const levelBadge = getLevelBadge(userLevel)
  const levelColor = getLevelColor(userLevel)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Trophy className={`h-4 w-4 ${levelColor}`} />
          <span className="text-sm font-medium">{reputationPoints.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{walletBalance.toFixed(2)} π</span>
        </div>
        <Badge variant="outline" className={levelColor}>
          {levelBadge} {userLevel}
        </Badge>
      </div>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reputation Status</h3>
        <Badge className={levelColor}>
          {levelBadge} {userLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            Reputation Points
          </div>
          <p className="text-2xl font-bold">{reputationPoints.toFixed(1)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4" />
            Wallet Balance
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{walletBalance.toFixed(2)} π</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            Accuracy Rate
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500">{accuracyRate.toFixed(1)}%</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Level Progress
          </div>
          <p className="text-2xl font-bold">{progressToNextLevel}%</p>
        </div>
      </div>

      {nextLevelName && progressToNextLevel < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to {nextLevelName}</span>
            <span className="font-medium">{progressToNextLevel}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
      )}
    </Card>
  )
}
