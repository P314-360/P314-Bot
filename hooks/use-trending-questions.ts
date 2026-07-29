"use client"

import { useState, useEffect } from "react"

export interface TrendingQuestion {
  id: string
  question: string
  askedCount: number
  category: string
  timestamp: Date
}

export const useTrendingQuestions = (piAccessToken?: string) => {
  const [trendingQuestions, setTrendingQuestions] = useState<TrendingQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchTrendingQuestions = async () => {
    setIsLoading(true)

    // Mock data for now
    const mockQuestions: TrendingQuestion[] = [
      {
        id: "1",
        question: "How do I complete KYC verification?",
        askedCount: 245,
        category: "KYC",
        timestamp: new Date(),
      },
      { id: "2", question: "When is the mainnet launch?", askedCount: 189, category: "Mainnet", timestamp: new Date() },
      {
        id: "3",
        question: "How to change my Pi username?",
        askedCount: 167,
        category: "Account",
        timestamp: new Date(),
      },
      { id: "4", question: "What are Pi mining rates?", askedCount: 143, category: "Mining", timestamp: new Date() },
      {
        id: "5",
        question: "How to secure my Pi wallet?",
        askedCount: 128,
        category: "Security",
        timestamp: new Date(),
      },
      {
        id: "6",
        question: "Can I transfer Pi to another account?",
        askedCount: 112,
        category: "Transactions",
        timestamp: new Date(),
      },
      {
        id: "7",
        question: "How to join security circle?",
        askedCount: 98,
        category: "Security Circle",
        timestamp: new Date(),
      },
      { id: "8", question: "What is Pi Network testnet?", askedCount: 87, category: "Testnet", timestamp: new Date() },
    ]

    setTrendingQuestions(mockQuestions)
    setIsLoading(false)

    // Real API call when backend is ready
    /* 
    if (!piAccessToken) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/api/trending-questions`, {
        headers: {
          Authorization: piAccessToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTrendingQuestions(data.questions || [])
      }
    } catch (error) {
      console.error("[P314] Failed to fetch trending questions:", error)
    } finally {
      setIsLoading(false)
    }
    */
  }

  useEffect(() => {
    fetchTrendingQuestions()
    // Refresh every 5 minutes
    const interval = setInterval(fetchTrendingQuestions, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [piAccessToken])

  return {
    trendingQuestions,
    isLoading,
    refresh: fetchTrendingQuestions,
  }
}
