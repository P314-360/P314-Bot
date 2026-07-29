"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { APP_CONFIG } from "@/lib/app-config"
import { shouldBlockContent, getSecurityWarning } from "@/lib/ai-persona-config"
import { useKnowledgeGap } from "./use-knowledge-gap"
import { useSourceConfidence } from "./use-source-confidence"

const createMessage = (text: Message["text"], sender: Message["sender"], id?: Message["id"]): Message => ({
  id: id || Date.now().toString(),
  text,
  sender,
  timestamp: new Date(),
})

export const useChatbot = (onInteraction?: () => void) => {
  const piAccessToken = "guest_token"

  const { analyzeQuestion } = useKnowledgeGap(piAccessToken)
  const { analyzeSourceConfidence } = useSourceConfidence(piAccessToken)

  const [messages, setMessages] = useState<Message[]>([createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1")])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const showThinking = () => {
    const thinkingMessage = createMessage("Thinking... (0)", "ai", "thinking")
    setMessages((prev) => [...prev, thinkingMessage])

    let seconds = 0
    thinkingTimerRef.current = setInterval(() => {
      seconds += 1
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === "thinking" ? { ...msg, text: `Thinking... (${seconds})` } : msg)),
      )
    }, 1000)
  }

  const hideThinking = () => {
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== "thinking"))
  }

  const sendMessage = async (audioData?: string, imageData?: string) => {
    if (!input.trim() && !audioData && !imageData) return

    if (shouldBlockContent(input.trim())) {
      const warningMessage = createMessage(getSecurityWarning(), "ai")
      setMessages((prev) => [...prev, warningMessage])
      setInput("")
      return
    }

    const userMessage = createMessage(input.trim() || "[Voice message]", "user")
    setMessages((prev) => [...prev, userMessage])

    const userQuestion = input.trim()

    setInput("")
    setIsLoading(true)

    showThinking()

    try {
      const apiUrl = "/api/chat"

      const payload: any = {
        message: userMessage.text,
        userId: piAccessToken || "guest",
      }
      if (audioData) payload.audio = audioData
      if (imageData) payload.image = imageData

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      hideThinking()

      if (response.status === 429) {
        const errorData = await response.json()
        const errorMessage = createMessage(
          errorData.error_type === "daily_limit_exceeded"
            ? errorData.error
            : "Too many requests. Please try again later.",
          "ai",
        )
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        const errorMessage = createMessage(`Error: ${response.status} - ${response.statusText}`, "ai")
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      const data = await response.json()

      if (data.messages && Array.isArray(data.messages)) {
        const aiMsg = data.messages.reverse().find((m: any) => m.sender === "ai")
        const botMessage = createMessage(aiMsg ? aiMsg.text : "No AI response received.", "ai")

        if (userQuestion && !audioData && !imageData) {
          if (data.community_awareness_score !== undefined) {
            botMessage.knowledgeGap = {
              questionCategory: data.question_category || "General",
              popularityScore: data.community_awareness_score,
              askedToday: data.asked_count || 0,
              trendingRank: data.trending_rank,
              relatedQuestions: data.related_questions || [],
              community_awareness_score: data.community_awareness_score,
              justification: data.awareness_justification,
            }
          } else {
            const knowledgeGap = await analyzeQuestion(userQuestion)
            if (knowledgeGap) {
              botMessage.knowledgeGap = knowledgeGap
            }
          }

          if (data.confidence_score !== undefined) {
            botMessage.sourceConfidence = {
              score: data.confidence_score,
              isVerified: data.is_verified || false,
              isRumor: data.is_rumor || false,
              officialStatement: data.official_statement,
              sources: data.sources || [],
              explanation: data.confidence_explanation || "",
              confidence_score_justification: data.confidence_score_justification,
            }
          } else {
            const sourceConfidence = await analyzeSourceConfidence(userQuestion)
            if (sourceConfidence) {
              botMessage.sourceConfidence = sourceConfidence
            }
          }
        }

        setMessages((prev) => [...prev, botMessage])

        if (onInteraction) {
          onInteraction()
        }

        if (data.specialAction && data.specialAction.action === "generate_link") {
          // Store flag to show referral panel in dashboard
          localStorage.setItem("p314_show_referral", "true")
        }
      } else {
        const errorMessage = createMessage("No response from backend.", "ai")
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Error:", error)
      hideThinking()
      const errorMessage = createMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "ai")
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    return () => {
      if (messages.length > 1) {
        const history = localStorage.getItem("p314_chat_history")
        const historyArray = history ? JSON.parse(history) : []
        const newSession = {
          sessionId: Date.now().toString(),
          messages: messages.filter((m) => m.id !== "thinking"),
          timestamp: new Date().toISOString(),
        }
        historyArray.unshift(newSession)
        localStorage.setItem("p314_chat_history", JSON.stringify(historyArray.slice(0, 50)))
      }
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current)
      }
    }
  }, [messages])

  return {
    messages,
    input,
    isLoading,
    sendMessage,
    handleKeyPress,
    handleInputChange,
    setMessages,
  }
}
