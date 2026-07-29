"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Shield, Lock, Users, Zap } from "lucide-react"
import { useE2EEChat } from "@/hooks/use-e2ee-chat"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { COLORS } from "@/lib/app-config"

interface E2EECommunityChatModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  piAccessToken: string | null
}

export function E2EECommunityChatModal({
  isOpen,
  onClose,
  userId,
  username,
  piAccessToken,
}: E2EECommunityChatModalProps) {
  const {
    messages,
    input,
    isLoading,
    e2eeConfig,
    sendMessage,
    handleInputChange,
    handleKeyPress,
    ephemeralMessageCount,
  } = useE2EEChat(userId, username, piAccessToken)
  const { bottomRef } = useScrollToBottom([messages])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 text-white rounded-t-lg" style={{ backgroundColor: COLORS.PRIMARY }}>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield size={24} />
            Secure Community Chat (E2EE)
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm mt-2">
            End-to-End Encrypted chat with AI moderation. Messages auto-delete after 30 seconds.
          </DialogDescription>

          {/* Security Status Bar */}
          <div className="flex items-center gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <Lock size={14} className={e2eeConfig.enabled ? "text-green-300" : "text-red-300"} />
              <span className={e2eeConfig.enabled ? "text-green-300" : "text-red-300"}>
                {e2eeConfig.enabled ? "E2EE Active" : "E2EE Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-yellow-300" />
              <span className="text-yellow-300">Ephemeral: {ephemeralMessageCount} msgs in RAM</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={14} className="text-blue-300" />
              <span className="text-blue-300">AI Protected</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <Lock size={20} className="text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">Your Privacy is Protected</p>
                <ul className="text-green-700 space-y-1 text-xs">
                  <li>✓ All messages encrypted end-to-end (AES-GCM-256)</li>
                  <li>✓ Auto-delete after 30 seconds (RAM only)</li>
                  <li>✓ AI pre-screening prevents fraud before encryption</li>
                  <li>✓ No permanent storage on servers</li>
                </ul>
              </div>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Shield size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Secure encrypted chat initialized</p>
              <p className="text-xs mt-1">P314 AI is monitoring for security threats</p>
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
                  {message.encrypted && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      <Lock size={10} className="mr-1" />
                      Encrypted
                    </Badge>
                  )}
                  {message.sender === "moderator" && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Moderator
                    </Badge>
                  )}
                  {message.sender === "ai_moderator" && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                      AI Security
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
              placeholder="Type your encrypted message..."
              disabled={isLoading || !e2eeConfig.keyExchangeComplete}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || !e2eeConfig.keyExchangeComplete}
              style={{ backgroundColor: COLORS.PRIMARY }}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
          {!e2eeConfig.keyExchangeComplete && (
            <p className="text-xs text-gray-500 mt-2">Initializing encryption keys...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
