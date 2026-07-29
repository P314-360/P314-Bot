"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  UserIcon,
  SettingsIcon,
  HistoryIcon,
  Tv,
  Bell,
  BookOpen,
  MapPin,
  Gem,
  ShieldAlert,
  Share2,
} from "lucide-react"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import { useSettings } from "@/hooks/use-settings"
import { useChatHistory } from "@/hooks/use-chat-history"
import { UserProfile } from "@/components/user-profile"
import { SettingsPanel } from "@/components/settings-panel"
import { ChatHistoryPanel } from "@/components/chat-history-panel"
import { JoinedChannelsPanel } from "@/components/joined-channels-panel"
import { NotificationsPanel } from "@/components/notifications-panel"
import { BotGuidePanel } from "@/components/bot-guide-panel"
import { RoadmapPanel } from "@/components/roadmap-panel"
import { NFTInfoPanel } from "@/components/nft-info-panel"
import { FraudWalletsPanel } from "@/components/fraud-wallets-panel"
import { useJoinedChannels } from "@/hooks/use-joined-channels"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PiUser } from "@/lib/types"
import { usePiSession } from "@/hooks/use-pi-session"
import { LoginPage } from "@/components/login-page"
import { useLanguage } from "@/hooks/use-language"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ReferralPanel } from "@/components/referral-panel"
import { isAdmin } from "@/lib/admin-auth"

type TabType =
  | "profile"
  | "history"
  | "settings"
  | "channels"
  | "notifications"
  | "guide"
  | "roadmap"
  | "nft"
  | "fraud-wallets"
  | "admin"
  | "referral"

export default function DashboardPage() {
  const router = useRouter()

  const {
    isSessionValid,
    isCheckingSession,
    sessionData,
    needsAuth,
    authMessage,
    isAuthenticating,
    startAuthentication,
  } = usePiSession()

  const [activeTab, setActiveTab] = useState<TabType>("profile")

  const { language, changeLanguage, t, isRTL } = useLanguage()

  const { settings, updateSettings, isLoaded } = useSettings()
  const { history, loadSession, clearHistory } = useChatHistory()

  const userId = sessionData?.userId || "guest"
  const username = sessionData?.username || "Pioneer"
  const piAccessToken = sessionData?.piAccessToken || null

  const [user, setUser] = useState<PiUser | null>(null)
  const { joinedChannels, notifications, unreadCount, leaveChannel, markChannelAsRead, clearAllNotifications } =
    useJoinedChannels(userId)

  useEffect(() => {
    setUser({ uid: userId, username: username })
  }, [userId, username])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab")
    if (
      tab &&
      [
        "profile",
        "history",
        "settings",
        "channels",
        "notifications",
        "guide",
        "roadmap",
        "nft",
        "fraud-wallets",
        "admin",
        "referral",
      ].includes(tab)
    ) {
      setActiveTab(tab as TabType)
    }
  }, [])

  useEffect(() => {
    const showReferral = localStorage.getItem("p314_show_referral")
    if (showReferral === "true") {
      setActiveTab("referral")
      localStorage.removeItem("p314_show_referral")
    }
  }, [])

  const handleLoadSession = (sessionId: string) => {
    const messages = loadSession(sessionId)
    if (messages) {
      localStorage.setItem("p314_load_session", JSON.stringify(messages))
      router.push("/")
    }
  }

  const handleOpenChannel = (channelId: string) => {
    markChannelAsRead(channelId)
    localStorage.setItem("p314_open_channel", channelId)
    router.push("/")
  }

  const handleLeaveChannel = (channelId: string) => {
    if (confirm(t.leaveChannelConfirm || "Leave this channel?")) {
      leaveChannel(channelId)
    }
  }

  const tabs = [
    { id: "profile" as TabType, icon: UserIcon, label: t.profile || "Profile" },
    { id: "referral" as TabType, icon: Share2, label: t.referral || "Referrals" },
    { id: "guide" as TabType, icon: BookOpen, label: t.botGuide || "Bot Guide" },
    { id: "roadmap" as TabType, icon: MapPin, label: t.roadmap || "Roadmap" },
    { id: "nft" as TabType, icon: Gem, label: "NFT" },
    {
      id: "fraud-wallets" as TabType,
      icon: ShieldAlert,
      label: t.fraudWallets || "Fraud Wallets",
    },
    ...(isAdmin(username) ? [{ id: "admin" as TabType, icon: SettingsIcon, label: "Admin" }] : []),
    { id: "history" as TabType, icon: HistoryIcon, label: t.history || "History" },
    {
      id: "channels" as TabType,
      icon: Tv,
      label: t.channels || "Channels",
      badge: joinedChannels.length,
    },
    {
      id: "notifications" as TabType,
      icon: Bell,
      label: t.notifications || "Notifications",
      badge: unreadCount,
    },
    { id: "settings" as TabType, icon: SettingsIcon, label: t.settings || "Settings" },
  ]

  if (isCheckingSession || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: COLORS.PRIMARY }} />
      </div>
    )
  }

  if (!isSessionValid || needsAuth) {
    return <LoginPage onStartAuth={startAuthentication} authMessage={authMessage} isAuthenticating={isAuthenticating} />
  }

  return (
    <div className="min-h-screen p-2 sm:p-4" style={{ backgroundColor: COLORS.BACKGROUND }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-sm">
              <ArrowLeft size={16} />
              {t.backToChat || "Back to Chat"}
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
              {APP_CONFIG.NAME}
            </h1>

            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 shadow-sm border">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{username}</span>
              </div>

              <LanguageSwitcher language={language} onChange={changeLanguage} primaryColor={COLORS.PRIMARY} />
            </div>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b overflow-x-auto pb-px scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === tab.id ? "border-current" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                style={activeTab === tab.id ? { color: COLORS.PRIMARY } : {}}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 min-w-[18px] sm:min-w-[20px] text-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mb-4 sm:mb-6">
          {activeTab === "profile" && (
            <UserProfile user={user} language={language} chatHistory={history} piAccessToken={piAccessToken} />
          )}
          {activeTab === "referral" && <ReferralPanel userId={userId} username={username} />}
          {activeTab === "guide" && <BotGuidePanel language={language} />}
          {activeTab === "roadmap" && <RoadmapPanel language={language} />}
          {activeTab === "nft" && <NFTInfoPanel language={language} />}
          {activeTab === "fraud-wallets" && <FraudWalletsPanel language={language} />}
          {activeTab === "admin" && isAdmin(username) && <AdminDashboard piUsername={username} language={language} />}
          {activeTab === "history" && (
            <ChatHistoryPanel
              history={history}
              onLoadSession={handleLoadSession}
              onClearHistory={clearHistory}
              language={language}
            />
          )}
          {activeTab === "channels" && (
            <JoinedChannelsPanel
              channels={joinedChannels}
              onOpenChannel={handleOpenChannel}
              onLeaveChannel={handleLeaveChannel}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationsPanel
              notifications={notifications}
              onClearAll={clearAllNotifications}
              onOpenChannel={handleOpenChannel}
            />
          )}
          {activeTab === "settings" && (
            <SettingsPanel
              settings={settings}
              onUpdateSettings={updateSettings}
              userId={userId}
              piAccessToken={piAccessToken}
            />
          )}
        </div>

        <div className="text-center space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            <Link href="/privacy" className="hover:underline" style={{ color: COLORS.PRIMARY }}>
              {t.privacyPolicy || "Privacy Policy"}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline" style={{ color: COLORS.PRIMARY }}>
              {t.termsOfService || "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
