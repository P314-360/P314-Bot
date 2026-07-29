"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Search, Shield, ShieldAlert, Calendar, FileText, CheckCircle2, XCircle } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface FraudWalletsPanelProps {
  language: "en" | "ar"
}

interface FraudWallet {
  address: string
  reportedDate: string
  reason: string
  status: "confirmed" | "investigating"
  reportCount: number
}

export function FraudWalletsPanel({ language }: FraudWalletsPanelProps) {
  const isRTL = language === "ar"
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<"safe" | "fraud" | null>(null)

  const texts = {
    en: {
      title: "Reported Fraud Wallets",
      subtitle: "Check wallet addresses for safety",
      searchPlaceholder: "Enter wallet address to verify...",
      searchButton: "Search",
      clearButton: "Clear",
      resultsTitle: "Search Results",
      safeWallet: "Safe Wallet",
      fraudWallet: "Fraud Wallet",
      safeMessage: "This wallet address is not in our fraud database. However, always exercise caution.",
      fraudMessage: "⚠️ This wallet has been reported and confirmed as fraudulent. Do not transact with it.",
      reportedWallets: "Recently Reported Wallets",
      address: "Address",
      reportedDate: "Reported",
      reason: "Reason",
      status: "Status",
      reportCount: "Reports",
      confirmed: "Confirmed Fraud",
      investigating: "Under Investigation",
      reasons: {
        scam: "Scam/Phishing",
        fake: "Fake Promise",
        theft: "Theft/Hack",
        impersonation: "Impersonation",
        ponzi: "Ponzi Scheme",
      },
      howToReport: "How to Report",
      howToReportDesc:
        "If you encounter a suspicious wallet, report it through the AI chat or fraud reporting feature. Our team will investigate and verify all reports.",
      warning: "⚠️ Warning",
      warningText:
        "Always verify wallet addresses before making transactions. Do not share your private keys or seed phrases with anyone.",
      disclaimer: "Disclaimer",
      disclaimerText:
        "This list is maintained by community reports and team verification. Always do your own research before any transaction.",
    },
    ar: {
      title: "المحافظ المبلغ عنها",
      subtitle: "تحقق من سلامة عناوين المحافظ",
      searchPlaceholder: "أدخل عنوان المحفظة للتحقق...",
      searchButton: "بحث",
      clearButton: "مسح",
      resultsTitle: "نتائج البحث",
      safeWallet: "محفظة آمنة",
      fraudWallet: "محفظة احتيالية",
      safeMessage: "عنوان المحفظة هذا غير موجود في قاعدة بيانات الاحتيال لدينا. ومع ذلك، توخى الحذر دائماً.",
      fraudMessage: "⚠️ تم الإبلاغ عن هذه المحفظة وتأكيدها كمحفظة احتيالية. لا تتعامل معها.",
      reportedWallets: "المحافظ المبلغ عنها مؤخراً",
      address: "العنوان",
      reportedDate: "تاريخ الإبلاغ",
      reason: "السبب",
      status: "الحالة",
      reportCount: "عدد البلاغات",
      confirmed: "احتيال مؤكد",
      investigating: "قيد التحقيق",
      reasons: {
        scam: "احتيال/تصيد",
        fake: "وعود كاذبة",
        theft: "سرقة/اختراق",
        impersonation: "انتحال شخصية",
        ponzi: "مخطط بونزي",
      },
      howToReport: "كيفية الإبلاغ",
      howToReportDesc:
        "إذا واجهت محفظة مشبوهة، أبلغ عنها من خلال الدردشة بالذكاء الاصطناعي أو ميزة الإبلاغ عن الاحتيال. سيقوم فريقنا بالتحقيق والتحقق من جميع البلاغات.",
      warning: "⚠️ تحذير",
      warningText:
        "تحقق دائماً من عناوين المحافظ قبل إجراء المعاملات. لا تشارك مفاتيحك الخاصة أو عبارات الاسترداد مع أي شخص.",
      disclaimer: "إخلاء المسؤولية",
      disclaimerText:
        "يتم الاحتفاظ بهذه القائمة من خلال بلاغات المجتمع والتحقق من الفريق. قم دائماً بإجراء بحثك الخاص قبل أي معاملة.",
    },
  }

  const t = texts[language]

  // Sample fraud wallets data - In production, this would come from a database
  const fraudWallets: FraudWallet[] = [
    {
      address: "GBXYZ...ABC123",
      reportedDate: "2024-01-15",
      reason: t.reasons.scam,
      status: "confirmed",
      reportCount: 15,
    },
    {
      address: "GDABC...XYZ789",
      reportedDate: "2024-01-14",
      reason: t.reasons.impersonation,
      status: "confirmed",
      reportCount: 8,
    },
    {
      address: "GCDEF...QWE456",
      reportedDate: "2024-01-13",
      reason: t.reasons.ponzi,
      status: "investigating",
      reportCount: 5,
    },
    {
      address: "GAFGH...RTY890",
      reportedDate: "2024-01-12",
      reason: t.reasons.fake,
      status: "confirmed",
      reportCount: 12,
    },
    {
      address: "GBIJK...UIO234",
      reportedDate: "2024-01-11",
      reason: t.reasons.theft,
      status: "confirmed",
      reportCount: 20,
    },
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Check if the searched address matches any fraud wallet
    const isFraud = fraudWallets.some((wallet) => wallet.address.toLowerCase().includes(searchQuery.toLowerCase()))

    setSearchResult(isFraud ? "fraud" : "safe")
  }

  const handleClear = () => {
    setSearchQuery("")
    setSearchResult(null)
  }

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: "#ef4444" }}>
        <CardTitle className="text-white text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <ShieldAlert size={20} />
          {t.title}
        </CardTitle>
        <p className="text-white/90 text-sm mt-1" dir={isRTL ? "rtl" : "ltr"}>
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Search Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <Button onClick={handleSearch} style={{ backgroundColor: COLORS.PRIMARY }}>
              {t.searchButton}
            </Button>
            {searchQuery && (
              <Button onClick={handleClear} variant="outline">
                {t.clearButton}
              </Button>
            )}
          </div>

          {/* Search Results */}
          {searchResult && (
            <div
              className={`p-4 rounded-lg border-2 ${
                searchResult === "safe" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {searchResult === "safe" ? (
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                ) : (
                  <XCircle className="text-red-600 flex-shrink-0" size={24} />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-base mb-2 ${
                      searchResult === "safe" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {searchResult === "safe" ? t.safeWallet : t.fraudWallet}
                  </h3>
                  <p className={`text-sm ${searchResult === "safe" ? "text-green-600" : "text-red-600"}`}>
                    {searchResult === "safe" ? t.safeMessage : t.fraudMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning Box */}
        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">{t.warning}</h3>
              <p className="text-sm text-yellow-700">{t.warningText}</p>
            </div>
          </div>
        </div>

        {/* Reported Wallets List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: COLORS.PRIMARY }}>
            <Shield size={20} />
            {t.reportedWallets}
          </h3>

          <div className="space-y-2">
            {fraudWallets.map((wallet, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-red-200">
                          {wallet.address}
                        </code>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            wallet.status === "confirmed" ? "bg-red-600 text-white" : "bg-yellow-600 text-white"
                          }`}
                        >
                          {wallet.status === "confirmed" ? t.confirmed : t.investigating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-red-600" />
                      <span className="text-gray-600">{t.reason}:</span>
                      <span className="font-medium text-gray-800">{wallet.reason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-red-600" />
                      <span className="text-gray-600">{t.reportedDate}:</span>
                      <span className="font-medium text-gray-800">{wallet.reportedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle size={14} className="text-red-600" />
                    <span className="text-gray-600">{t.reportCount}:</span>
                    <span className="font-semibold text-red-700">{wallet.reportCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Report Section */}
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FileText size={18} />
            {t.howToReport}
          </h3>
          <p className="text-sm text-blue-700">{t.howToReportDesc}</p>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">{t.disclaimer}</h3>
          <p className="text-xs text-gray-600">{t.disclaimerText}</p>
        </div>
      </CardContent>
    </Card>
  )
}
