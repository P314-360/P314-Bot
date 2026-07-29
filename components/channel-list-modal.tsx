"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tv, Users, Shield, Star } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"
import type { UserChannel } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChannelListSkeleton } from "@/components/message-skeleton"
import { EmptyState } from "@/components/empty-state"
import { useState } from "react"

import type { JoinedChannel } from "@/lib/types"

interface ChannelListModalProps {
  isOpen: boolean
  onClose: () => void
  channels: UserChannel[]
  onJoinChannel: (channelId: string) => void
  isLoading?: boolean
  // Optional props used by chatbot-main.tsx
  joinedChannels?: JoinedChannel[]
  showOnlyJoined?: boolean
  filterToMyChannels?: boolean
  onRefresh?: () => Promise<void>
  userId?: string
}

export function ChannelListModal({ isOpen, onClose, channels, onJoinChannel, isLoading = false }: ChannelListModalProps) {
  const { t } = useLanguage()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] p-0 sm:max-h-[90vh]">
        <DialogHeader style={{ backgroundColor: COLORS.PRIMARY }} className="text-white rounded-t-lg p-4 m-0 mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Tv size={20} className="sm:w-6 sm:h-6" />
            {t.allChannels}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px] px-4">
          {isLoading ? (
            <ChannelListSkeleton />
          ) : channels.length === 0 ? (
            <EmptyState
              icon={Tv}
              title={t.noChannelsYet || "No Channels Available"}
              description={t.noChannelsDescription || "Check back later for new channels"}
            />
          ) : (
            <div className="space-y-3">
              {channels.map((channel) => (
                <div
                  key={channel.channelId}
                  className="border rounded-lg p-3 sm:p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{channel.channelName}</h3>
                        {channel.isVerified && <Shield size={14} className="sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" title={t.verified} />}
                        {channel.moderatedByAI && (
                          <Shield size={14} className="sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" title={t.aiModerated} />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{channel.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {channel.subscribers} {t.subscribers}
                        </span>
                        <span className="truncate">
                          {t.by} {channel.ownerUsername}
                        </span>
                        <span className="flex-shrink-0">{formatDate(channel.createdAt)}</span>
                      </div>
                      {channel.helpStats.totalHelps > 0 && (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" />
                            <span>{channel.helpStats.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500">
                            {channel.helpStats.totalHelps} {t.helps}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onJoinChannel(channel.channelId)}
                      style={{ backgroundColor: COLORS.PRIMARY }}
                      className="text-white w-full sm:w-auto flex-shrink-0"
                    >
                      {t.join}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ChannelListModal
