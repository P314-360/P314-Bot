"use client"

import { useState, useEffect } from "react"
import type { UserLevel } from "@/lib/reputation-system"

export interface ReputationStats {
  reputationPoints: number
  walletBalance: number
  userLevel: UserLevel
  referralCount: number
  totalReports: number
  accurateReports: number
  falseReports: number
  accuracyRate: number
}

export interface LevelInfo {
  level_name: string
  min_reputation: string
  max_reputation: string | null
  benefits: string
  features_unlocked: string[]
}

export interface ReputationActivity {
  type: string
  pointsChange: number
  balanceChange: number
  description: string
  createdAt: string
}

export function useReputation(userId: string | null) {
  const [stats, setStats] = useState<ReputationStats | null>(null)
  const [currentLevel, setCurrentLevel] = useState<LevelInfo | null>(null)
  const [nextLevel, setNextLevel] = useState<LevelInfo | null>(null)
  const [progressToNextLevel, setProgressToNextLevel] = useState(0)
  const [recentActivities, setRecentActivities] = useState<ReputationActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/reputation/get-user-stats?userId=${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch reputation stats")
      }

      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setCurrentLevel(data.currentLevel)
        setNextLevel(data.nextLevel)
        setProgressToNextLevel(data.progressToNextLevel)
        setRecentActivities(data.recentActivities)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (activityType: string, description?: string, relatedId?: string) => {
    if (!userId) return

    try {
      const response = await fetch("/api/reputation/add-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          activityType,
          description,
          relatedId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh stats after adding activity
        await fetchStats()
        return data
      }
    } catch (err) {
      console.error("Error adding activity:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  return {
    stats,
    currentLevel,
    nextLevel,
    progressToNextLevel,
    recentActivities,
    loading,
    error,
    refresh: fetchStats,
    addActivity,
  }
}
