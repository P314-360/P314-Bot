"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Shield, AlertTriangle, Users } from "lucide-react"
import { useCommunityChat } from "@/hooks/use-community-chat"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { COLORS } from "@/lib/app-config"

interface CommunityChatModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  piAccessToken: string | null
}

export function CommunityChatModal({ isOpen, onClose, userId, username, piAccessToken }: CommunityChatModalProps) {
  const { messages, input, isLoading, sendMessage, handleInputChange, handleKeyPress } = useCommunityChat(
    userId,
    username,
    piAccessToken,
  )
  const { bottomRef } = useScrollToBottom([messages])

  useEffect(() => {
    if (!isOpen) {
      // Optional: Clear messages when closing
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 text-white rounded-t-lg" style={{ backgroundColor: COLORS.PRIMARY }}>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users size={24} />
            Pi Network Community Chat
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm mt-2">
            Get help from verified moderators and community members. P314 AI Moderator is actively monitoring for
            security.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Shield size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Welcome to the community chat!</p>
              <p className="text-xs mt-1">Verified moderators and P314 AI are here to help.</p>
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
                      : "bg-green-600"
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
                  {message.sender === "moderator" && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Moderator
                    </Badge>
                  )}
                  {message.sender === "ai_moderator" && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                      AI Security
                    </Badge>
                  )}
                  {message.flagged && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle size={12} className="mr-1" />
                      Flagged
                    </Badge>
                  )}
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
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to the community..."
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
