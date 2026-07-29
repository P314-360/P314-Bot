"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, DollarSign, Settings, TrendingUp, Wallet, Bug, BookOpen } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ModeratorManagementPanel } from "./moderator-management-panel"
import { AdManagementPanel } from "./ad-management-panel"
import { AdminRevenuePanel } from "./admin-revenue-panel"
import { BountyReviewPanel } from "./bounty-review-panel"
import { SystemDocumentationPanel } from "./system-documentation-panel"
import type { AdminTreasury } from "@/lib/admin-revenue"
import { isAdmin } from "@/lib/admin-auth"

interface AdminDashboardProps {
  piUsername?: string
  language?: "en" | "ar"
}

export function AdminDashboard({ piUsername = "Admin", language = "en" }: AdminDashboardProps) {
  const isRTL = language === "ar"
  const [activeSection, setActiveSection] = useState<
    "overview" | "moderators" | "ads" | "revenue" | "settings" | "bounty" | "docs"
  >("overview")
  const [treasury, setTreasury] = useState<AdminTreasury | null>(null)
  const [loadingTreasury, setLoadingTreasury] = useState(true)

  useEffect(() => {
    if (isAdmin(piUsername)) {
      loadTreasuryData()
    }
  }, [piUsername])

  const loadTreasuryData = async () => {
    setLoadingTreasury(true)
    try {
      const response = await fetch("/api/admin/treasury", {
        headers: {
          "x-pi-username": piUsername,
        },
      })

      if (response.status === 403) {
        console.error("[SECURITY] Admin treasury access denied")
        return
      }

      const data = await response.json()
      setTreasury(data)
    } catch (error) {
      console.error("Error loading treasury:", error)
    } finally {
      setLoadingTreasury(false)
    }
  }

  const texts = {
    en: {
      title: "Admin Dashboard",
      overview: "Overview",
      moderators: "Moderators",
      ads: "Ads Management",
      revenue: "Revenue",
      settings: "Settings",
      bounty: "Bug Bounty",
      welcome: "Welcome Admin",
      totalMods: "Total Moderators",
      activeAds: "Active Ads",
      totalRevenue: "Total Revenue",
      users: "Total Users",
      validatorCommissions: "Validator Fees",
      withdrawalFees: "Withdrawal Fees",
      premiumServices: "Premium Services",
      description:
        "Manage moderators, ads, revenue, and bot settings in compliance with Pi Network policies and decentralization principles.",
      docs: "Documentation",
    },
    ar: {
      title: "لوحة التحكم الإدارية",
      overview: "نظرة عامة",
      moderators: "المشرفون",
      ads: "إدارة الإعلانات",
      revenue: "الإيرادات",
      settings: "الإعدادات",
      bounty: "مكافآت الثغرات",
      welcome: "مرحباً أيها المسؤول",
      totalMods: "إجمالي المشرفين",
      activeAds: "الإعلانات النشطة",
      totalRevenue: "إجمالي الإيرادات",
      users: "إجمالي المستخدمين",
      validatorCommissions: "رسوم المحققين",
      withdrawalFees: "رسوم السحب",
      premiumServices: "الخدمات المميزة",
      description:
        "إدارة المشرفين والإعلانات والإيرادات وإعدادات البوت بما يتوافق مع سياسات Pi Network ومبادئ اللامركزية.",
      docs: "التوثيق",
    },
  }

  const t = texts[language]

  const stats = {
    moderators: 12,
    activeAds: 5,
    revenue: treasury?.totalBalance || 0,
    users: 5420,
    validatorCommissions: treasury?.totalValidatorCommissions || 0,
    withdrawalFees: treasury?.totalWithdrawalFees || 0,
    premiumServices: treasury?.totalPremiumServices || 0,
  }

  if (!isAdmin(piUsername)) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Shield size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-red-600 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to access the Admin Dashboard.</p>
          <p className="text-sm text-gray-500 mt-2">Only authorized administrators can view this page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <Shield size={18} className="sm:w-5 sm:h-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: COLORS.PRIMARY }} />
            <span className="font-bold text-base sm:text-lg" style={{ color: COLORS.PRIMARY }}>
              {t.welcome}, @{piUsername}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{t.description}</p>
        </div>

        <div className="flex gap-1 sm:gap-2 border-b pb-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={activeSection === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("overview")}
            style={activeSection === "overview" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <TrendingUp size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.overview}
          </Button>
          <Button
            variant={activeSection === "moderators" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("moderators")}
            style={activeSection === "moderators" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Users size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.moderators}
          </Button>
          <Button
            variant={activeSection === "ads" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("ads")}
            style={activeSection === "ads" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <DollarSign size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.ads}
          </Button>
          <Button
            variant={activeSection === "revenue" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("revenue")}
            style={activeSection === "revenue" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Wallet size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.revenue}
          </Button>
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("settings")}
            style={activeSection === "settings" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Settings size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.settings}
          </Button>
          <Button
            variant={activeSection === "bounty" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("bounty")}
            style={activeSection === "bounty" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Bug size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.bounty}
          </Button>
          <Button
            variant={activeSection === "docs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("docs")}
            style={activeSection === "docs" ? { backgroundColor: COLORS.PRIMARY } : {}}
            className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <BookOpen size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
            {t.docs}
          </Button>
        </div>

        {activeSection === "overview" && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-[10px] sm:text-xs text-gray-600">{t.totalMods}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.moderators}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="sm:w-4 sm:h-4 text-green-600" />
                <span className="text-[10px] sm:text-xs text-gray-600">{t.activeAds}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.activeAds}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                <span className="text-[10px] sm:text-xs text-gray-600">{t.totalRevenue}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {loadingTreasury ? "..." : `${stats.revenue.toFixed(6)} π`}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">{t.validatorCommissions}</div>
                  <div className="text-xs font-semibold text-purple-600">{stats.validatorCommissions.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">{t.withdrawalFees}</div>
                  <div className="text-xs font-semibold text-purple-600">{stats.withdrawalFees.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">{t.premiumServices}</div>
                  <div className="text-xs font-semibold text-purple-600">{stats.premiumServices.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "moderators" && <ModeratorManagementPanel language={language} />}

        {activeSection === "ads" && <AdManagementPanel language={language} />}

        {activeSection === "revenue" && (
          <AdminRevenuePanel language={language} treasury={treasury} onRefresh={loadTreasuryData} />
        )}

        {activeSection === "settings" && (
          <div className="text-center text-gray-500 py-8">
            <Settings size={40} className="sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-base">{language === "ar" ? "قريباً" : "Coming Soon"}</p>
          </div>
        )}

        {activeSection === "bounty" && <BountyReviewPanel adminId={piUsername} language={language} />}

        {activeSection === "docs" && <SystemDocumentationPanel language={language} />}
      </CardContent>
    </Card>
  )
}
