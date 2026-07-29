"use client"

import { useState, useEffect } from "react"
import type { VerifiedModerator, ModeratorPermissions } from "@/lib/types"

export function useModeratorManagement(piAccessToken: string | null, isAdmin: boolean) {
  const [moderators, setModerators] = useState<VerifiedModerator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchModerators = async () => {
    if (!isAdmin || !piAccessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/moderators", {
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setModerators(data.moderators || [])
      } else {
        throw new Error("Failed to fetch moderators")
      }
    } catch (err) {
      console.error("Error fetching moderators:", err)
      setError(err instanceof Error ? err.message : "Failed to load moderators")
      // Set mock data for demo purposes
      setModerators([
        {
          moderatorId: "mod_001",
          piUsername: "ModeratorDemo",
          addedBy: "Axis2030",
          addedAt: new Date(),
          permissions: {
            canModerateChat: true,
            canReviewReports: true,
            canManageContent: false,
            canAccessAnalytics: true,
          },
          isActive: true,
          specialization: ["KYC", "Account Issues"],
          language: ["en", "ar"],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const addModerator = async (
    piUsername: string,
    permissions: ModeratorPermissions,
    specialization?: string[],
    language?: string[],
  ): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/moderators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({
          piUsername,
          permissions,
          specialization,
          language,
        }),
      })

      if (response.ok) {
        await fetchModerators()
        return true
      }

      throw new Error("Failed to add moderator")
    } catch (err) {
      console.error("Error adding moderator:", err)
      setError(err instanceof Error ? err.message : "Failed to add moderator")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateModerator = async (moderatorId: string, updates: Partial<VerifiedModerator>): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/moderators/${moderatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchModerators()
        return true
      }

      throw new Error("Failed to update moderator")
    } catch (err) {
      console.error("Error updating moderator:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeModerator = async (moderatorId: string): Promise<boolean> => {
    if (!isAdmin || !piAccessToken) return false

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/moderators/${moderatorId}`, {
        method: "DELETE",
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        await fetchModerators()
        return true
      }

      throw new Error("Failed to remove moderator")
    } catch (err) {
      console.error("Error removing moderator:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchModerators()
    }
  }, [isAdmin, piAccessToken])

  return {
    moderators,
    isLoading,
    error,
    addModerator,
    updateModerator,
    removeModerator,
    refreshModerators: fetchModerators,
  }
}
