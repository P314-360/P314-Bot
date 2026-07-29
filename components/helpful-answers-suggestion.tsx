"use client"

import { useHelpfulAnswers } from "@/hooks/use-helpful-answers"
import { useLanguage } from "@/hooks/use-language"
import { Star, ThumbsUp } from "lucide-react"
import { Card } from "./ui/card"

interface HelpfulAnswersSuggestionProps {
  onAnswerClick?: (question: string) => void
  primaryColor: string
}

export const HelpfulAnswersSuggestion = ({ onAnswerClick, primaryColor }: HelpfulAnswersSuggestionProps) => {
  const { helpfulAnswers } = useHelpfulAnswers()
  const { t, isRTL } = useLanguage()

  if (helpfulAnswers.length === 0) return null

  return (
    <div className="mb-3 px-2">
      <div className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: primaryColor }}>
        <ThumbsUp size={14} />
        <span>{t.helpfulSolutions || "Solutions that helped others"}:</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {helpfulAnswers.map((answer) => (
          <Card
            key={answer.id}
            className="min-w-[280px] p-3 cursor-pointer hover:shadow-md transition-shadow bg-white border-gray-200"
            onClick={() => onAnswerClick?.(answer.question)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{answer.question}</p>
              <div className="flex items-center gap-1 text-yellow-500 whitespace-nowrap">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-semibold">{answer.rating}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{answer.answer}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ThumbsUp size={10} />
                <span>
                  {answer.helpfulCount} {t.foundHelpful || "found helpful"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
