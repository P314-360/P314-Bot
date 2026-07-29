"use client"

import type { RatingAnalytics } from "@/lib/types"
import { BACKEND_URLS } from "@/lib/system-config"

export const useRatingAnalytics = () => {
  const submitRating = async (
    messageId: string,
    rating: number,
    feedback: string | undefined,
    userId: string,
    piAccessToken: string | null,
  ) => {
    const analytics: RatingAnalytics = {
      messageId,
      rating,
      feedback,
      timestamp: new Date(),
      userId,
    }

    // Save locally
    try {
      const existingRatings = localStorage.getItem("p314_rating_analytics")
      const ratingsArray = existingRatings ? JSON.parse(existingRatings) : []
      ratingsArray.unshift(analytics)
      localStorage.setItem("p314_rating_analytics", JSON.stringify(ratingsArray.slice(0, 500)))
    } catch (error) {
      console.error("[P314] Failed to save rating locally:", error)
    }

    if (piAccessToken) {
      try {
        await fetch(BACKEND_URLS.CHAT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: piAccessToken,
          },
          body: JSON.stringify({
            message: JSON.stringify(analytics),
            type: "rating_analytics",
          }),
        })
      } catch (error) {
        console.error("[P314] Failed to send rating to backend:", error)
      }
    }

    return analytics
  }

  const getRatingStats = () => {
    try {
      const existingRatings = localStorage.getItem("p314_rating_analytics")
      if (!existingRatings) return null

      const ratingsArray: RatingAnalytics[] = JSON.parse(existingRatings)
      const total = ratingsArray.length
      const sum = ratingsArray.reduce((acc, r) => acc + r.rating, 0)
      const average = total > 0 ? sum / total : 0

      const distribution = {
        1: ratingsArray.filter((r) => r.rating === 1).length,
        2: ratingsArray.filter((r) => r.rating === 2).length,
        3: ratingsArray.filter((r) => r.rating === 3).length,
        4: ratingsArray.filter((r) => r.rating === 4).length,
        5: ratingsArray.filter((r) => r.rating === 5).length,
      }

      return {
        total,
        average: Math.round(average * 10) / 10,
        distribution,
      }
    } catch (error) {
      console.error("[P314] Failed to get rating stats:", error)
      return null
    }
  }

  return {
    submitRating,
    getRatingStats,
  }
}
