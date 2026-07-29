"use client"

import { useState, useEffect } from "react"
import type { UserChannel } from "@/lib/types"

export const useUserChannel = (userId: string, _piAccessToken: string | null) => {
  const [channel, setChannel] = useState<UserChannel | null>(null)
  const [allChannels, setAllChannels] = useState<UserChannel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasChannel, setHasChannel] = useState(false)

  useEffect(() => {
    const storedChannels = localStorage.getItem("p314_all_channels")
    if (storedChannels) {
      try {
        setAllChannels(JSON.parse(storedChannels))
      } catch (error) {
        console.error("[P314] Failed to load channels:", error)
      }
    }
  }, [])

  const createChannel = async (channelName: string, description: string, piUsername: string) => {
    setIsLoading(true)
    try {
      const newChannel: UserChannel = {
        channelId: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId: userId,
        ownerUsername: piUsername,
        channelName,
        description,
        isVerified: false,
        subscribers: 0,
        createdAt: new Date(),
        isActive: true,
        moderatedByAI: true,
        helpStats: {
          totalHelps: 0,
          successRate: 0,
          averageRating: 0,
        },
      }

      setChannel(newChannel)
      setHasChannel(true)

      localStorage.setItem("p314_user_channel", JSON.stringify(newChannel))

      const updatedChannels = [...allChannels, newChannel]
      setAllChannels(updatedChannels)
      localStorage.setItem("p314_all_channels", JSON.stringify(updatedChannels))

      return true
    } catch (error) {
      console.error("[P314] Failed to create channel:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserChannel = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const storedChannel = localStorage.getItem("p314_user_channel")
      if (storedChannel) {
        const parsedChannel = JSON.parse(storedChannel)
        if (parsedChannel.ownerId === userId) {
          setChannel(parsedChannel)
          setHasChannel(true)
        }
      }
    } catch (error) {
      console.error("[P314] Failed to fetch channel:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllChannels = async () => {
    setIsLoading(true)
    try {
      const storedChannels = localStorage.getItem("p314_all_channels")
      if (storedChannels) {
        setAllChannels(JSON.parse(storedChannels))
      }
    } catch (error) {
      console.error("[P314] Failed to fetch all channels:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserChannel()
    fetchAllChannels()
  }, [userId])

  return {
    channel,
    hasChannel,
    isLoading,
    allChannels,
    createChannel,
    refreshChannel: fetchUserChannel,
    refreshAllChannels: fetchAllChannels,
  }
}
