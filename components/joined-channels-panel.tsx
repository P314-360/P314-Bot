"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tv, Users, Calendar, Bell, X } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"
import type { JoinedChannel } from "@/lib/types"

interface JoinedChannelsPanelProps {
  channels: JoinedChannel[]
  onOpenChannel: (channelId: string) => void
  onLeaveChannel: (channelId: string) => void
}

export function JoinedChannelsPanel({ channels, onOpenChannel, onLeaveChannel }: JoinedChannelsPanelProps) {
  const { t } = useLanguage()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Tv size={20} />
          {t.myChannels}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {channels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Tv size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.noJoinedChannels}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {channels.map((channel) => (
              <div key={channel.channelId} className="border rounded-lg p-3 hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{channel.channelName}</h4>
                      {channel.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {channel.ownerUsername}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(channel.joinedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => onOpenChannel(channel.channelId)}
                      style={{ backgroundColor: COLORS.PRIMARY }}
                      className="text-white text-xs h-7"
                    >
                      {t.open}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onLeaveChannel(channel.channelId)}
                      className="text-red-600 hover:bg-red-50 text-xs h-7"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
                {channel.lastMessageAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Bell size={10} />
                    <span>
                      {t.lastActivity}: {formatDate(channel.lastMessageAt)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
