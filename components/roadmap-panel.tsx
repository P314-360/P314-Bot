"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, CheckCircle2, Clock, Sparkles } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface RoadmapPanelProps {
  language: "en" | "ar"
}

export function RoadmapPanel({ language }: RoadmapPanelProps) {
  const isRTL = language === "ar"

  const texts = {
    en: {
      title: "P314 Roadmap",
      subtitle: "Our journey to revolutionize Pi Network support",
      completed: "Completed",
      inProgress: "In Progress",
      planned: "Planned",
      q4_2024: "Q4 2024",
      q1_2025: "Q1 2025",
      q2_2025: "Q2 2025",
      q3_2025: "Q3 2025",
      phase1Title: "Foundation & Core Features",
      phase1Items: [
        "AI-powered chatbot for Pi Network support",
        "Multi-language support (English & Arabic)",
        "Community chat integration",
        "Wallet verification system",
        "Fraud reporting mechanism",
      ],
      phase2Title: "Enhanced Security & Channels",
      phase2Items: [
        "End-to-end encrypted chat",
        "User channels creation",
        "Moderator server integration",
        "Quest and reward system",
        "NFT badges for achievements",
      ],
      phase3Title: "Advanced AI & Analytics",
      phase3Items: [
        "Advanced AI training with Pi Network data",
        "Real-time KYC status verification",
        "Predictive analytics for account issues",
        "Enhanced fraud detection algorithms",
        "API access for developers",
      ],
      phase4Title: "NFT Marketplace & Expansion",
      phase4Items: [
        "NFT marketplace launch",
        "Achievement NFT minting",
        "P314 token integration",
        "Cross-chain wallet support",
        "Mobile app release (iOS & Android)",
      ],
    },
    ar: {
      title: "خارطة طريق P314",
      subtitle: "رحلتنا لإحداث ثورة في دعم شبكة Pi",
      completed: "مكتمل",
      inProgress: "قيد التنفيذ",
      planned: "مخطط",
      q4_2024: "الربع الرابع 2024",
      q1_2025: "الربع الأول 2025",
      q2_2025: "الربع الثاني 2025",
      q3_2025: "الربع الثالث 2025",
      phase1Title: "الأساس والميزات الأساسية",
      phase1Items: [
        "روبوت دردشة يعمل بالذكاء الاصطناعي لدعم Pi Network",
        "دعم متعدد اللغات (الإنجليزية والعربية)",
        "تكامل دردشة المجتمع",
        "نظام التحقق من المحفظة",
        "آلية الإبلاغ عن الاحتيال",
      ],
      phase2Title: "الأمان المحسّن والقنوات",
      phase2Items: [
        "الدردشة المشفرة من طرف إلى طرف",
        "إنشاء قنوات المستخدمين",
        "تكامل خادم المشرفين",
        "نظام المهام والمكافآت",
        "شارات NFT للإنجازات",
      ],
      phase3Title: "الذكاء الاصطناعي المتقدم والتحليلات",
      phase3Items: [
        "تدريب الذكاء الاصطناعي المتقدم ببيانات Pi Network",
        "التحقق الفوري من حالة KYC",
        "التحليلات التنبؤية لمشاكل الحساب",
        "خوارزميات محسّنة للكشف عن الاحتيال",
        "الوصول إلى API للمطورين",
      ],
      phase4Title: "سوق NFT والتوسع",
      phase4Items: [
        "إطلاق سوق NFT",
        "سك NFT الإنجازات",
        "تكامل رمز P314",
        "دعم المحفظة متعددة السلاسل",
        "إصدار تطبيق الجوال (iOS و Android)",
      ],
    },
  }

  const t = texts[language]

  const phases = [
    {
      status: "completed" as const,
      period: t.q4_2024,
      title: t.phase1Title,
      items: t.phase1Items,
      color: "#10b981",
    },
    {
      status: "in-progress" as const,
      period: t.q1_2025,
      title: t.phase2Title,
      items: t.phase2Items,
      color: "#f59e0b",
    },
    {
      status: "planned" as const,
      period: t.q2_2025,
      title: t.phase3Title,
      items: t.phase3Items,
      color: COLORS.PRIMARY,
    },
    {
      status: "planned" as const,
      period: t.q3_2025,
      title: t.phase4Title,
      items: t.phase4Items,
      color: "#8b5cf6",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <MapPin size={20} />
          {t.title}
        </CardTitle>
        <p className="text-white/90 text-sm mt-1" dir={isRTL ? "rtl" : "ltr"}>
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="space-y-6">
          {phases.map((phase, index) => {
            const StatusIcon =
              phase.status === "completed" ? CheckCircle2 : phase.status === "in-progress" ? Clock : Sparkles
            return (
              <div key={index} className="relative">
                {index < phases.length - 1 && (
                  <div
                    className={`absolute ${isRTL ? "right-[19px]" : "left-[19px]"} top-12 bottom-0 w-0.5 bg-gray-200`}
                  />
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-white border-2"
                    style={{ borderColor: phase.color }}
                  >
                    <StatusIcon size={20} style={{ color: phase.color }} />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${phase.color}20`, color: phase.color }}
                      >
                        {phase.period}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full border"
                        style={{ borderColor: phase.color, color: phase.color }}
                      >
                        {phase.status === "completed"
                          ? t.completed
                          : phase.status === "in-progress"
                            ? t.inProgress
                            : t.planned}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2" style={{ color: phase.color }}>
                      {phase.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
