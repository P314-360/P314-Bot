"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Trash2, MessageSquare } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import type { ChatHistory } from "@/lib/types"

interface ChatHistoryPanelProps {
  history: ChatHistory[]
  onLoadSession: (sessionId: string) => void
  onClearHistory: () => void
  language: "en" | "ar"
}

export function ChatHistoryPanel({ history, onLoadSession, onClearHistory, language }: ChatHistoryPanelProps) {
  const isRTL = language === "ar"

  const texts = {
    en: {
      title: "Chat History",
      empty: "No chat history yet",
      messages: "messages",
      clear: "Clear All",
      load: "Load",
    },
    ar: {
      title: "سجل المحادثات",
      empty: "لا يوجد سجل محادثات",
      messages: "رسالة",
      clear: "مسح الكل",
      load: "تحميل",
    },
  }

  const t = texts[language]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center justify-between" dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex items-center gap-2">
            <History size={20} />
            {t.title}
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-white hover:bg-white/20">
              <Trash2 size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4" dir={isRTL ? "rtl" : "ltr"}>
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">{t.empty}</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((session) => (
              <div key={session.sessionId} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={14} style={{ color: COLORS.PRIMARY }} />
                      <span className="text-xs text-gray-500">{formatDate(session.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-700 truncate">{session.messages[1]?.text || t.empty}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {session.messages.length} {t.messages}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onLoadSession(session.sessionId)}
                    style={{ backgroundColor: COLORS.PRIMARY }}
                    className="text-white hover:opacity-90 shrink-0"
                  >
                    {t.load}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
