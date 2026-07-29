"use client"

import { useTrendingQuestions } from "@/hooks/use-trending-questions"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp } from "lucide-react"

interface TrendingQuestionsTickerProps {
  onQuestionClick?: (question: string) => void
  primaryColor: string
}

export const TrendingQuestionsTicker = ({ onQuestionClick, primaryColor }: TrendingQuestionsTickerProps) => {
  const { trendingQuestions } = useTrendingQuestions()
  const { t, isRTL } = useLanguage()

  if (trendingQuestions.length === 0) return null

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-t border-b border-gray-200 py-2 overflow-hidden">
      <div className="flex items-center gap-2 px-3">
        <div
          className="flex items-center gap-1 text-sm font-semibold whitespace-nowrap"
          style={{ color: primaryColor }}
        >
          <TrendingUp size={16} />
          <span>{t.trendingNow || "Trending Now"}:</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-6 animate-scroll"
            style={{
              animation: isRTL ? "scroll-rtl 40s linear infinite" : "scroll-ltr 40s linear infinite",
            }}
          >
            {[...trendingQuestions, ...trendingQuestions].map((q, idx) => (
              <button
                key={`${q.id}-${idx}`}
                onClick={() => onQuestionClick?.(q.question)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap transition-colors"
              >
                <span className="font-medium text-xs px-2 py-0.5 rounded-full bg-gray-200">{q.askedCount}</span>
                <span>{q.question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-ltr {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
