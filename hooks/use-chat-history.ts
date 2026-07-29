"use client"

import { useState, useEffect } from "react"
import type { Message, ChatHistory } from "@/lib/types"

const MAX_HISTORY_ITEMS = 50

export const useChatHistory = () => {
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("p314_chat_history")
      if (stored) {
        const parsed = JSON.parse(stored)
        setHistory(
          parsed.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp),
            messages: h.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          })),
        )
      }
      // Create new session
      setCurrentSessionId(Date.now().toString())
    } catch (error) {
      console.error("[P314] Failed to load history:", error)
    }
  }, [])

  // Save current session
  const saveSession = (messages: Message[]) => {
    if (messages.length <= 1) return // Don't save sessions with only welcome message

    const session: ChatHistory = {
      sessionId: currentSessionId,
      messages: messages.filter((m) => m.id !== "thinking"), // Exclude thinking messages
      timestamp: new Date(),
    }

    try {
      const updated = [session, ...history].slice(0, MAX_HISTORY_ITEMS)
      setHistory(updated)
      localStorage.setItem("p314_chat_history", JSON.stringify(updated))
    } catch (error) {
      console.error("[P314] Failed to save history:", error)
    }
  }

  // Clear all history
  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem("p314_chat_history")
    } catch (error) {
      console.error("[P314] Failed to clear history:", error)
    }
  }

  // Load a previous session
  const loadSession = (sessionId: string): Message[] | null => {
    const session = history.find((h) => h.sessionId === sessionId)
    return session ? session.messages : null
  }

  return {
    history,
    currentSessionId,
    saveSession,
    clearHistory,
    loadSession,
  }
}
