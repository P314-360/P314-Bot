"use client"

import { useState, useEffect } from "react"
import type { JoinedChannel, ChannelNotification } from "@/lib/types"

export const useJoinedChannels = (userId: string) => {
  const [joinedChannels, setJoinedChannels] = useState<JoinedChannel[]>([])
  const [notifications, setNotifications] = useState<ChannelNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load joined channels from localStorage
  useEffect(() => {
    const key = `p314_joined_channels_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setJoinedChannels(parsed)

        // Calculate total unread
        const total = parsed.reduce((acc: number, ch: JoinedChannel) => acc + ch.unreadCount, 0)
        setUnreadCount(total)
      } catch (error) {
        console.error("[P314] Failed to load joined channels:", error)
      }
    }
  }, [userId])

  // Load notifications from localStorage
  useEffect(() => {
    const key = `p314_notifications_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
      } catch (error) {
        console.error("[P314] Failed to load notifications:", error)
      }
    }
  }, [userId])

  const joinChannel = (channelId: string, channelName: string, ownerUsername: string) => {
    const alreadyJoined = joinedChannels.some((ch) => ch.channelId === channelId)
    if (alreadyJoined) return

    const newChannel: JoinedChannel = {
      channelId,
      channelName,
      ownerUsername,
      joinedAt: new Date(),
      unreadCount: 0,
    }

    const updated = [...joinedChannels, newChannel]
    setJoinedChannels(updated)

    const key = `p314_joined_channels_${userId}`
    localStorage.setItem(key, JSON.stringify(updated))
  }

  const leaveChannel = (channelId: string) => {
    const updated = joinedChannels.filter((ch) => ch.channelId !== channelId)
    setJoinedChannels(updated)

    const key = `p314_joined_channels_${userId}`
    localStorage.setItem(key, JSON.stringify(updated))

    // Remove notifications for this channel
    const filteredNotifications = notifications.filter((n) => n.channelId !== channelId)
    setNotifications(filteredNotifications)
    const notifKey = `p314_notifications_${userId}`
    localStorage.setItem(notifKey, JSON.stringify(filteredNotifications))
  }

  const addNotification = (channelId: string, channelName: string, message: string, senderUsername: string) => {
    const notification: ChannelNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      channelName,
      message: message.substring(0, 100),
      senderUsername,
      timestamp: new Date(),
      read: false,
    }

    const updated = [notification, ...notifications]
    setNotifications(updated)

    const key = `p314_notifications_${userId}`
    localStorage.setItem(key, JSON.stringify(updated))

    // Update unread count for channel
    const updatedChannels = joinedChannels.map((ch) =>
      ch.channelId === channelId ? { ...ch, unreadCount: ch.unreadCount + 1, lastMessageAt: new Date() } : ch,
    )
    setJoinedChannels(updatedChannels)

    const channelsKey = `p314_joined_channels_${userId}`
    localStorage.setItem(channelsKey, JSON.stringify(updatedChannels))

    // Update total unread
    const total = updatedChannels.reduce((acc, ch) => acc + ch.unreadCount, 0)
    setUnreadCount(total)
  }

  const markChannelAsRead = (channelId: string) => {
    const updatedNotifications = notifications.map((n) => (n.channelId === channelId ? { ...n, read: true } : n))
    setNotifications(updatedNotifications)

    const key = `p314_notifications_${userId}`
    localStorage.setItem(key, JSON.stringify(updatedNotifications))

    // Reset unread count for channel
    const updatedChannels = joinedChannels.map((ch) => (ch.channelId === channelId ? { ...ch, unreadCount: 0 } : ch))
    setJoinedChannels(updatedChannels)

    const channelsKey = `p314_joined_channels_${userId}`
    localStorage.setItem(channelsKey, JSON.stringify(updatedChannels))

    // Update total unread
    const total = updatedChannels.reduce((acc, ch) => acc + ch.unreadCount, 0)
    setUnreadCount(total)
  }

  const clearAllNotifications = () => {
    setNotifications([])
    const key = `p314_notifications_${userId}`
    localStorage.removeItem(key)

    // Reset all unread counts
    const updatedChannels = joinedChannels.map((ch) => ({ ...ch, unreadCount: 0 }))
    setJoinedChannels(updatedChannels)
    const channelsKey = `p314_joined_channels_${userId}`
    localStorage.setItem(channelsKey, JSON.stringify(updatedChannels))
    setUnreadCount(0)
  }

  return {
    joinedChannels,
    notifications,
    unreadCount,
    joinChannel,
    leaveChannel,
    addNotification,
    markChannelAsRead,
    clearAllNotifications,
  }
}
