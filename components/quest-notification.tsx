"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface QuestNotificationProps {
  message: string | null
  onClose: () => void
}

export function QuestNotification({ message, onClose }: QuestNotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div
        className="bg-white rounded-lg shadow-xl border-2 p-4 flex items-start gap-3 max-w-sm"
        style={{ borderColor: COLORS.PRIMARY }}
      >
        <CheckCircle size={24} style={{ color: COLORS.PRIMARY }} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
