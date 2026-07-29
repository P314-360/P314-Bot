"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Shield, Users, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"
import { useChannelReputation } from "@/hooks/use-channel-reputation"
import type { UserChannel, EncryptedMessage } from "@/lib/types"
import { shouldBlockContent, getSecurityWarning } from "@/lib/ai-persona-config"

interface ChannelChatModalProps {
  isOpen: boolean
  onClose: () => void
  channel: UserChannel
  userId: string
  username: string
  piAccessToken?: string | null
  onNewMessage?: (channelId: string, channelName: string, message: string, senderUsername: string) => void
  primaryColor?: string
}

export function ChannelChatModal({
  isOpen,
  onClose,
  channel,
  userId,
  username,
  piAccessToken,
  onNewMessage,
}: ChannelChatModalProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<EncryptedMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { bottomRef } = useScrollToBottom([messages])
  const { reputation, addAchievement } = useChannelReputation(channel.channelId, channel.ownerId, channel.ownerUsername)

  // Load last 30 seconds of messages from localStorage
  useEffect(() => {
    if (!isOpen) return

    const channelMessagesKey = `p314_channel_${channel.channelId}_messages`
    const storedMessages = localStorage.getItem(channelMessagesKey)

    if (storedMessages) {
      try {
        const parsed: EncryptedMessage[] = JSON.parse(storedMessages)
        const thirtySecondsAgo = Date.now() - 30000

        // Filter messages from last 30 seconds
        const recentMessages = parsed.filter((msg) => {
          const msgTime = new Date(msg.timestamp).getTime()
          return msgTime > thirtySecondsAgo
        })

        setMessages(recentMessages)

        // Clean up old messages
        setTimeout(() => {
          const updated = recentMessages.filter((msg) => {
            const msgTime = new Date(msg.timestamp).getTime()
            return msgTime > Date.now() - 30000
          })
          setMessages(updated)
          localStorage.setItem(channelMessagesKey, JSON.stringify(updated))
        }, 30000)
      } catch (error) {
        console.error("[P314] Failed to load channel messages:", error)
      }
    }
  }, [isOpen, channel.channelId])

  const sendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)

    try {
      // AI Pre-screening
      if (shouldBlockContent(input.trim())) {
        const warningMsg: EncryptedMessage = {
          id: `warning_${Date.now()}`,
          text: `⚠️ ${getSecurityWarning()}`,
          sender: "ai_moderator",
          username: "P314 Security",
          userId: "ai_moderator",
          timestamp: new Date(),
          encrypted: false,
        }
        setMessages((prev) => [...prev, warningMsg])
        setInput("")
        setIsLoading(false)
        return
      }

      // Create user message
      const userMessage: EncryptedMessage = {
        id: Date.now().toString(),
        text: input.trim(),
        sender: "user",
        username: username || "Pioneer",
        userId: userId,
        timestamp: new Date(),
        encrypted: false,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

      if (onNewMessage && userId !== channel.ownerId) {
        onNewMessage(channel.channelId, channel.channelName, input.trim(), username || "Pioneer")
      }

      if (updatedMessages.length % 10 === 0 && channel.ownerId !== userId) {
        await addAchievement(
          "milestone_helps",
          {
            description: `Reached ${updatedMessages.length} help interactions`,
            value: updatedMessages.length,
          },
          { helpCount: updatedMessages.length },
        )
      }

      // Store in localStorage (will auto-expire after 30 seconds)
      const channelMessagesKey = `p314_channel_${channel.channelId}_messages`
      localStorage.setItem(channelMessagesKey, JSON.stringify(updatedMessages))

      setInput("")

      // Auto-delete after 30 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))

        const current = localStorage.getItem(channelMessagesKey)
        if (current) {
          const parsed = JSON.parse(current)
          const filtered = parsed.filter((msg: EncryptedMessage) => msg.id !== userMessage.id)
          localStorage.setItem(channelMessagesKey, JSON.stringify(filtered))
        }
      }, 30000)
    } catch (error) {
      console.error("[P314] Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 text-white rounded-t-lg" style={{ backgroundColor: COLORS.PRIMARY }}>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users size={24} />
            {channel.channelName}
          </DialogTitle>
          <div className="text-white/90 text-sm mt-2">{channel.description}</div>

          {/* Channel Info Bar */}
          <div className="flex items-center gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-blue-300" />
              <span className="text-blue-300">
                {channel.subscribers} {t.subscribers}
              </span>
            </div>
            {channel.moderatedByAI && (
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-green-300" />
                <span className="text-green-300">AI Protected</span>
              </div>
            )}
            {channel.isVerified && (
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-yellow-300" />
                <span className="text-yellow-300">Verified</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Lock size={14} className="text-purple-300" />
              <span className="text-purple-300">Auto-delete: 30s</span>
            </div>
            {reputation && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-300">⭐ Rep: {reputation.reputationScore}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Channel Welcome */}
          {messages.length === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-3">
                <Users size={20} className="text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 mb-1">
                    {t.welcome} {channel.channelName}
                  </p>
                  <p className="text-purple-700 text-xs">
                    {t.by} {channel.ownerUsername} • {t.aiModerated}
                  </p>
                  <p className="text-purple-700 text-xs mt-2">Messages auto-delete after 30 seconds</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.flagged ? "opacity-50" : ""} ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                  message.sender === "user"
                    ? "bg-gray-600"
                    : message.sender === "ai_moderator"
                      ? "bg-red-600"
                      : "bg-purple-600"
                }`}
              >
                {message.sender === "user" ? (
                  message.username.charAt(0).toUpperCase()
                ) : message.sender === "ai_moderator" ? (
                  <Shield size={16} />
                ) : (
                  <Users size={16} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-700">{message.username}</span>
                  {message.sender === "ai_moderator" && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                      AI Security
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gray-600 text-white ml-auto"
                      : message.sender === "ai_moderator"
                        ? "bg-red-50 text-red-900 border border-red-200"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${t.typeMessage} ${channel.channelName}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ backgroundColor: COLORS.PRIMARY }}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {channel.moderatedByAI ? "Protected by P314 AI • " : ""}Messages auto-delete after 30 seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
