"use client"

import type React from "react"
import type { KnowledgeGapData } from "@/lib/types"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp, Users, AlertCircle } from "lucide-react"

interface KnowledgeGapIndicatorProps {
  data: KnowledgeGapData
}

export const KnowledgeGapIndicator: React.FC<KnowledgeGapIndicatorProps> = ({ data }) => {
  const { t, isRTL } = useLanguage()

  const awarenessScore = data.community_awareness_score ?? data.popularityScore

  const getBarColor = (score: number): string => {
    if (score >= 70) return "bg-red-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-green-500"
  }

  const getTextColor = (score: number): string => {
    if (score >= 70) return "text-red-600"
    if (score >= 40) return "text-amber-600"
    return "text-green-600"
  }

  const getAwarenessText = (score: number): string => {
    if (score >= 70) return t.lowAwareness || "Low Community Awareness"
    if (score >= 40) return t.mediumAwareness || "Medium Community Awareness"
    return t.highAwareness || "High Community Awareness"
  }

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <Users size={16} className="text-purple-600" />
        <span className="text-xs font-semibold text-purple-900">{t.communityInsight || "Community Insight"}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-700">
            {t.knowledgeGapInfo || "Did you know?"} <span className="font-bold text-purple-700">{awarenessScore}%</span>{" "}
            {t.ofPioneersAsked || "of Pioneers asked this today"}
          </span>
          {data.trendingRank && data.trendingRank <= 5 && (
            <div className="flex items-center gap-1 text-orange-600">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold">#{data.trendingRank}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getBarColor(awarenessScore)}`}
            style={{ width: `${awarenessScore}%` }}
          />
        </div>

        {/* Awareness level */}
        <div className={`flex items-center gap-1.5 ${getTextColor(awarenessScore)}`}>
          <AlertCircle size={14} />
          <span className="text-xs font-medium">{getAwarenessText(awarenessScore)}</span>
        </div>

        {data.justification && (
          <div className="pt-2 text-xs text-gray-700 italic border-t border-purple-200">{data.justification}</div>
        )}

        {/* Topic category */}
        {data.questionCategory && (
          <div className="pt-1 border-t border-purple-200">
            <span className="text-[10px] text-gray-600">
              {t.topicCategory || "Topic"}:{" "}
              <span className="font-semibold text-purple-700">{data.questionCategory}</span>
            </span>
          </div>
        )}

        {/* Asked count */}
        {data.askedToday > 0 && (
          <div className="text-[10px] text-gray-500 italic">
            {t.askedTimesToday?.replace("{count}", data.askedToday.toString()) ||
              `Asked ${data.askedToday} times in the last 24 hours`}
          </div>
        )}
      </div>
    </div>
  )
}
