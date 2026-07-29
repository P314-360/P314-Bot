"use client"

import { useState, useEffect } from "react"
import type { Advertisement } from "@/lib/types"

export function useAdManagement(piAccessToken: string | null, isAdmin: boolean) {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAds = async () => {
    if (!isAdmin || !piAccessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/ads", {
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAds(data.ads || [])
      } else {
        throw new Error("Failed to fetch ads")
      }
    } catch (err) {
      console.error("Error fetching ads:", err)
      setError(err instanceof Error ? err.message : "Failed to load ads")
      // Set mock data for demo
      setAds([
        {
          adId: "ad_001",
          title: "Pi Network Marketplace",
          description: "Discover amazing products on Pi Network",
          targetUrl: "https://example.com",
          isActive: true,
          displayType: "banner",
          priority: 1,
          impressions: 1250,
          clicks: 45,
          revenue: 25.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const createAd = async (
    ad: Omit<Advertisement, "adId" | "impressions" | "clicks" | "revenue" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify(ad),
      })

      if (response.ok) {
        await fetchAds()
        return true
      }

      throw new Error("Failed to create ad")
    } catch (err) {
      console.error("Error creating ad:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateAd = async (adId: string, updates: Partial<Advertisement>): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchAds()
        return true
      }

      throw new Error("Failed to update ad")
    } catch (err) {
      console.error("Error updating ad:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAd = async (adId: string): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: "DELETE",
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        await fetchAds()
        return true
      }

      throw new Error("Failed to delete ad")
    } catch (err) {
      console.error("Error deleting ad:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAds()
    }
  }, [isAdmin, piAccessToken])

  return {
    ads,
    isLoading,
    error,
    createAd,
    updateAd,
    deleteAd,
    refreshAds: fetchAds,
  }
}
