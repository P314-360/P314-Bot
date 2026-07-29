"use client"

import { useState, useEffect } from "react"

export interface HelpfulAnswer {
  id: string
  question: string
  answer: string
  rating: number
  helpfulCount: number
  category: string
}

export const useHelpfulAnswers = () => {
  const [helpfulAnswers, setHelpfulAnswers] = useState<HelpfulAnswer[]>([])

  const fetchHelpfulAnswers = () => {
    // Mock data - retrieve from localStorage ratings
    const ratingsData = localStorage.getItem("p314_ratings_analytics")
    if (ratingsData) {
      const ratings = JSON.parse(ratingsData)
      const topRated = ratings
        .filter((r: any) => r.rating >= 4)
        .slice(0, 3)
        .map((r: any, index: number) => ({
          id: r.messageId,
          question: r.question || "How to solve Pi account issue?",
          answer: r.answer || "Follow the official Pi Network guidelines...",
          rating: r.rating,
          helpfulCount: Math.floor(Math.random() * 50) + 10,
          category: "Solutions",
        }))

      if (topRated.length > 0) {
        setHelpfulAnswers(topRated)
      }
    }
  }

  useEffect(() => {
    fetchHelpfulAnswers()
  }, [])

  return {
    helpfulAnswers,
    refresh: fetchHelpfulAnswers,
  }
}
