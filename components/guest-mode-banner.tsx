"use client"

import { AlertTriangle, Clock, LogOut, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GuestSessionData } from "@/lib/guest-session"
import { formatGuestSessionExpiry } from "@/lib/guest-session"
import { COLORS } from "@/lib/app-config"

interface GuestModeBannerProps {
  session: GuestSessionData
  onExitGuest: () => void
}

export function GuestModeBanner({ session, onExitGuest }: GuestModeBannerProps) {
  const timeRemaining = formatGuestSessionExpiry(session)
  const remainingMessages = session.features.chatMessageLimit - session.features.messagesUsed

  return (
    <div
      className="w-full p-4 border-b border-amber-200 text-sm"
      style={{ backgroundColor: "#fffbeb" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLORS.PRIMARY }} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">
              You&apos;re browsing as a guest
            </p>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Session expires in {timeRemaining}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Limited features: {remainingMessages} chat messages remaining</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Sign in with your Pi Network account to access all features including posting to channels and creating new channels.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={onExitGuest}
          className="flex-shrink-0 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ backgroundColor: COLORS.PRIMARY }}
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </div>
    </div>
  )
}
