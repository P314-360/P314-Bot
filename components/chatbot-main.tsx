"use client"

import { Button } from "@/components/ui/button"
import type React from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Send,
  User,
  Bot,
  Users,
  AlertTriangle,
  Search,
  Plus,
  X,
  Share2,
  Tv,
  Shield,
  Lock,
  Bell,
  Trophy,
  LogOut,
  Bug,
} from "lucide-react"
import { useChatbot } from "@/hooks/use-chatbot"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BotRating } from "@/components/bot-rating"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Message, UserChannel } from "@/lib/types"
import { CommunityChatModal } from "@/components/community-chat-modal"
import { E2EECommunityChatModal } from "@/components/e2ee-community-chat-modal"
import { FraudReportModal } from "@/components/fraud-report-modal"
import { WalletSearchModal } from "@/components/wallet-search-modal"
import { useQuestSystem } from "@/hooks/use-quest-system"
import { QuestNotification } from "@/components/quest-notification"
import { KnowledgeGapIndicator } from "@/components/knowledge-gap-indicator"
import { SourceConfidenceIndicator } from "@/components/source-confidence-indicator"
import { ModeratorServersModal } from "@/components/moderator-servers-modal"
import { CreateChannelModal } from "@/components/create-channel-modal"
import { useUserChannel } from "@/hooks/use-user-channel"
import { useShare } from "@/hooks/use-share"
import { useJoinedChannels } from "@/hooks/use-joined-channels"
import { TrendingQuestionsTicker } from "@/components/trending-questions-ticker"
import { HelpfulAnswersSuggestion } from "@/components/helpful-answers-suggestion"
import { ChannelChatModal } from "@/components/channel-chat-modal"
import { ChannelListModal } from "@/components/channel-list-modal"
import { usePiSession } from "@/hooks/use-pi-session"
import { BugBountyModal } from "@/components/bug-bounty-modal"

interface SessionData {
  piAccessToken: string
  username: string
  userId: string
  createdAt: number
}

interface ChatBotMainProps {
  sessionData: SessionData | null
}

