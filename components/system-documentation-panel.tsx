"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BookOpen, Shield, DollarSign, Award, Share2, Bug, Wallet } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface SystemDocumentationPanelProps {
  language?: "en" | "ar"
}

export function SystemDocumentationPanel({ language = "en" }: SystemDocumentationPanelProps) {
  const isRTL = language === "ar"
  const [activeSection, setActiveSection] = useState<"overview" | "journey" | "modules" | "financial" | "roadmap">(
    "overview",
  )

  const content = {
    en: {
      title: "System Documentation",
      sections: {
        overview: "System Overview",
        journey: "User Journey",
        modules: "Module Interconnectivity",
        financial: "Financial Logic",
        roadmap: "Roadmap",
      },
      overview: {
        title: "P314 System Architecture",
        description:
          "P314 is a decentralized security platform for Pi Network that combines AI-powered fraud detection with community-driven verification.",
        keyFeatures: [
          "AI Chatbot for security education and fraud detection",
          "Community-based fraud report verification (3-validator consensus)",
          "Reputation-based reward system with 4 user levels",
          "Referral system with lifetime 5% commission",
          "Bug bounty program for novel fraud pattern discovery",
          "Admin revenue management with automated commission tracking",
        ],
      },
      journey: {
        title: "Complete User Journey",
        stages: [
          {
            name: "1. Registration",
            description: "User authenticates with Pi Network SDK",
            actions: ["Pi Network OAuth authentication", "Account creation in database", "Beginner level assigned"],
          },
          {
            name: "2. Exploration",
            description: "User interacts with AI chatbot",
            actions: [
              "Ask security questions",
              "Learn about Pi Network scams",
              "Build reputation (+1 point per login)",
            ],
          },
          {
            name: "3. Contribution",
            description: "User participates in fraud prevention",
            actions: [
              "Submit fraud reports (wallet/link/behavior)",
              "Share referral link to earn commission",
              "Discover novel fraud patterns for bounty",
            ],
          },
          {
            name: "4. Validation (Investigator+)",
            description: "Users with 100+ reputation become validators",
            actions: [
              "Review 3 fraud reports assigned randomly",
              "Vote: Fraud Confirmed or Safe",
              "Earn 1 π for correct consensus (minus 10% admin fee)",
              "Lose 5 reputation for incorrect verdict",
            ],
          },
          {
            name: "5. Rewards & Growth",
            description: "Continuous passive income and level progression",
            actions: [
              "Monthly reputation mining rewards",
              "Referral commission on all activities",
              "NFT staking rewards (Expert+ level)",
              "Governance voting rights (Master level)",
            ],
          },
        ],
      },
      modules: {
        title: "Module Interconnectivity",
        description: "All P314 modules are fully integrated and synchronized in real-time:",
        modules: [
          {
            name: "Reputation System",
            icon: "award",
            description: "Central hub that connects all activities",
            connections: [
              "Receives points from fraud reports, validations, referrals",
              "Auto-updates user level based on points (100/500/2000 thresholds)",
              "Triggers bonuses and multipliers for higher levels",
              "Syncs with wallet_balance for Pi rewards",
            ],
          },
          {
            name: "Verification System",
            icon: "shield",
            description: "3-validator consensus mechanism",
            connections: [
              "Selects 3 random Investigators from reputation system",
              "Excludes reporter to prevent self-validation",
              "Calculates consensus (2 out of 3 agreement)",
              "Distributes rewards/penalties via reputation system",
              "Deducts 10% commission to admin treasury",
              "Triggers 5% referral commission to referrer",
            ],
          },
          {
            name: "Referral System",
            icon: "share",
            description: "Lifetime commission tracking",
            connections: [
              "Generates unique referral link per user",
              "Tracks signups and activates on first real activity",
              "Pays 5% of ALL referred user earnings forever",
              "Commission paid by platform, not deducted from user",
              "Updates referrer's wallet_balance automatically",
            ],
          },
          {
            name: "Bug Bounty System",
            icon: "bug",
            description: "Novel fraud pattern rewards",
            connections: [
              "Admin reviews and approves submissions",
              "Awards 10 π + 50 reputation on approval",
              "Automatically adds keywords to AI detection",
              "Sends instant notification to reporter",
              "Logs payout in admin revenue tracking",
            ],
          },
          {
            name: "Admin Revenue System",
            icon: "wallet",
            description: "Platform commission management",
            connections: [
              "Receives 10% from all validator rewards",
              "Receives 5% from all withdrawal requests",
              "Receives 100% from premium services (future)",
              "Tracks all transactions by type and source",
              "Provides real-time treasury dashboard",
            ],
          },
        ],
      },
      financial: {
        title: "Financial Logic & Fund Flow",
        description: "Complete monetary flow from users to admin treasury:",
        flows: [
          {
            name: "Validator Rewards Flow",
            steps: [
              "User submits fraud report → Assigned to 3 validators",
              "Validators vote → Consensus reached (2/3 agree)",
              "Base reward: 1.0 π per correct validator",
              "Admin commission: 0.1 π (10%) → Admin Treasury",
              "Net validator reward: 0.9 π → Validator wallet_balance",
              "Referral commission: 0.045 π (5% of 0.9) → Referrer (if exists)",
              "Result: Admin earns 0.1 π, Validator earns 0.9 π, Referrer earns 0.045 π",
            ],
          },
          {
            name: "Withdrawal Fee Flow",
            steps: [
              "User requests withdrawal of 100 π",
              "Withdrawal fee: 5 π (5%) → Admin Treasury",
              "Net payout: 95 π → User's Pi Wallet",
              "Transaction logged in withdrawal_requests table",
            ],
          },
          {
            name: "Bug Bounty Flow",
            steps: [
              "User submits novel fraud pattern",
              "Admin reviews and approves",
              "Platform pays: 10 π → User wallet_balance",
              "Platform pays: 50 reputation → User reputation_points",
              "AI training: Keywords added to fraud_detection_keywords",
              "Logged as bounty_payout in admin transactions",
            ],
          },
          {
            name: "Referral Commission Flow",
            steps: [
              "Referred user (UserB) earns 1.0 π from validation",
              "Referrer (UserA) auto-receives: 0.05 π (5% of 1.0)",
              "Commission paid by platform, NOT deducted from UserB",
              "Logged in referral_commissions table",
              "Added to UserA's wallet_balance immediately",
              "Works for ALL activities: validations, reports, bounties",
            ],
          },
        ],
        adminRevenue: {
          title: "Admin Treasury Breakdown",
          sources: [
            "Validator Commissions (10%): Primary revenue from validation ecosystem",
            "Withdrawal Fees (5%): User cashout processing fees",
            "Premium Services (100%): Future feature for external projects",
            "Bug Bounty Costs (-): Platform investment in security improvement",
          ],
        },
      },
      roadmap: {
        title: "P314 Project Roadmap",
        completed: {
          title: "✅ Phase 1: Foundation (Completed)",
          features: [
            "Pi Network authentication integration",
            "AI chatbot with security knowledge base",
            "Fraud reporting system",
            "Basic user reputation tracking",
            "Multi-language support (10 languages)",
          ],
        },
        current: {
          title: "🚀 Phase 2: Gamification & Monetization (Current)",
          features: [
            "✅ 3-validator verification system",
            "✅ Reputation-based user levels (Beginner → Master)",
            "✅ Referral system with lifetime 5% commission",
            "✅ Bug bounty program for fraud discovery",
            "✅ Admin revenue system with treasury",
            "✅ Wallet authentication for Pi payouts",
            "🔄 Monthly reputation mining rewards",
            "🔄 NFT reputation staking system",
          ],
        },
        upcoming: {
          title: "🔮 Phase 3: Expansion (Q1-Q2 2025)",
          features: [
            "Premium verification services for external projects",
            "Governance voting for Master-level users",
            "Mobile app (iOS/Android) with push notifications",
            "Advanced AI training from bug bounty submissions",
            "Community channels with E2EE messaging",
            "Fraud wallet database with API access",
          ],
        },
        vision: {
          title: "🌟 Long-Term Vision",
          goals: [
            "Become the #1 security platform for Pi Network ecosystem",
            "Build largest decentralized fraud detection database",
            "Empower 100,000+ Digital Investigators",
            "Generate sustainable revenue for platform growth",
            "Establish partnerships with Pi Network projects",
          ],
        },
      },
    },
    ar: {
      title: "توثيق النظام",
      sections: {
        overview: "نظرة عامة",
        journey: "رحلة المستخدم",
        modules: "الترابط بين الوحدات",
        financial: "المنطق المالي",
        roadmap: "خارطة الطريق",
      },
      overview: {
        title: "هندسة نظام P314",
        description:
          "P314 هي منصة أمان لامركزية لشبكة Pi تجمع بين الكشف عن الاحتيال بالذكاء الاصطناعي والتحقق المجتمعي.",
        keyFeatures: [
          "بوت ذكاء اصطناعي للتعليم الأمني وكشف الاحتيال",
          "التحقق من تقارير الاحتيال بواسطة المجتمع (إجماع 3 محققين)",
          "نظام مكافآت قائم على السمعة مع 4 مستويات مستخدم",
          "نظام إحالة مع عمولة 5% مدى الحياة",
          "برنامج مكافآت لاكتشاف أنماط احتيال جديدة",
          "إدارة إيرادات الإدارة مع تتبع العمولات التلقائي",
        ],
      },
      journey: {
        title: "رحلة المستخدم الكاملة",
        stages: [
          {
            name: "1. التسجيل",
            description: "يسجل المستخدم باستخدام Pi Network SDK",
            actions: ["مصادقة Pi Network OAuth", "إنشاء حساب في قاعدة البيانات", "تعيين مستوى المبتدئ"],
          },
          {
            name: "2. الاستكشاف",
            description: "يتفاعل المستخدم مع البوت الذكي",
            actions: [
              "طرح أسئلة أمنية",
              "التعرف على عمليات الاحتيال في Pi Network",
              "بناء السمعة (+1 نقطة لكل تسجيل دخول)",
            ],
          },
          {
            name: "3. المساهمة",
            description: "يشارك المستخدم في منع الاحتيال",
            actions: [
              "تقديم تقارير احتيال (محفظة/رابط/سلوك)",
              "مشاركة رابط الإحالة لكسب عمولة",
              "اكتشاف أنماط احتيال جديدة للحصول على مكافأة",
            ],
          },
          {
            name: "4. التحقق (محقق+)",
            description: "المستخدمون الذين لديهم 100+ سمعة يصبحون محققين",
            actions: [
              "مراجعة 3 تقارير احتيال تم تعيينها عشوائياً",
              "التصويت: احتيال مؤكد أو آمن",
              "ربح 1 π للإجماع الصحيح (ناقص 10% رسوم إدارية)",
              "خسارة 5 نقاط سمعة للحكم الخاطئ",
            ],
          },
          {
            name: "5. المكافآت والنمو",
            description: "دخل سلبي مستمر وتقدم في المستوى",
            actions: [
              "مكافآت تعدين السمعة الشهرية",
              "عمولة الإحالة على جميع الأنشطة",
              "مكافآت رهن NFT (مستوى خبير+)",
              "حقوق التصويت على الحوكمة (مستوى الماجستير)",
            ],
          },
        ],
      },
      modules: {
        title: "الترابط بين الوحدات",
        description: "جميع وحدات P314 متكاملة ومتزامنة في الوقت الفعلي:",
        modules: [
          {
            name: "نظام السمعة",
            icon: "award",
            description: "المحور المركزي الذي يربط جميع الأنشطة",
            connections: [
              "يستقبل النقاط من تقارير الاحتيال والتحققات والإحالات",
              "يحدث مستوى المستخدم تلقائياً بناءً على النقاط (عتبات 100/500/2000)",
              "يُطلق المكافآت والمضاعفات للمستويات الأعلى",
              "يتزامن مع wallet_balance لمكافآت Pi",
            ],
          },
          {
            name: "نظام التحقق",
            icon: "shield",
            description: "آلية إجماع 3 محققين",
            connections: [
              "يختار 3 محققين عشوائيين من نظام السمعة",
              "يستبعد المبلغ لمنع التحقق الذاتي",
              "يحسب الإجماع (اتفاق 2 من 3)",
              "يوزع المكافآت/العقوبات عبر نظام السمعة",
              "يخصم عمولة 10% لخزينة الإدارة",
              "يُطلق عمولة إحالة 5% للمُحيل",
            ],
          },
          {
            name: "نظام الإحالة",
            icon: "share",
            description: "تتبع العمولة مدى الحياة",
            connections: [
              "يولد رابط إحالة فريد لكل مستخدم",
              "يتتبع التسجيلات ويفعل عند أول نشاط حقيقي",
              "يدفع 5% من جميع أرباح المستخدم المحال إلى الأبد",
              "العمولة تدفع من المنصة، وليس من المستخدم",
              "يحدث wallet_balance للمُحيل تلقائياً",
            ],
          },
          {
            name: "نظام مكافآت الثغرات",
            icon: "bug",
            description: "مكافآت أنماط الاحتيال الجديدة",
            connections: [
              "الإدارة تراجع وتوافق على التقديمات",
              "تمنح 10 π + 50 سمعة عند الموافقة",
              "يضيف الكلمات المفتاحية تلقائياً للكشف بالذكاء الاصطناعي",
              "يرسل إشعار فوري للمبلغ",
              "يسجل الدفع في تتبع إيرادات الإدارة",
            ],
          },
          {
            name: "نظام إيرادات الإدارة",
            icon: "wallet",
            description: "إدارة عمولات المنصة",
            connections: [
              "يستقبل 10% من جميع مكافآت المحققين",
              "يستقبل 5% من جميع طلبات السحب",
              "يستقبل 100% من الخدمات المميزة (مستقبلاً)",
              "يتتبع جميع المعاملات حسب النوع والمصدر",
              "يوفر لوحة خزينة في الوقت الفعلي",
            ],
          },
        ],
      },
      financial: {
        title: "المنطق المالي وتدفق الأموال",
        description: "التدفق النقدي الكامل من المستخدمين إلى خزينة الإدارة:",
        flows: [
          {
            name: "تدفق مكافآت المحققين",
            steps: [
              "المستخدم يقدم تقرير احتيال ← يُعين إلى 3 محققين",
              "المحققون يصوتون ← يتم التوصل إلى إجماع (2/3 يوافقون)",
              "المكافأة الأساسية: 1.0 π لكل محقق صحيح",
              "عمولة الإدارة: 0.1 π (10%) ← خزينة الإدارة",
              "صافي مكافأة المحقق: 0.9 π ← wallet_balance المحقق",
              "عمولة الإحالة: 0.045 π (5% من 0.9) ← المُحيل (إن وجد)",
              "النتيجة: الإدارة تربح 0.1 π، المحقق يربح 0.9 π، المُحيل يربح 0.045 π",
            ],
          },
          {
            name: "تدفق رسوم السحب",
            steps: [
              "المستخدم يطلب سحب 100 π",
              "رسوم السحب: 5 π (5%) ← خزينة الإدارة",
              "صافي الدفع: 95 π ← محفظة Pi للمستخدم",
              "المعاملة مسجلة في جدول withdrawal_requests",
            ],
          },
          {
            name: "تدفق مكافآت الثغرات",
            steps: [
              "المستخدم يقدم نمط احتيال جديد",
              "الإدارة تراجع وتوافق",
              "المنصة تدفع: 10 π ← wallet_balance المستخدم",
              "المنصة تدفع: 50 سمعة ← reputation_points المستخدم",
              "تدريب الذكاء الاصطناعي: الكلمات المفتاحية تُضاف إلى fraud_detection_keywords",
              "مسجلة كـ bounty_payout في معاملات الإدارة",
            ],
          },
          {
            name: "تدفق عمولة الإحالة",
            steps: [
              "المستخدم المحال (UserB) يربح 1.0 π من التحقق",
              "المُحيل (UserA) يستقبل تلقائياً: 0.05 π (5% من 1.0)",
              "العمولة تدفع من المنصة، وليس من UserB",
              "مسجلة في جدول referral_commissions",
              "تُضاف إلى wallet_balance لـ UserA فوراً",
              "تعمل لجميع الأنشطة: التحققات، التقارير، المكافآت",
            ],
          },
        ],
        adminRevenue: {
          title: "تفصيل خزينة الإدارة",
          sources: [
            "عمولات المحققين (10%): الإيرادات الأساسية من نظام التحقق",
            "رسوم السحب (5%): رسوم معالجة سحب المستخدم",
            "الخدمات المميزة (100%): ميزة مستقبلية للمشاريع الخارجية",
            "تكاليف مكافآت الثغرات (-): استثمار المنصة في تحسين الأمان",
          ],
        },
      },
      roadmap: {
        title: "خارطة طريق مشروع P314",
        completed: {
          title: "✅ المرحلة 1: الأساس (مكتمل)",
          features: [
            "تكامل مصادقة Pi Network",
            "بوت ذكاء اصطناعي مع قاعدة معرفة أمنية",
            "نظام الإبلاغ عن الاحتيال",
            "تتبع السمعة الأساسي للمستخدم",
            "دعم متعدد اللغات (10 لغات)",
          ],
        },
        current: {
          title: "🚀 المرحلة 2: التلعيب والربح (حالياً)",
          features: [
            "✅ نظام التحقق من 3 محققين",
            "✅ مستويات المستخدم القائمة على السمعة (مبتدئ → ماجستير)",
            "✅ نظام الإحالة مع عمولة 5% مدى الحياة",
            "✅ برنامج مكافآت لاكتشاف الاحتيال",
            "✅ نظام إيرادات الإدارة مع الخزينة",
            "✅ مصادقة المحفظة لدفعات Pi",
            "🔄 مكافآت تعدين السمعة الشهرية",
            "🔄 نظام رهن NFT للسمعة",
          ],
        },
        upcoming: {
          title: "🔮 المرحلة 3: التوسع (Q1-Q2 2025)",
          features: [
            "خدمات التحقق المميزة للمشاريع الخارجية",
            "التصويت على الحوكمة لمستخدمي الماجستير",
            "تطبيق الجوال (iOS/Android) مع إشعارات الدفع",
            "تدريب متقدم للذكاء الاصطناعي من تقديمات مكافآت الثغرات",
            "قنوات مجتمعية مع رسائل E2EE",
            "قاعدة بيانات محافظ الاحتيال مع وصول API",
          ],
        },
        vision: {
          title: "🌟 الرؤية طويلة المدى",
          goals: [
            "أن نصبح منصة الأمان رقم 1 لنظام Pi Network البيئي",
            "بناء أكبر قاعدة بيانات لامركزية لكشف الاحتيال",
            "تمكين أكثر من 100,000 محقق رقمي",
            "توليد إيرادات مستدامة لنمو المنصة",
            "إقامة شراكات مع مشاريع Pi Network",
          ],
        },
      },
    },
  }

  const c = content[language]
  const s = c.sections

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <BookOpen size={18} className="sm:w-5 sm:h-5" />
          {c.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4" dir={isRTL ? "rtl" : "ltr"}>
        {/* Section Tabs */}
        <div className="flex gap-1 sm:gap-2 border-b pb-2 mb-4 overflow-x-auto scrollbar-hide">
          {Object.entries(s).map(([key, label]) => (
            <Button
              key={key}
              variant={activeSection === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(key as any)}
              style={activeSection === key ? { backgroundColor: COLORS.PRIMARY } : {}}
              className="flex-shrink-0 text-xs sm:text-sm"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.PRIMARY }}>
                {c.overview.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">{c.overview.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <div className="space-y-2">
                {c.overview.keyFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: COLORS.PRIMARY }}
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Journey Section */}
        {activeSection === "journey" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4" style={{ color: COLORS.PRIMARY }}>
              {c.journey.title}
            </h3>
            {c.journey.stages.map((stage, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-semibold mb-1">{stage.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                <ul className="space-y-1">
                  {stage.actions.map((action, j) => (
                    <li key={j} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Modules Section */}
        {activeSection === "modules" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.PRIMARY }}>
                {c.modules.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">{c.modules.description}</p>
            </div>
            {c.modules.modules.map((module, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  {module.icon === "award" && <Award size={18} className="text-purple-600" />}
                  {module.icon === "shield" && <Shield size={18} className="text-blue-600" />}
                  {module.icon === "share" && <Share2 size={18} className="text-green-600" />}
                  {module.icon === "bug" && <Bug size={18} className="text-orange-600" />}
                  {module.icon === "wallet" && <Wallet size={18} className="text-indigo-600" />}
                  <h4 className="font-semibold">{module.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                <ul className="space-y-1">
                  {module.connections.map((conn, j) => (
                    <li key={j} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      {conn}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Financial Logic Section */}
        {activeSection === "financial" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.PRIMARY }}>
                {c.financial.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">{c.financial.description}</p>
            </div>
            {c.financial.flows.map((flow, i) => (
              <div key={i} className="border rounded-lg p-3 bg-green-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  {flow.name}
                </h4>
                <div className="space-y-1">
                  {flow.steps.map((step, j) => (
                    <div key={j} className="text-xs text-gray-700 pl-2 py-0.5">
                      {j + 1}. {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="border rounded-lg p-3 bg-purple-50">
              <h4 className="font-semibold mb-2">{c.financial.adminRevenue.title}</h4>
              <ul className="space-y-1">
                {c.financial.adminRevenue.sources.map((source, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-purple-600">→</span>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Roadmap Section */}
        {activeSection === "roadmap" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4" style={{ color: COLORS.PRIMARY }}>
              {c.roadmap.title}
            </h3>

            <div className="border rounded-lg p-3 bg-green-50">
              <h4 className="font-semibold mb-2">{c.roadmap.completed.title}</h4>
              <ul className="space-y-1">
                {c.roadmap.completed.features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-lg p-3 bg-blue-50">
              <h4 className="font-semibold mb-2">{c.roadmap.current.title}</h4>
              <ul className="space-y-1">
                {c.roadmap.current.features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-blue-600">{f.startsWith("✅") ? "✓" : "⋯"}</span>
                    {f.replace(/^(✅|🔄)\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-lg p-3 bg-purple-50">
              <h4 className="font-semibold mb-2">{c.roadmap.upcoming.title}</h4>
              <ul className="space-y-1">
                {c.roadmap.upcoming.features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-purple-600">→</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-lg p-3 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h4 className="font-semibold mb-2">{c.roadmap.vision.title}</h4>
              <ul className="space-y-1">
                {c.roadmap.vision.goals.map((g, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-orange-600">★</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
