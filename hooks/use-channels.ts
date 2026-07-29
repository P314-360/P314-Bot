// ═══════════════════════════════════════════════════════════════════════════════
// Channels Hook - MongoDB (Client-side)
// ═══════════════════════════════════════════════════════════════════════════════

"use client"

import { useState, useEffect } from "react"
import { getFromApi, postToApi } from "@/lib/mongodb-client"
import type { UserChannel } from "@/lib/types"

export function useChannels(piUsername: string | null) {
  const [channels, setChannels] = useState<UserChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!piUsername) {
      setLoading(false)
      return
    }

    fetchChannels()

    // Poll for channel updates every 5 seconds (MongoDB long-polling pattern)
    const pollInterval = setInterval(() => {
      fetchChannels()
    }, 5000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [piUsername])

  async function fetchChannels() {
    try {
      setLoading(true)
      setError(null)

      const response = await getFromApi<any[]>("/api/channels/list", {
        sort: "-createdAt",
      })

      const transformedChannels: UserChannel[] = (response || []).map((channel) => ({
        id: channel._id,
        name: channel.name,
        description: channel.description,
        ownerUsername: channel.ownerUsername,
        ownerPiUid: channel.ownerPiUid,
        subscribers: channel.subscribers || 0,
        isVerified: channel.isVerified,
        aiModerated: channel.aiModerated || true,
        createdAt: new Date(channel.createdAt).getTime(),
        reputationScore: channel.reputationScore || 0,
      }))

      setChannels(transformedChannels)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error("[Channels Hook] Error fetching channels:", err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function createChannel(name: string, description: string) {
    if (!piUsername) {
      throw new Error("Must be authenticated to create channel")
    }

    try {
      setLoading(true)

      const response = await postToApi<any>("/api/channels/create", {
        name,
        description,
        ownerUsername: piUsername,
      })

      await fetchChannels()
      return response
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error("[Channels Hook] Error creating channel:", err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { channels, loading, error, createChannel, refreshChannels: fetchChannels }
}
