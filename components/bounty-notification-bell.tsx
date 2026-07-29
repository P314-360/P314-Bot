"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COLORS } from "@/lib/app-config"

interface BountyNotification {
  id: string
  notificationType: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface BountyNotificationBellProps {
  userId: string
}

export function BountyNotificationBell({ userId }: BountyNotificationBellProps) {
  const [notifications, setNotifications] = useState<BountyNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/bounty/notifications?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("[P314] Failed to load notifications:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/bounty/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      })

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("[P314] Failed to mark notification as read:", error)
    }
  }

  return (
    <div className="relative">
      <Button onClick={() => setShowPanel(!showPanel)} variant="ghost" size="sm" className="relative">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            {unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto shadow-lg z-50">
          <CardHeader className="py-3" style={{ backgroundColor: COLORS.PRIMARY }}>
            <CardTitle className="text-white text-sm">Bug Bounty Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${!notif.isRead ? "bg-purple-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{notif.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{notif.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS.PRIMARY }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
