"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Gem, TrendingUp, Gift, Zap } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface NFTInfoPanelProps {
  language: "en" | "ar"
}

export function NFTInfoPanel({ language }: NFTInfoPanelProps) {
  const isRTL = language === "ar"

  const texts = {
    en: {
      title: "NFT Features (Coming Soon)",
      subtitle: "Exclusive digital badges and rewards for P314 users",
      intro:
        "P314 will introduce an exciting NFT system to reward active community members and recognize achievements within the Pi Network ecosystem.",
      achievementTitle: "Achievement NFTs",
      achievementDesc:
        "Earn unique NFT badges by completing quests, helping others, and contributing to the community. Each NFT represents your journey and expertise.",
      rarityTitle: "Rarity Tiers",
      rarityDesc:
        "NFTs will have different rarity levels: Common, Rare, Epic, and Legendary. Higher tiers unlock exclusive benefits and recognition.",
      marketplaceTitle: "NFT Marketplace",
      marketplaceDesc:
        "Trade, buy, and sell your achievement NFTs in our upcoming marketplace. Use Pi tokens for transactions.",
      utilityTitle: "Utility & Benefits",
      utilityDesc:
        "NFT holders will receive priority support, exclusive channels access, early feature access, and governance voting rights.",
      questTitle: "Current Quest System",
      questDesc: "Start earning quest points now! When NFTs launch, your progress will convert to exclusive NFTs.",
      benefits: "NFT Benefits",
      benefit1: "Priority customer support",
      benefit2: "Access to exclusive channels",
      benefit3: "Voting rights on features",
      benefit4: "Early access to updates",
      benefit5: "Tradeable on marketplace",
      benefit6: "Profile badge display",
      launchDate: "Expected Launch: Q3 2025",
      callToAction: "Complete quests now to be ready for NFT launch!",
    },
    ar: {
      title: "ميزات NFT (قريباً)",
      subtitle: "شارات رقمية حصرية ومكافآت لمستخدمي P314",
      intro: "سيقدم P314 نظام NFT مثير لمكافأة أعضاء المجتمع النشطين والاعتراف بالإنجازات داخل نظام Pi Network البيئي.",
      achievementTitle: "NFTs الإنجازات",
      achievementDesc:
        "اكسب شارات NFT فريدة من خلال إكمال المهام ومساعدة الآخرين والمساهمة في المجتمع. كل NFT يمثل رحلتك وخبرتك.",
      rarityTitle: "مستويات الندرة",
      rarityDesc:
        "ستحتوي NFTs على مستويات ندرة مختلفة: عادية، نادرة، ملحمية، وأسطورية. المستويات الأعلى تفتح مزايا واعتراف حصري.",
      marketplaceTitle: "سوق NFT",
      marketplaceDesc: "تداول وشراء وبيع NFTs الإنجازات الخاصة بك في السوق القادم. استخدم رموز Pi للمعاملات.",
      utilityTitle: "الفائدة والمزايا",
      utilityDesc:
        "سيحصل حاملو NFT على دعم ذو أولوية، الوصول إلى القنوات الحصرية، الوصول المبكر للميزات، وحقوق التصويت على الحوكمة.",
      questTitle: "نظام المهام الحالي",
      questDesc: "ابدأ في كسب نقاط المهام الآن! عند إطلاق NFTs، سيتحول تقدمك إلى NFTs حصرية.",
      benefits: "فوائد NFT",
      benefit1: "دعم عملاء ذو أولوية",
      benefit2: "الوصول إلى القنوات الحصرية",
      benefit3: "حقوق التصويت على الميزات",
      benefit4: "الوصول المبكر للتحديثات",
      benefit5: "قابلة للتداول في السوق",
      benefit6: "عرض شارة الملف الشخصي",
      launchDate: "الإطلاق المتوقع: الربع الثالث 2025",
      callToAction: "أكمل المهام الآن لتكون جاهزاً لإطلاق NFT!",
    },
  }

  const t = texts[language]

  const features = [
    { icon: Award, title: t.achievementTitle, description: t.achievementDesc, color: "#f59e0b" },
    { icon: Gem, title: t.rarityTitle, description: t.rarityDesc, color: "#8b5cf6" },
    { icon: TrendingUp, title: t.marketplaceTitle, description: t.marketplaceDesc, color: "#10b981" },
    { icon: Gift, title: t.utilityTitle, description: t.utilityDesc, color: "#ec4899" },
  ]

  const benefits = [t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6]

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <Gem size={20} />
          {t.title}
        </CardTitle>
        <p className="text-white/90 text-sm mt-1" dir={isRTL ? "rtl" : "ltr"}>
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <p className="text-sm text-gray-700 leading-relaxed">{t.intro}</p>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1" style={{ color: feature.color }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3 mb-3">
            <Zap size={20} style={{ color: COLORS.PRIMARY }} />
            <div>
              <h3 className="font-semibold text-base mb-1" style={{ color: COLORS.PRIMARY }}>
                {t.questTitle}
              </h3>
              <p className="text-sm text-gray-600">{t.questDesc}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2" style={{ color: COLORS.PRIMARY }}>
            <Gift size={18} />
            {t.benefits}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  ✓
                </div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-center">
          <p className="text-white font-semibold text-base mb-2">{t.launchDate}</p>
          <p className="text-white/90 text-sm">{t.callToAction}</p>
        </div>
      </CardContent>
    </Card>
  )
}
