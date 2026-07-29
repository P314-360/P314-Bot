"use client"

import { useState, useEffect } from "react"
import {
  getOrCreateGuestSession,
  clearGuestSession,
  updateGuestUsername,
  isGuestSessionExpired,
  type GuestSessionData,
} from "@/lib/guest-session"

export function useGuestMode() {
  const [session, setSession] = useState<GuestSessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const initializeSession = () => {
      const guestSession = getOrCreateGuestSession()

      if (isGuestSessionExpired(guestSession)) {
        setIsExpired(true)
        clearGuestSession()
      } else {
        setSession(guestSession)
        setIsExpired(false)
      }

      setIsLoading(false)
    }

    initializeSession()

    // Check session expiry every minute
    const interval = setInterval(() => {
      const currentSession = getOrCreateGuestSession()
      if (isGuestSessionExpired(currentSession)) {
        setIsExpired(true)
        clearGuestSession()
      }
    }, 60000) // Check every 60 seconds

    return () => clearInterval(interval)
  }, [])

  const updateUsername = (name: string) => {
    updateGuestUsername(name)
    if (session) {
      setSession({
        ...session,
        guestUsername: name,
      })
    }
  }

  const exitGuestMode = () => {
    clearGuestSession()
    setSession(null)
    setIsExpired(true)
  }

  return {
    session,
    userId: session?.guestId || "guest",
    username: session?.guestUsername || "Guest Pioneer",
    setGuestUsername: updateUsername,
    isLoading,
    isExpired,
    canPostMessages: session?.features.canPostMessages || false,
    canCreateChannel: session?.features.canCreateChannel || false,
    canViewChannels: session?.features.canViewChannels || true,
    canViewChat: session?.features.canViewChat || true,
    chatMessageLimit: session?.features.chatMessageLimit || 0,
    messagesUsed: session?.features.messagesUsed || 0,
    exitGuestMode,
  }
}
