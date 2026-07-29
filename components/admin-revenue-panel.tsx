"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, TrendingUp, Coins, Settings, RefreshCw, Save } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import type { AdminTreasury, RevenueConfig } from "@/lib/admin-revenue"
import { getRevenueConfig, updateRevenueConfig } from "@/lib/admin-revenue"

interface AdminRevenuePanelProps {
  language: "en" | "ar"
  treasury: AdminTreasury | null
  onRefresh: () => void
}

export function AdminRevenuePanel({ language, treasury, onRefresh }: AdminRevenuePanelProps) {
  const isRTL = language === "ar"
  const [config, setConfig] = useState<RevenueConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedConfig, setEditedConfig] = useState<RevenueConfig | null>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const data = await getRevenueConfig()
    setConfig(data)
    setEditedConfig(data)
  }

  const handleSaveConfig = async () => {
    if (!editedConfig) return

    setIsSaving(true)
    const success = await updateRevenueConfig(editedConfig)

    if (success) {
      setConfig(editedConfig)
      setIsEditing(false)
      alert(language === "ar" ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully")
    } else {
      alert(language === "ar" ? "فشل حفظ الإعدادات" : "Failed to save settings")
    }

    setIsSaving(false)
  }

  const texts = {
    en: {
      title: "Revenue Management",
      treasury: "Platform Treasury",
      totalBalance: "Total Balance",
      breakdown: "Revenue Breakdown",
      validatorCommissions: "Validator Commissions",
      withdrawalFees: "Withdrawal Fees",
      premiumServices: "Premium Services",
      configuration: "Fee Configuration",
      validatorRate: "Validator Commission Rate",
      withdrawalRate: "Withdrawal Fee Rate",
      premiumRate: "Premium Service Rate",
      edit: "Edit Rates",
      save: "Save Changes",
      cancel: "Cancel",
      refresh: "Refresh",
      lastUpdated: "Last Updated",
      percentSymbol: "%",
    },
    ar: {
      title: "إدارة الإيرادات",
      treasury: "خزينة المنصة",
      totalBalance: "الرصيد الكلي",
      breakdown: "تفصيل الإيرادات",
      validatorCommissions: "عمولات المحققين",
      withdrawalFees: "رسوم السحب",
      premiumServices: "الخدمات المميزة",
      configuration: "إعدادات الرسوم",
      validatorRate: "معدل عمولة المحققين",
      withdrawalRate: "معدل رسوم السحب",
      premiumRate: "معدل الخدمات المميزة",
      edit: "تعديل النسب",
      save: "حفظ التغييرات",
      cancel: "إلغاء",
      refresh: "تحديث",
      lastUpdated: "آخر تحديث",
      percentSymbol: "٪",
    },
  }

  const t = texts[language]

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: COLORS.PRIMARY }}>
          {t.title}
        </h3>
        <Button size="sm" onClick={onRefresh} variant="outline" className="gap-2 bg-transparent">
          <RefreshCw size={14} />
          {t.refresh}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={20} className="text-purple-600" />
            <h4 className="font-bold text-purple-900">{t.treasury}</h4>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">{t.totalBalance}</div>
            <div className="text-3xl font-bold text-purple-600">
              {treasury?.totalBalance.toFixed(6) || "0.000000"} π
            </div>
            {treasury?.lastUpdated && (
              <div className="text-xs text-gray-500 mt-2">
                {t.lastUpdated}: {new Date(treasury.lastUpdated).toLocaleString(language === "ar" ? "ar-SA" : "en-US")}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">{t.breakdown}</h5>

            <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-blue-600" />
                <span className="text-sm">{t.validatorCommissions}</span>
              </div>
              <span className="font-bold text-blue-600">
                {treasury?.totalValidatorCommissions.toFixed(6) || "0.000000"} π
              </span>
            </div>

            <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm">{t.withdrawalFees}</span>
              </div>
              <span className="font-bold text-green-600">
                {treasury?.totalWithdrawalFees.toFixed(6) || "0.000000"} π
              </span>
            </div>

            <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-orange-600" />
                <span className="text-sm">{t.premiumServices}</span>
              </div>
              <span className="font-bold text-orange-600">
                {treasury?.totalPremiumServices.toFixed(6) || "0.000000"} π
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings size={18} style={{ color: COLORS.PRIMARY }} />
              <h4 className="font-bold" style={{ color: COLORS.PRIMARY }}>
                {t.configuration}
              </h4>
            </div>
            {!isEditing && (
              <Button size="sm" onClick={() => setIsEditing(true)} variant="outline">
                {t.edit}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">{t.validatorRate}</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(editedConfig?.validatorCommissionRate || 0) * 100}
                    onChange={(e) =>
                      setEditedConfig({
                        ...editedConfig!,
                        validatorCommissionRate: Number.parseFloat(e.target.value) / 100,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{t.percentSymbol}</span>
                </div>
              ) : (
                <div className="text-lg font-bold" style={{ color: COLORS.PRIMARY }}>
                  {((config?.validatorCommissionRate || 0) * 100).toFixed(1)}
                  {t.percentSymbol}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm mb-2 block">{t.withdrawalRate}</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(editedConfig?.withdrawalFeeRate || 0) * 100}
                    onChange={(e) =>
                      setEditedConfig({
                        ...editedConfig!,
                        withdrawalFeeRate: Number.parseFloat(e.target.value) / 100,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{t.percentSymbol}</span>
                </div>
              ) : (
                <div className="text-lg font-bold" style={{ color: COLORS.PRIMARY }}>
                  {((config?.withdrawalFeeRate || 0) * 100).toFixed(1)}
                  {t.percentSymbol}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm mb-2 block">{t.premiumRate}</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(editedConfig?.premiumServiceRate || 0) * 100}
                    onChange={(e) =>
                      setEditedConfig({
                        ...editedConfig!,
                        premiumServiceRate: Number.parseFloat(e.target.value) / 100,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{t.percentSymbol}</span>
                </div>
              ) : (
                <div className="text-lg font-bold" style={{ color: COLORS.PRIMARY }}>
                  {((config?.premiumServiceRate || 0) * 100).toFixed(1)}
                  {t.percentSymbol}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  <Save size={16} />
                  {isSaving ? "..." : t.save}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  {t.cancel}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
