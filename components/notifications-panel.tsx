"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Clock, Trash2 } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"
import type { ChannelNotification } from "@/lib/types"

interface NotificationsPanelProps {
  notifications: ChannelNotification[]
  onClearAll: () => void
  onOpenChannel: (channelId: string) => void
}

export function NotificationsPanel({ notifications, onClearAll, onOpenChannel }: NotificationsPanelProps) {
  const { t } = useLanguage()

  const unreadNotifications = notifications.filter((n) => !n.read)

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell size={20} />
            {t.notifications}
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="bg-red-500 text-white">
                {unreadNotifications.length}
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 0 && (
            <Button size="sm" variant="ghost" onClick={onClearAll} className="text-white hover:bg-white/20">
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.noNotifications}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onOpenChannel(notification.channelId)}
                className={`border rounded-lg p-3 cursor-pointer hover:border-purple-300 transition-colors ${
                  !notification.read ? "bg-purple-50 border-purple-200" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare size={16} className="text-purple-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{notification.channelName}</span>
                      {!notification.read && (
                        <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                          {t.new}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {notification.senderUsername}: {notification.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
