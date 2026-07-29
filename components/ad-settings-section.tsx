"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DollarSign, Sparkles, Gift, TrendingUp } from "lucide-react"
import { useAdSettings } from "@/hooks/use-ad-settings"

interface AdSettingsSectionProps {
  userId: string
  language: "en" | "ar"
}

export function AdSettingsSection({ userId, language }: AdSettingsSectionProps) {
  const isRTL = language === "ar"
  const { adSettings, isLoading, updateAdSettings } = useAdSettings(userId, null)

  const texts = {
    en: {
      title: "Advertisement Settings",
      enableAds: "Enable Advertisements",
      enableAdsDesc: "Support the bot and earn passive income by enabling ads",
      benefits: "Benefits when enabled:",
      benefit1: "Earn passive revenue share",
      benefit2: "Access to premium features",
      benefit3: "Help support bot development",
      benefit4: "Transparent revenue distribution",
      yourEarnings: "Your Earnings",
      totalEarned: "Total Earned",
      revenueShare: "Revenue Share",
      features: "Unlocked Features",
      transparency: "Transparency & Decentralization",
      transparencyDesc:
        "All ad revenue is distributed fairly in compliance with Pi Network principles. You have full control over your ad preferences.",
    },
    ar: {
      title: "إعدادات الإعلانات",
      enableAds: "تفعيل الإعلانات",
      enableAdsDesc: "ادعم البوت واربح دخلاً سلبياً من خلال تفعيل الإعلانات",
      benefits: "المزايا عند التفعيل:",
      benefit1: "ربح حصة من الدخل السلبي",
      benefit2: "الوصول إلى ميزات مميزة",
      benefit3: "المساعدة في دعم تطوير البوت",
      benefit4: "توزيع شفف للدخل",
      yourEarnings: "أرباحك",
      totalEarned: "إجمالي الأرباح",
      revenueShare: "حصة الدخل",
      features: "الميزات المفتوحة",
      transparency: "الشفافية واللامركزية",
      transparencyDesc:
        "يتم توزيع جميع عائدات الإعلانات بشكل عادل وفقاً لمبادئ Pi Network. لديك السيطرة الكاملة على تفضيلات الإعلانات.",
    },
  }

  const t = texts[language]

  if (!adSettings) {
    return (
      <div className="text-center py-4 text-gray-500">
        {isLoading ? "Loading..." : language === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    )
  }

  const handleToggle = async (checked: boolean) => {
    await updateAdSettings(checked)
  }

  const defaultFeatures = [
    language === "ar" ? "إزالة حدود الرسائل" : "Unlimited messages",
    language === "ar" ? "الأولوية في الاستجابة" : "Priority response",
    language === "ar" ? "وصول مبكر للميزات الجديدة" : "Early access to new features",
  ]

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="space-y-0.5 flex-1">
          <Label className="text-base flex items-center gap-2 font-semibold">
            <DollarSign size={18} className="text-green-600" />
            {t.enableAds}
          </Label>
          <div className="text-sm text-gray-600">{t.enableAdsDesc}</div>
        </div>
        <Switch checked={adSettings.adsEnabled} onCheckedChange={handleToggle} disabled={isLoading} />
      </div>

      {adSettings.adsEnabled && (
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-green-700">
                <Gift size={18} />
                <span>{t.benefits}</span>
              </div>
              <div className="space-y-2 pl-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles size={14} className="text-green-600" />
                  <span>{t.benefit1}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles size={14} className="text-green-600" />
                  <span>{t.benefit2}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles size={14} className="text-green-600" />
                  <span>{t.benefit3}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles size={14} className="text-green-600" />
                  <span>{t.benefit4}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200">
              <div className="flex items-center gap-2 mb-3 font-semibold text-green-700">
                <TrendingUp size={18} />
                <span>{t.yourEarnings}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">{t.totalEarned}</div>
                  <div className="text-2xl font-bold text-green-600">${adSettings.earnedRevenue.toFixed(2)}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">{t.revenueShare}</div>
                  <div className="text-2xl font-bold text-green-600">{adSettings.revenueSharePercentage}%</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200">
              <div className="text-sm font-semibold text-green-700 mb-2">{t.features}</div>
              <div className="space-y-1">
                {(adSettings.features.length > 0 ? adSettings.features : defaultFeatures).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                    <Sparkles size={12} className="text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <ShieldIcon className="text-blue-600 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="font-semibold text-blue-800 mb-1">{t.transparency}</div>
            <div className="text-sm text-blue-700">{t.transparencyDesc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShieldIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
