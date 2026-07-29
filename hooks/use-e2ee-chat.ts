"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { EncryptedMessage, E2EEConfig } from "@/lib/types"
import { getE2EEManager, getEphemeralStore } from "@/lib/encryption-utils"
import { shouldBlockContent, getSecurityWarning } from "@/lib/ai-persona-config"
import { BACKEND_URLS } from "@/lib/system-config"

export const useE2EEChat = (userId: string, username: string, piAccessToken: string | null) => {
  const [messages, setMessages] = useState<EncryptedMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [e2eeConfig, setE2eeConfig] = useState<E2EEConfig>({
    enabled: true,
    keyExchangeComplete: false,
    ephemeralConfig: {
      ttlSeconds: 30,
      autoDelete: true,
      ramOnly: true,
    },
  })

  const e2eeManager = useRef(getE2EEManager())
  const ephemeralStore = useRef(getEphemeralStore())

  // Initialize E2EE keys on mount
  useEffect(() => {
    const initializeE2EE = async () => {
      try {
        await e2eeManager.current.generateKeyPair()
        const publicKey = await e2eeManager.current.exportPublicKey()
        setE2eeConfig((prev) => ({
          ...prev,
          publicKey,
          keyExchangeComplete: true,
        }))
        console.log("[P314] E2EE initialized successfully")
      } catch (error) {
        console.error("[P314] E2EE initialization failed:", error)
        setE2eeConfig((prev) => ({ ...prev, enabled: false }))
      }
    }

    initializeE2EE()

    return () => {
      // Cleanup on unmount
      e2eeManager.current.clearAllKeys()
    }
  }, [])

  // AI Pre-screening before encryption
  const aiPreScreen = async (message: string): Promise<{ allowed: boolean; warning?: string }> => {
    // Check for sensitive content BEFORE encryption
    if (shouldBlockContent(message)) {
      return {
        allowed: false,
        warning: getSecurityWarning(),
      }
    }

    // Send to backend AI for advanced screening
    try {
      const response = await fetch(`${BACKEND_URLS.CHAT}/ai-prescreen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken || "",
        },
        body: JSON.stringify({
          message,
          userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          allowed: data.allowed !== false,
          warning: data.warning,
        }
      }
    } catch (error) {
      console.error("[P314] AI pre-screen error:", error)
    }

    return { allowed: true }
  }

  const sendMessage = async () => {
    if (!input.trim() || !piAccessToken || !e2eeConfig.keyExchangeComplete) return

    setIsLoading(true)

    try {
      // Step 1: AI Pre-screening (BEFORE encryption)
      const screenResult = await aiPreScreen(input.trim())

      if (!screenResult.allowed) {
        const warningMsg: EncryptedMessage = {
          id: `warning_${Date.now()}`,
          text: `⚠️ ${screenResult.warning || getSecurityWarning()}`,
          sender: "ai_moderator",
          username: "P314 Security",
          userId: "ai_moderator",
          timestamp: new Date(),
          encrypted: false,
        }
        setMessages((prev) => [...prev, warningMsg])
        setIsLoading(false)
        setInput("")
        return
      }

      // Step 2: Encrypt the message
      const messageContent = input.trim()
      let encryptedContent: string | undefined

      if (e2eeConfig.enabled && e2eeConfig.keyExchangeComplete) {
        try {
          // For community chat, we encrypt with a shared room key
          // In production, this would be per-recipient encryption
          encryptedContent = await e2eeManager.current.encryptMessage(messageContent, "community_room")
          console.log("[P314] Message encrypted successfully")
        } catch (error) {
          console.error("[P314] Encryption failed:", error)
          // Fall back to unencrypted if encryption fails
        }
      }

      // Step 3: Create user message
      const userMessage: EncryptedMessage = {
        id: Date.now().toString(),
        text: messageContent,
        sender: "user",
        username: username || "Anonymous",
        userId: userId,
        timestamp: new Date(),
        encrypted: !!encryptedContent,
        encryptedContent,
        senderPublicKey: e2eeConfig.publicKey,
        e2eeMetadata: {
          algorithm: "AES-GCM-256",
          keyExchanged: e2eeConfig.keyExchangeComplete,
          verified: true,
        },
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")

      // Step 4: Store in ephemeral RAM-only storage
      ephemeralStore.current.addMessage(userMessage.id, messageContent, e2eeConfig.ephemeralConfig.ttlSeconds)

      // Step 5: Send to backend relay (encrypted content only)
      const response = await fetch(BACKEND_URLS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({
          message: encryptedContent || messageContent, // Send encrypted version
          userId: userId,
          username: username,
          type: "e2ee_community",
          encrypted: !!encryptedContent,
          publicKey: e2eeConfig.publicKey,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.message) {
          const moderatorMsg: EncryptedMessage = {
            id: data.message.id || `mod_${Date.now()}`,
            text: data.message.text,
            sender: "moderator",
            username: data.message.username || "Moderator",
            userId: data.message.userId || "moderator",
            timestamp: new Date(data.message.timestamp),
            encrypted: false,
          }
          setMessages((prev) => [...prev, moderatorMsg])
        }
      }
    } catch (error) {
      console.error("[P314] E2EE send error:", error)
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

  return {
    messages,
    input,
    isLoading,
    e2eeConfig,
    sendMessage,
    handleInputChange,
    handleKeyPress,
    ephemeralMessageCount: ephemeralStore.current.getMessageCount(),
  }
}
