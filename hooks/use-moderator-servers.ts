"use client"

import { useState, useEffect } from "react"
import type { ModeratorServer } from "@/lib/types"
import { BACKEND_URLS } from "@/lib/system-config"

export const useModeratorServers = (piAccessToken: string | null) => {
  const [servers, setServers] = useState<ModeratorServer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchModeratorServers = async () => {
    if (!piAccessToken) return

    setIsLoading(true)
    try {
      const response = await fetch(`${BACKEND_URLS.CHAT}/moderators`, {
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setServers(data.moderators || [])
      }
    } catch (error) {
      console.error("[P314] Failed to fetch moderator servers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchModeratorServers()
  }, [piAccessToken])

  return {
    servers,
    isLoading,
    refreshServers: fetchModeratorServers,
  }
}
