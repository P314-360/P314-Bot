"use client"

import { useState } from "react"
import type { ShareData } from "@/lib/types"

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false)

  const shareBot = async (shareData: ShareData) => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return true
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        alert("Link copied to clipboard!")
        return true
      }
    } catch (error) {
      console.error("[P314] Share failed:", error)
      return false
    } finally {
      setIsSharing(false)
    }
  }

  return {
    shareBot,
    isSharing,
    canShare: typeof navigator !== "undefined" && (!!navigator.share || !!navigator.clipboard),
  }
}
