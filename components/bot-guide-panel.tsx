"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageCircle, Shield, Search, Users, Lock, Tv, AlertTriangle } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface BotGuidePanelProps {
  language: "en" | "ar"
}

export function BotGuidePanel({ language }: BotGuidePanelProps) {
  const isRTL = language === "ar"

  const texts = {
    en: {
      title: "Bot Guide",
      subtitle: "Learn how to use all P314 services",
      aiChat: "AI Chat Support",
      aiChatDesc:
        "Ask questions about Pi Network, KYC verification, and account issues. Get instant intelligent responses powered by AI.",
      communityChat: "Community Chat",
      communityChatDesc:
        "Connect with other Pi Network pioneers in real-time. Share experiences and get help from the community.",
      secureChat: "Secure End-to-End Encrypted Chat",
      secureChatDesc:
        "Private conversations with full encryption. Your messages are protected and only visible to participants.",
      walletVerify: "Wallet Verification",
      walletVerifyDesc:
        "Search and verify Pi wallet addresses. Check transaction history and wallet legitimacy to avoid scams.",
      fraudReport: "Fraud Reporting",
      fraudReportDesc: "Report suspicious wallets or activities. Help protect the Pi Network community from scammers.",
      moderatorServers: "Moderator Servers",
      moderatorServersDesc: "Access official moderator servers for verified support and community guidelines.",
      channels: "User Channels",
      channelsDesc: "Create your own channel or join others. Share knowledge and build your community within P314.",
      tips: "Quick Tips",
      tip1: "Use the + button to access all features",
      tip2: "Rate responses to help improve AI accuracy",
      tip3: "Check your quest progress for rewards",
      tip4: "Verify wallet addresses before transactions",
    },
    ar: {
      title: "دليل البوت",
      subtitle: "تعلم كيفية استخدام جميع خدمات P314",
      aiChat: "دعم الدردشة بالذكاء الاصطناعي",
      aiChatDesc:
        "اطرح أسئلة حول شبكة Pi، التحقق من الهوية KYC، ومشاكل الحساب. احصل على ردود ذكية فورية مدعومة بالذكاء الاصطناعي.",
      communityChat: "دردشة المجتمع",
      communityChatDesc:
        "تواصل مع رواد Pi Network الآخرين في الوقت الفعلي. شارك التجارب واحصل على المساعدة من المجتمع.",
      secureChat: "الدردشة الآمنة المشفرة",
      secureChatDesc: "محادثات خاصة مع تشفير كامل. رسائلك محمية ومرئية فقط للمشاركين.",
      walletVerify: "التحقق من المحفظة",
      walletVerifyDesc: "ابحث وتحقق من عناوين محفظة Pi. تحقق من سجل المعاملات وشرعية المحفظة لتجنب الاحتيال.",
      fraudReport: "الإبلاغ عن الاحتيال",
      fraudReportDesc: "أبلغ عن المحافظ أو الأنشطة المشبوهة. ساعد في حماية مجتمع Pi Network من المحتالين.",
      moderatorServers: "خوادم المشرفين",
      moderatorServersDesc: "الوصول إلى خوادم المشرفين الرسمية للحصول على الدعم الموثق وإرشادات المجتمع.",
      channels: "قنوات المستخدمين",
      channelsDesc: "أنشئ قناتك الخاصة أو انضم إلى قنوات أخرى. شارك المعرفة وبناء مجتمعك داخل P314.",
      tips: "نصائح سريعة",
      tip1: "استخدم زر + للوصول إلى جميع الميزات",
      tip2: "قيّم الردود للمساعدة في تحسين دقة الذكاء الاصطناعي",
      tip3: "تحقق من تقدم مهامك للحصول على المكافآت",
      tip4: "تحقق من عناوين المحفظة قبل المعاملات",
    },
  }

  const t = texts[language]

  const services = [
    { icon: MessageCircle, title: t.aiChat, description: t.aiChatDesc, color: COLORS.PRIMARY },
    { icon: Users, title: t.communityChat, description: t.communityChatDesc, color: "#10b981" },
    { icon: Lock, title: t.secureChat, description: t.secureChatDesc, color: "#8b5cf6" },
    { icon: Search, title: t.walletVerify, description: t.walletVerifyDesc, color: "#f59e0b" },
    { icon: AlertTriangle, title: t.fraudReport, description: t.fraudReportDesc, color: "#ef4444" },
    { icon: Shield, title: t.moderatorServers, description: t.moderatorServersDesc, color: "#3b82f6" },
    { icon: Tv, title: t.channels, description: t.channelsDesc, color: "#ec4899" },
  ]

  const tips = [t.tip1, t.tip2, t.tip3, t.tip4]

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <BookOpen size={20} />
          {t.title}
        </CardTitle>
        <p className="text-white/90 text-sm mt-1" dir={isRTL ? "rtl" : "ltr"}>
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="space-y-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <Icon size={20} style={{ color: service.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1" style={{ color: service.color }}>
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2" style={{ color: COLORS.PRIMARY }}>
            <BookOpen size={18} />
            {t.tips}
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-600 font-bold">{index + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
