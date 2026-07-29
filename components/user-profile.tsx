"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Wallet,
  TrendingUp,
  Shield,
  Users,
  Settings,
  CheckCircle2,
  XCircle,
  Award,
  DollarSign,
  FileCheck,
} from "lucide-react"
import { COLORS } from "@/lib/app-config"
import type { PiUser } from "@/lib/types"
import { useAdminCheck } from "@/hooks/use-admin-check"
import { useReputation } from "@/hooks/use-reputation"
import { useWallet } from "@/hooks/use-wallet"
import { AdminDashboard } from "./admin-dashboard"
import { ProfileSettingsModal } from "./profile-settings-modal"
import { translations } from "@/lib/translations"

interface UserProfileProps {
  user: PiUser | null
  language: "en" | "ar"
}

export function UserProfile({ user, language }: UserProfileProps) {
  const isRTL = language === "ar"
  const { isAdmin } = useAdminCheck(user?.username || null)
  const { stats, currentLevel, loading: reputationLoading } = useReputation(user?.username || null)
  const { walletData, isAuthenticating, authenticateWallet, disconnectWallet } = useWallet(user?.username || null)
  const [showSettings, setShowSettings] = useState(false)
  const [referralStats, setReferralStats] = useState<any>(null)

  const t = translations[language]

  useEffect(() => {
    if (user?.username) {
      fetchReferralStats()
    }
  }, [user?.username])

  const fetchReferralStats = async () => {
    try {
      const response = await fetch("/api/referral/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.username }),
      })
      if (response.ok) {
        const data = await response.json()
        setReferralStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching referral stats:", error)
    }
  }

  if (!user) {
    return null
  }

  if (user.username === "Axis2030" || isAdmin) {
    return <AdminDashboard piUsername={user.username} language={language} />
  }

  const isModerator = user.roles?.includes("moderator")

  return (
    <>
      <Card className="w-full">
        <CardHeader style={{ backgroundColor: COLORS.PRIMARY }} className="relative">
          <CardTitle className="text-white text-lg flex items-center justify-between" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex items-center gap-2">
              <User size={20} />
              {t.profile}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={18} />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{t.username}:</span>
              <span className="text-base font-bold" style={{ color: COLORS.PRIMARY }}>
                @{user.username}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{t.role}:</span>
              <Badge
                style={{
                  backgroundColor: isModerator ? "#f59e0b" : COLORS.PRIMARY,
                  color: "white",
                }}
              >
                {isModerator ? t.moderator : t.pioneer}
              </Badge>
            </div>

            {user.kycVerified !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.kycStatus}:</span>
                <div className="flex items-center gap-1">
                  {user.kycVerified ? (
                    <>
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm text-green-600 font-semibold">{t.verified}</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-red-600" />
                      <span className="text-sm text-red-600 font-semibold">{t.unverified}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {currentLevel && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Level:</span>
                <Badge variant="outline" className="font-bold" style={{ borderColor: COLORS.PRIMARY }}>
                  <Award size={14} className="mr-1" />
                  {currentLevel.level_name}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Wallet size={18} style={{ color: COLORS.PRIMARY }} />
              <span className="text-base font-semibold" style={{ color: COLORS.PRIMARY }}>
                {t.walletAuth}
              </span>
            </div>

            {walletData.isConnected ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 size={16} />
                  <span className="font-medium">{t.walletConnected}</span>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                  {walletData.address?.substring(0, 20)}...
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={disconnectWallet}>
                  {t.disconnectWallet}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">{t.optionalWallet}</p>
                <Button
                  onClick={authenticateWallet}
                  disabled={isAuthenticating}
                  className="w-full"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  <Wallet size={16} className="mr-2" />
                  {isAuthenticating ? t.authenticating : t.authenticateWallet}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} style={{ color: COLORS.PRIMARY }} />
              <span className="text-base font-semibold" style={{ color: COLORS.PRIMARY }}>
                {language === "ar" ? "إحصائياتك" : "Your Stats"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Total Reputation */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Shield size={12} />
                  {t.totalReputation}
                </div>
                <div className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
                  {reputationLoading ? "..." : stats?.reputationPoints || 0}
                </div>
              </div>

              {/* Earnings Balance */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <DollarSign size={12} />
                  {t.earningsBalance}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {reputationLoading ? "..." : (stats?.walletBalance || 0).toFixed(2)} π
                </div>
              </div>

              {/* Verified Reports */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <FileCheck size={12} />
                  {t.verifiedReports}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {reputationLoading ? "..." : stats?.accurateReports || 0}
                </div>
              </div>

              {/* Referrals */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Users size={12} />
                  {t.referralStats}
                </div>
                <div className="text-2xl font-bold text-orange-600">{referralStats?.activatedReferrals || 0}</div>
              </div>
            </div>

            {/* Accuracy Rate */}
            {stats && stats.totalReports > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{language === "ar" ? "معدل الدقة" : "Accuracy Rate"}</span>
                  <span className="font-bold" style={{ color: COLORS.PRIMARY }}>
                    {stats.accuracyRate.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.accuracyRate}%`,
                      backgroundColor: COLORS.PRIMARY,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userId={user.username}
        language={language}
      />
    </>
  )
}
