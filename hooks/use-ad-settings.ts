"use client"

import { useState, useEffect } from "react"
import type { AdSettings } from "@/lib/types"

export function useAdSettings(userId: string, piAccessToken: string | null) {
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAdSettings = async () => {
    if (!userId || !piAccessToken) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/ad-settings?userId=${userId}`, {
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdSettings(data.settings)
      } else {
        throw new Error("Failed to fetch ad settings")
      }
    } catch (err) {
      console.error("Error fetching ad settings:", err)
      // Set default settings
      setAdSettings({
        userId,
        adsEnabled: false,
        earnedRevenue: 0,
        revenueSharePercentage: 5,
        features: [],
        lastUpdated: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateAdSettings = async (adsEnabled: boolean): Promise<boolean> => {
    if (!userId || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/ad-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({
          userId,
          adsEnabled,
        }),
      })

      if (response.ok) {
        await fetchAdSettings()
        return true
      }

      throw new Error("Failed to update ad settings")
    } catch (err) {
      console.error("Error updating ad settings:", err)
      // Update locally for demo
      if (adSettings) {
        setAdSettings({
          ...adSettings,
          adsEnabled,
          lastUpdated: new Date(),
        })
      }
      return true
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId && piAccessToken) {
      fetchAdSettings()
    }
  }, [userId, piAccessToken])

  return {
    adSettings,
    isLoading,
    updateAdSettings,
    refreshSettings: fetchAdSettings,
  }
}
