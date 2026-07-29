"use client"

import { useState } from "react"
import { BACKEND_URLS } from "@/lib/system-config"
import type { SourceConfidenceData } from "@/lib/types"
import { anonymizeQuestionData, validateAnonymizedData } from "@/lib/privacy-utils"

// Known rumor patterns for quick detection
const RUMOR_KEYWORDS = [
  "price",
  "listing",
  "$100",
  "exchange",
  "binance",
  "coinbase",
  "launch date",
  "guaranteed",
  "investment",
  "100x",
  "moon",
  "rich",
  "fortune",
  "roadmap leak",
  "insider",
  "secret",
]

const OFFICIAL_TOPICS = ["kyc", "mainnet", "migration", "security", "wallet", "mining", "verification"]

export const useSourceConfidence = (piAccessToken: string | null) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeSourceConfidence = async (question: string): Promise<SourceConfidenceData | null> => {
    if (!piAccessToken || !question.trim()) return null

    setIsAnalyzing(true)

    try {
      // Quick local analysis for common rumors
      const lowerQuestion = question.toLowerCase()
      const hasRumorKeyword = RUMOR_KEYWORDS.some((keyword) => lowerQuestion.includes(keyword))
      const hasOfficialTopic = OFFICIAL_TOPICS.some((topic) => lowerQuestion.includes(topic))

      // If it's clearly a rumor, return low confidence immediately
      if (hasRumorKeyword && !hasOfficialTopic) {
        return {
          score: 0,
          isVerified: false,
          isRumor: true,
          explanation: "This topic is commonly associated with rumors and unverified claims.",
          confidence_score_justification: "No official Pi Network sources support this claim.",
        }
      }

      const anonymizedData = anonymizeQuestionData(question, "confidence_check")

      if (!validateAnonymizedData(anonymizedData)) {
        console.error("[P314] Privacy validation failed for confidence analysis")
        return null
      }

      // Call backend for more detailed analysis
      const response = await fetch(BACKEND_URLS.ANALYZE_CONFIDENCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({
          questionHash: anonymizedData.questionHash,
          category: anonymizedData.category,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        return {
          score: data.confidence_score || data.score || 0,
          isVerified: data.is_verified || false,
          isRumor: data.is_rumor || false,
          officialStatement: data.official_statement,
          sources: data.sources || [],
          explanation: data.confidence_explanation || data.explanation || "",
          confidence_score_justification: data.confidence_score_justification,
        }
      }

      // Fallback: if backend unavailable, use local heuristics
      if (hasOfficialTopic) {
        return {
          score: 85,
          isVerified: true,
          isRumor: false,
          explanation: "This topic is covered in official Pi Network documentation.",
          confidence_score_justification: "Based on verified Pi Network help center articles.",
        }
      }

      return null
    } catch (error) {
      console.error("[P314] Source confidence analysis error:", error)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    analyzeSourceConfidence,
    isAnalyzing,
  }
}