export default function ChatBotMain({ sessionData }: ChatBotMainProps) {
  const router = useRouter()
  const { logout } = usePiSession()

  const userId = sessionData?.userId || "guest"
  const username = sessionData?.username || "Pioneer"
  const piAccessToken = sessionData?.piAccessToken || null

  const { bottomRef } = useScrollToBottom([])
  const { language, changeLanguage, t, isRTL } = useLanguage()
  const [showRatingForMessage, setShowRatingForMessage] = useState<string | null>(null)

  const [showCommunityChat, setShowCommunityChat] = useState(false)
  const [showE2EEChat, setShowE2EEChat] = useState(false)
  const [showFraudReport, setShowFraudReport] = useState(false)
  const [showWalletSearch, setShowWalletSearch] = useState(false)
  const [prefilledWallet, setPrefilledWallet] = useState<string | undefined>(undefined)

  const [showActionMenu, setShowActionMenu] = useState(false)

  const [showModerators, setShowModerators] = useState(false)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showChannelList, setShowChannelList] = useState(false)
  const [showMyChannels, setShowMyChannels] = useState(false)

  const [activeChannel, setActiveChannel] = useState<UserChannel | null>(null)
  const [showChannelChat, setShowChannelChat] = useState(false)

  const [showBugBounty, setShowBugBounty] = useState(false)

  const { messages, input, isLoading, sendMessage, handleKeyPress, handleInputChange, setMessages } = useChatbot(() =>
    incrementQuest("ai_sharpening"),
  )

  const { gameProgress, incrementQuest, mintNFT, canMintNFT, showQuestNotification, clearNotification } =
    useQuestSystem(userId)

  const { channel, hasChannel, createChannel, allChannels, refreshAllChannels } = useUserChannel(userId, piAccessToken)
  const { shareBot, isSharing, canShare } = useShare()

  const { joinedChannels, addNotification, joinChannel, markChannelAsRead, unreadCount } = useJoinedChannels(userId)

  const handleSendMessage = async () => {
    await sendMessage()
  }

  const handleKeyPressWithSession = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageAnalysis = async (imageData: string, question: string) => {
    handleInputChange({ target: { value: question } } as any)
    await sendMessage(undefined, imageData)
  }

  const handleShare = async () => {
    const shareData = {
      title: "P314 - Pi Network Smart Support Bot",
      text: "Try P314, the intelligent support assistant for Pi Network! Get help with KYC, accounts, and blockchain verification.",
      url: window.location.origin,
    }
    await shareBot(shareData)
  }

  const handleChannelCreated = async (name: string, description: string, creatorUsername: string) => {
    const success = await createChannel(name, description, creatorUsername)
    if (success) {
      await refreshAllChannels()
    }
    return success
  }

  const handleJoinChannel = (channelId: string) => {
    const channel = allChannels.find((ch) => ch.channelId === channelId)
    if (channel) {
      joinChannel(channelId, channel.channelName, channel.ownerUsername)

      const updatedChannels = allChannels.map((ch) =>
        ch.channelId === channelId ? { ...ch, subscribers: ch.subscribers + 1 } : ch,
      )
      localStorage.setItem("p314_all_channels", JSON.stringify(updatedChannels))

      setActiveChannel(channel)
      setShowChannelChat(true)
      setShowChannelList(false)

      markChannelAsRead(channelId)
    }
  }

  const handleChannelMessage = (channelId: string, channelName: string, message: string, senderUsername: string) => {
    const isJoined = joinedChannels.some((ch) => ch.channelId === channelId)
    if (isJoined && senderUsername !== username) {
      addNotification(channelId, channelName, message, senderUsername)
    }
  }

  const handleRatingSubmit = (messageId: string, rating: number, feedback?: string) => {
    setShowRatingForMessage(null)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    const pendingChannelId = localStorage.getItem("p314_open_channel")
    if (pendingChannelId) {
      localStorage.removeItem("p314_open_channel")
      const channel = allChannels.find((ch) => ch.channelId === pendingChannelId)
      if (channel) {
        setActiveChannel(channel)
        setShowChannelChat(true)
      }
    }
  }, [allChannels])

  useEffect(() => {
    const loadedSession = localStorage.getItem("p314_load_session")
    if (loadedSession) {
      try {
        const parsedMessages = JSON.parse(loadedSession) as Message[]
        setMessages(parsedMessages)
        localStorage.removeItem("p314_load_session")
      } catch (error) {
        console.error("[P314] Failed to load session:", error)
      }
    }
  }, [setMessages])

  return (
    <div
      className="flex items-center justify-center min-h-screen p-2 sm:p-4"
      style={{ backgroundColor: COLORS.BACKGROUND }}
    >
      <QuestNotification message={showQuestNotification} onClose={clearNotification} />

      <Card className="w-full max-w-4xl mx-auto border-0 shadow-xl flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-120px)] max-h-screen">
        <CardHeader className="text-white rounded-t-lg p-3 sm:p-6" style={{ backgroundColor: COLORS.PRIMARY }}>
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-2">
            {/* Left Section: Share, Notifications & Quest */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {canShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 transition-colors"
                  title={t.shareBot}
                  aria-label={t.shareBot}
                >
                  <Share2 size={16} className="sm:w-5 sm:h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard?tab=notifications")}
                className="text-white hover:bg-white/20 relative h-8 w-8 sm:h-10 sm:w-10 transition-colors"
                title={t.notifications || "Notifications"}
                aria-label={t.notifications || "Notifications"}
              >
                <Bell size={16} className="sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg z-20">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/quests")}
                className="text-white hover:bg-white/20 relative h-8 w-8 sm:h-10 sm:w-10 transition-colors"
                title={t.quests || "Quests"}
                aria-label={t.quests || "Quests"}
              >
                <Trophy size={16} className="sm:w-5 sm:h-5" />
                {canMintNFT && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg z-20" />
                )}
              </Button>
            </div>

            {/* Center Section: Title (Hidden on mobile, shown below) */}
            <div className="hidden sm:flex flex-col items-center text-center flex-1 min-w-0 px-2">
              <div className="text-lg sm:text-xl font-semibold tracking-tight">{APP_CONFIG.NAME}</div>
              {APP_CONFIG.DESCRIPTION && (
                <div className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-1">{t.appDescription}</div>
              )}
            </div>

            {/* Right Section: Profile, Language, Logout */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <button
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/20 text-white text-xs sm:text-sm font-bold cursor-pointer hover:bg-white/30 active:bg-white/40 transition-all duration-200 ring-2 ring-white/10 hover:ring-white/30"
                title={username}
                onClick={() => router.push("/dashboard")}
                aria-label={`Profile: ${username}`}
              >
                {username.substring(0, 2).toUpperCase()}
              </button>
              <LanguageSwitcher language={language} onChange={changeLanguage} primaryColor="white" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={`text-white hover:bg-red-500/20 hover:text-red-200 active:bg-red-500/30 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm gap-1.5 transition-all duration-200 rounded-md ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                title={t.logout || "Logout"}
                aria-label={t.logout || "Logout"}
              >
                <LogOut size={14} className="sm:w-[15px] sm:h-[15px]" />
                <span className="hidden sm:inline font-medium">{t.logout || "Logout"}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Title Section */}
          <div className="sm:hidden text-center mt-3 pt-2 border-t border-white/20">
            <div className="text-base font-semibold tracking-tight">{APP_CONFIG.NAME}</div>
            {APP_CONFIG.DESCRIPTION && <div className="text-xs opacity-90 mt-1">{t.appDescription}</div>}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
          {messages.length > 1 && (
            <HelpfulAnswersSuggestion
              onAnswerClick={(question) => handleInputChange({ target: { value: question } } as any)}
              primaryColor={COLORS.PRIMARY}
            />
          )}
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                    message.sender === "user" ? "bg-gray-600" : ""
                  }`}
                  style={
                    message.sender === "user" ? { backgroundColor: "#4b5563" } : { backgroundColor: COLORS.PRIMARY }
                  }
                >
                  {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="flex-1">
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "text-white ml-auto"
                        : message.id === "thinking"
                          ? "bg-gray-100 text-gray-600 italic"
                          : "bg-gray-100 text-gray-800"
                    }`}
                    style={message.sender === "user" ? { backgroundColor: COLORS.PRIMARY } : {}}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                  </div>
                  {message.sender === "ai" &&
                    message.knowledgeGap &&
                    message.id !== "thinking" &&
                    message.id !== "1" && <KnowledgeGapIndicator data={message.knowledgeGap} />}
                  {message.sender === "ai" &&
                    message.sourceConfidence &&
                    message.id !== "thinking" &&
                    message.id !== "1" && <SourceConfidenceIndicator data={message.sourceConfidence} />}
                  {message.sender === "ai" && message.id !== "thinking" && message.id !== "1" && (
                    <div className="mt-2 ml-2">
                      {showRatingForMessage === message.id ? (
                        <BotRating
                          messageId={message.id}
                          onSubmitRating={(rating, feedback) => handleRatingSubmit(message.id, rating, feedback)}
                          primaryColor={COLORS.PRIMARY}
                        />
                      ) : (
                        <button
                          onClick={() => setShowRatingForMessage(message.id)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          {t.rateResponse}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>

        <TrendingQuestionsTicker
          onQuestionClick={(question) => handleInputChange({ target: { value: question } } as any)}
          primaryColor={COLORS.PRIMARY}
        />

        <CardFooter className="p-2 sm:p-4 border-t">
          <div className="flex w-full gap-1.5 sm:gap-2 relative">
            <div className="relative">
              <Button
                onClick={() => setShowActionMenu(!showActionMenu)}
                variant="outline"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                style={{ borderColor: COLORS.PRIMARY, color: COLORS.PRIMARY }}
              >
                {showActionMenu ? (
                  <X size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                )}
              </Button>

              {showActionMenu && (
                <div
                  className={`absolute bottom-12 ${isRTL ? "right-0" : "left-0"} bg-white border rounded-lg shadow-lg p-1.5 sm:p-2 min-w-[180px] sm:min-w-[200px] z-10`}
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <Button
                    onClick={() => {
                      setShowCreateChannel(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Tv size={14} className="sm:w-4 sm:h-4" />
                    {t.createChannel}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMyChannels(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Tv size={14} className="sm:w-4 sm:h-4" />
                    {t.myChannels || "My Channels"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowChannelList(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Tv size={14} className="sm:w-4 sm:h-4" />
                    {t.allChannels || "All Channels"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowE2EEChat(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Lock size={14} className="sm:w-4 sm:h-4" />
                    {t.secureChat}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCommunityChat(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Users size={14} className="sm:w-4 sm:h-4" />
                    {t.communityChat}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowModerators(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Shield size={14} className="sm:w-4 sm:h-4" />
                    {t.moderators}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFraudReport(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <AlertTriangle size={14} className="sm:w-4 sm:h-4" />
                    {t.reportFraud}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowBugBounty(true)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Bug size={14} className="sm:w-4 sm:h-4" />
                    {t.bugBounty || "Bug Bounty 🏆"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowWalletSearch(true)
                      setPrefilledWallet(undefined)
                      setShowActionMenu(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-xs sm:text-sm"
                  >
                    <Search size={14} className="sm:w-4 sm:h-4" />
                    {t.verifyWallet}
                  </Button>
                </div>
              )}
            </div>

            <Input
              type="text"
              placeholder={t.askQuestion}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPressWithSession}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 text-white"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Send size={16} className="sm:w-5 sm:h-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommunityChatModal
        isOpen={showCommunityChat}
        onClose={() => setShowCommunityChat(false)}
        userId={userId}
        username={username}
        piAccessToken={piAccessToken}
        primaryColor={COLORS.PRIMARY}
      />
      <E2EECommunityChatModal
        isOpen={showE2EEChat}
        onClose={() => setShowE2EEChat(false)}
        userId={userId}
        username={username}
        primaryColor={COLORS.PRIMARY}
      />
      <FraudReportModal
        isOpen={showFraudReport}
        onClose={() => setShowFraudReport(false)}
        userId={userId}
        username={username}
        piAccessToken={piAccessToken}
        primaryColor={COLORS.PRIMARY}
      />
      <WalletSearchModal
        isOpen={showWalletSearch}
        onClose={() => setShowWalletSearch(false)}
        userId={userId}
        username={username}
        piAccessToken={piAccessToken}
        prefilledWallet={prefilledWallet}
        primaryColor={COLORS.PRIMARY}
      />
      <ModeratorServersModal
        isOpen={showModerators}
        onClose={() => setShowModerators(false)}
        primaryColor={COLORS.PRIMARY}
      />
      <CreateChannelModal
        isOpen={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        userId={userId}
        username={username}
        onChannelCreated={handleChannelCreated}
        primaryColor={COLORS.PRIMARY}
      />
      <ChannelListModal
        isOpen={showChannelList || showMyChannels}
        onClose={() => {
          setShowChannelList(false)
          setShowMyChannels(false)
        }}
        channels={allChannels}
        onJoinChannel={handleJoinChannel}
        filterToMyChannels={showMyChannels}
        userId={userId}
        primaryColor={COLORS.PRIMARY}
      />
      {activeChannel && (
        <ChannelChatModal
          isOpen={showChannelChat}
          onClose={() => setShowChannelChat(false)}
          channel={activeChannel}
          userId={userId}
          username={username}
          onNewMessage={handleChannelMessage}
          primaryColor={COLORS.PRIMARY}
        />
      )}
      <BugBountyModal
        isOpen={showBugBounty}
        onClose={() => setShowBugBounty(false)}
        userId={userId}
        username={username}
      />
    </div>
  )
}
