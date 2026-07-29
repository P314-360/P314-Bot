"use client"

import { useState } from "react"
import type { KnowledgeGapData } from "@/lib/types"
import { BACKEND_CONFIG } from "@/lib/system-config"
import { KNOWLEDGE_GAP_CONFIG, generateMockKnowledgeGap } from "@/lib/knowledge-gap-config"
import { anonymizeQuestionData, validateAnonymizedData } from "@/lib/privacy-utils"

export const useKnowledgeGap = (piAccessToken?: string) => {
  const [knowledgeGapCache, setKnowledgeGapCache] = useState<Map<string, KnowledgeGapData>>(new Map())

  const analyzeQuestion = async (question: string): Promise<KnowledgeGapData | null> => {
    if (!question.trim()) return null

    // Check cache first
    const cached = knowledgeGapCache.get(question)
    if (cached) return cached

    if (KNOWLEDGE_GAP_CONFIG.MOCK_MODE) {
      const mockData = generateMockKnowledgeGap(question)
      setKnowledgeGapCache((prev) => {
        const newCache = new Map(prev)
        newCache.set(question, mockData)
        return newCache
      })
      return mockData
    }

    // Real API call when backend is ready
    if (!piAccessToken) return null

    try {
      const anonymizedData = anonymizeQuestionData(question, "general")

      if (!validateAnonymizedData(anonymizedData)) {
        console.error("[P314] Privacy validation failed for knowledge gap analysis")
        return null
      }

      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${KNOWLEDGE_GAP_CONFIG.ENDPOINT}`, {
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

        const knowledgeGapData: KnowledgeGapData = {
          questionCategory: data.question_category || "General",
          popularityScore: data.community_awareness_score || 0,
          askedToday: data.asked_count || 0,
          trendingRank: data.trending_rank,
          relatedQuestions: data.related_questions || [],
          community_awareness_score: data.community_awareness_score,
          justification: data.awareness_justification,
        }

        // Cache the result
        setKnowledgeGapCache((prev) => {
          const newCache = new Map(prev)
          newCache.set(question, knowledgeGapData)
          return newCache
        })

        return knowledgeGapData
      }
    } catch (error) {
      console.error("[P314] Knowledge gap analysis failed:", error)
    }

    return null
  }

  const getPopularityColor = (score: number): string => {
    if (score >= 70) return "#ef4444" // red-500
    if (score >= 40) return "#f59e0b" // amber-500
    return "#10b981" // green-500
  }

  const getAwarenessLevel = (score: number): "high" | "medium" | "low" => {
    if (score >= 70) return "low"
    if (score >= 40) return "medium"
    return "high"
  }

  return {
    analyzeQuestion,
    getPopularityColor,
    getAwarenessLevel,
  }
}
