"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface BotRatingProps {
  messageId: string
  onSubmitRating: (rating: number, feedback?: string) => void
  primaryColor?: string
}

export function BotRating({ messageId, onSubmitRating, primaryColor = "#3e0f66" }: BotRatingProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmitRating(rating, feedback || undefined)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return <div className="text-sm text-gray-600 italic">Thank you for your feedback!</div>
  }

  return (
    <Card className="mt-2 border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Rate this response</CardTitle>
        <CardDescription className="text-xs">Help us improve P314</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={20}
                fill={(hoveredRating || rating) >= star ? primaryColor : "none"}
                stroke={(hoveredRating || rating) >= star ? primaryColor : "#d1d5db"}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <>
            <Textarea
              placeholder="Optional: Share your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
            <Button onClick={handleSubmit} size="sm" className="w-full" style={{ backgroundColor: primaryColor }}>
              Submit Rating
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
