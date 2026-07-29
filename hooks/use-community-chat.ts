"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { CommunityMessage } from "@/lib/types"
import { BACKEND_URLS } from "@/lib/system-config"
import { shouldBlockContent, getSecurityWarning } from "@/lib/ai-persona-config"

export const useCommunityChat = (userId: string, username: string, piAccessToken: string | null) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const aiModeratorIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // AI Moderator: Monitors messages for security threats
  const aiModeratorCheck = (message: CommunityMessage) => {
    if (shouldBlockContent(message.text)) {
      const warningMsg: CommunityMessage = {
        id: `ai_mod_${Date.now()}`,
        text: `⚠️ ${getSecurityWarning()}\n\nMessage from ${message.username} has been flagged for review.`,
        sender: "ai_moderator",
        username: "P314 Security",
        userId: "ai_moderator",
        timestamp: new Date(),
      }

      setMessages((prev) => [
        ...prev.map((m) => (m.id === message.id ? { ...m, flagged: true, flagReason: "Sensitive data detected" } : m)),
        warningMsg,
      ])

      // Optionally remove the flagged message after warning
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== message.id))
      }, 3000)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !piAccessToken) return

    const userMessage: CommunityMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      username: username || "Anonymous",
      userId: userId,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // AI Moderator checks the message
    aiModeratorCheck(userMessage)

    try {
      const response = await fetch(BACKEND_URLS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({
          message: userMessage.text,
          userId: userId,
          username: username,
          type: "community",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.message) {
          const moderatorMsg: CommunityMessage = {
            id: data.message.id || `mod_${Date.now()}`,
            text: data.message.text,
            sender: "moderator",
            username: data.message.username || "Moderator",
            userId: data.message.userId || "moderator",
            timestamp: new Date(data.message.timestamp),
          }
          setMessages((prev) => [...prev, moderatorMsg])
        }
      }
    } catch (error) {
      console.error("[P314] Community chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (aiModeratorIntervalRef.current) {
        clearInterval(aiModeratorIntervalRef.current)
      }
    }
  }, [])

  return {
    messages,
    input,
    isLoading,
    isModerator,
    sendMessage,
    handleInputChange,
    handleKeyPress,
    setIsModerator,
  }
}
