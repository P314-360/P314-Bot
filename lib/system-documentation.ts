export const SYSTEM_DOCUMENTATION = {
  en: {
    overview: {
      title: "P314 System Architecture",
      description: "Comprehensive guide to P314's decentralized security platform",
      sections: [
        {
          id: "user-journey",
          title: "User Journey",
          content: `
**New User Registration**
1. User authenticates via Pi SDK (username + UID)
2. System creates account with default reputation (0 points, Beginner level)
3. Optional: User receives referral code from existing user
4. User completes onboarding and can start using the bot

**Earning Reputation & Rewards**
1. **Submit Fraud Reports** (+10 reputation, +0.5 Pi)
2. **Validate Reports as Investigator** (+5 reputation, +0.3 Pi per correct review)
3. **Complete Daily Login** (+1 reputation)
4. **Refer Friends** (+5 reputation, +1 Pi, plus 5% lifetime commission)
5. **Discover Novel Fraud Patterns** (+50 reputation, +10 Pi bounty)

**Progression Path**
- **Beginner (0-99 points)**: Basic reporting, chat access
- **Investigator (100-499 points)**: Unlock report validation, earn from reviews
- **Expert (500-1999 points)**: Create channels, NFT staking, 25% bonus on rewards
- **Master (2000+ points)**: Governance voting, priority support, 50% bonus on rewards
          `,
        },
        {
          id: "3-investigator-rule",
          title: "3-Investigator Consensus System",
          content: `
**How Report Verification Works**

When a user submits a fraud report:

1. **Assignment**: System randomly selects 3 Investigators (users with 100+ reputation)
2. **Review**: Each investigator independently reviews evidence and votes:
   - "Fraud Confirmed" 🚨
   - "Safe" ✅
3. **Consensus**: Report is finalized when 2 out of 3 investigators agree
4. **Rewards Distribution**:
   - ✅ **Correct Investigators**: Receive +1 Pi each (minus 10% admin commission)
   - ❌ **Incorrect Investigator**: Loses -5 reputation points
5. **Referral Bonus**: Each rewarded investigator's referrer gets 5% commission

**Anti-Gaming Protections**
- Users cannot review their own reports
- Validators are randomly assigned
- Pattern detection flags suspicious voting behavior
          `,
        },
        {
          id: "admin-revenue",
          title: "Financial Flow & Admin Revenue",
          content: `
**Revenue Streams**

1. **Validator Commissions (10%)**
   - Deducted from investigator rewards
   - Example: Investigator earns 1 Pi → Admin gets 0.1 Pi, Investigator receives 0.9 Pi

2. **Withdrawal Fees (5%)**
   - Applied when users withdraw earnings to Pi wallet
   - Example: User withdraws 100 Pi → Admin gets 5 Pi, User receives 95 Pi

3. **Premium Services (100%)**
   - External projects can purchase verification services
   - All fees go directly to admin treasury

**Fund Flow Diagram**
\`\`\`
User Activity → Gross Reward
       ↓
   10% Commission → Admin Treasury
       ↓
   90% Net Reward → User Wallet Balance
       ↓
   5% Referral → Referrer (platform bonus, not deducted from user)
\`\`\`

**Admin Treasury Dashboard**
- Real-time balance tracking
- Breakdown by revenue source
- Adjustable commission rates
- Withdrawal management
          `,
        },
        {
          id: "referral-system",
          title: "Referral System Mechanics",
          content: `
**How It Works**

1. **Generate Link**: User gets unique referral code (e.g., REF-ABC123)
2. **Share**: New users sign up using the link
3. **Activation**: Referral becomes "active" after first real activity (report/validation)
4. **Lifetime Commission**: Referrer earns 5% of ALL earnings by referred user, forever

**Commission Rules**
- ✅ **Does NOT reduce** referred user's earnings
- ✅ Platform adds 5% bonus on top of user's reward
- ✅ Multi-level tracking (referrer + sub-referrals)
- ✅ Real-time commission payment

**Example**
- User A refers User B
- User B validates a report → earns 1 Pi (full amount)
- Platform adds 0.05 Pi commission → User A receives 0.05 Pi
- User B never knows or loses anything
          `,
        },
        {
          id: "bug-bounty",
          title: "Bug Bounty System",
          content: `
**Discovering Novel Fraud Patterns**

1. **Submit Report**:
   - Title: Fraud method name
   - Description: Detailed explanation
   - Evidence: Screenshot or proof
   - Keywords: Key terms for detection

2. **Admin Review**:
   - Manual verification by platform owner (Axis2030)
   - Check if pattern is genuinely new

3. **If Approved**:
   - 🎁 **+50 Reputation Points**
   - 💰 **+10 Pi Bounty**
   - 🤖 **Keywords Added to AI Detection**
   - 🔔 **Instant Notification to Reporter**

4. **If Rejected**:
   - No penalty
   - Feedback provided
   - Can resubmit with improvements

**Impact**: Your discovery helps protect the entire Pi Network community!
          `,
        },
      ],
    },
    roadmap: {
      title: "P314 Development Roadmap",
      phases: [
        {
          phase: "Phase 1: Foundation ✅ COMPLETE",
          status: "completed",
          items: [
            "✅ Pi Network authentication integration",
            "✅ Basic AI chatbot with security knowledge",
            "✅ Fraud reporting system",
            "✅ User reputation tracking",
            "✅ Multi-language support (10 languages)",
            "✅ Dark/Light theme",
          ],
        },
        {
          phase: "Phase 2: Decentralization ✅ COMPLETE",
          status: "completed",
          items: [
            "✅ 3-Investigator consensus system",
            "✅ Validator rewards & penalties",
            "✅ Admin commission infrastructure",
            "✅ Referral system with lifetime commissions",
            "✅ Bug bounty program",
            "✅ NFT reputation staking (foundation)",
          ],
        },
        {
          phase: "Phase 3: Monetization 🚀 IN PROGRESS",
          status: "in_progress",
          items: [
            "✅ Pi wallet authentication",
            "✅ Withdrawal system with fee collection",
            "✅ Admin treasury dashboard",
            "🔄 Premium verification API for external projects",
            "🔄 Subscription tiers for advanced features",
            "⏳ Automated monthly reputation mining payouts",
          ],
        },
        {
          phase: "Phase 4: Advanced Features 📅 PLANNED",
          status: "planned",
          items: [
            "⏳ Reputation NFT marketplace",
            "⏳ Governance voting system",
            "⏳ AI-powered fraud pattern prediction",
            "⏳ Cross-chain wallet verification",
            "⏳ Mobile app (iOS & Android)",
            "⏳ Community moderation DAO",
          ],
        },
        {
          phase: "Phase 5: Ecosystem Growth 🎯 FUTURE",
          status: "future",
          items: [
            "⏳ Integration with major Pi dApps",
            "⏳ Enterprise security auditing services",
            "⏳ Decentralized knowledge base",
            "⏳ Machine learning fraud detection V2",
            "⏳ Global Pi Network safety alliance",
          ],
        },
      ],
    },
    modules: {
      title: "Module Interconnectivity",
      description: "How all systems work together",
      diagram: `
**System Architecture Diagram**

┌─────────────────────────────────────────────┐
│           USER INTERFACE LAYER               │
│  (Chat, Dashboard, Profile, Admin Panel)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         CORE BUSINESS LOGIC LAYER           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │  Reputation  │◄─┤   Referral   │       │
│  │    System    │  │    System    │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│  ┌──────▼───────┐  ┌──────▼───────┐       │
│  │ Verification │◄─┤    Admin     │       │
│  │   System     │  │   Revenue    │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│  ┌──────▼───────┐  ┌──────▼───────┐       │
│  │  Bug Bounty  │  │   Wallet     │       │
│  │   System     │  │  Connection  │       │
│  └──────────────┘  └──────────────┘       │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          DATABASE LAYER (PostgreSQL)         │
│  Users, Reports, Verifications, Treasury    │
└─────────────────────────────────────────────┘

**Data Flow Example: User Validates Report**
1. User clicks "Fraud Confirmed" on assigned report
2. Verification System records vote → Database
3. Check if 2/3 consensus reached
4. If YES:
   a. Admin Revenue: Deduct 10% commission
   b. Reputation System: Add +5 points, +0.9 Pi
   c. Referral System: Pay 5% to referrer (if exists)
   d. Update user level if threshold crossed
5. UI updates in real-time via hooks
      `,
    },
  },
  ar: {
    overview: {
      title: "بنية نظام P314",
      description: "دليل شامل لمنصة الأمان اللامركزية P314",
      sections: [
        {
          id: "user-journey",
          title: "رحلة المستخدم",
          content: `
**تسجيل مستخدم جديد**
1. المصادقة عبر Pi SDK (اسم المستخدم + UID)
2. النظام ينشئ حساب بسمعة افتراضية (0 نقطة، مستوى مبتدئ)
3. اختياري: المستخدم يحصل على كود إحالة من مستخدم موجود
4. المستخدم يكمل التأهيل ويمكنه البدء باستخدام البوت

**كسب السمعة والمكافآت**
1. **إرسال تقارير احتيال** (+10 سمعة، +0.5 باي)
2. **التحقق من التقارير كمحقق** (+5 سمعة، +0.3 باي لكل مراجعة صحيحة)
3. **تسجيل الدخول اليومي** (+1 سمعة)
4. **إحالة الأصدقاء** (+5 سمعة، +1 باي، بالإضافة إلى عمولة 5% مدى الحياة)
5. **اكتشاف أنماط احتيال جديدة** (+50 سمعة، +10 باي مكافأة)

**مسار التقدم**
- **مبتدئ (0-99 نقطة)**: تقارير أساسية، الوصول للدردشة
- **محقق (100-499 نقطة)**: فتح التحقق من التقارير، الربح من المراجعات
- **خبير (500-1999 نقطة)**: إنشاء قنوات، رهن NFT، مكافأة 25% على المكافآت
- **خبير متقدم (2000+ نقطة)**: التصويت على الحوكمة، دعم أولوي، مكافأة 50%
          `,
        },
        {
          id: "3-investigator-rule",
          title: "نظام إجماع الـ 3 محققين",
          content: `
**كيف يعمل التحقق من التقارير**

عندما يرسل مستخدم تقرير احتيال:

1. **التعيين**: النظام يختار عشوائياً 3 محققين (مستخدمين لديهم 100+ سمعة)
2. **المراجعة**: كل محقق يراجع الأدلة ويصوت بشكل مستقل:
   - "احتيال مؤكد" 🚨
   - "آمن" ✅
3. **الإجماع**: يتم الانتهاء من التقرير عندما يوافق 2 من 3 محققين
4. **توزيع المكافآت**:
   - ✅ **المحققون الصحيحون**: يحصلون على +1 باي لكل واحد (بعد خصم 10% عمولة إدارية)
   - ❌ **المحقق الخاطئ**: يخسر -5 نقاط سمعة
5. **مكافأة الإحالة**: محيل كل محقق مكافأ يحصل على عمولة 5%

**الحماية ضد التلاعب**
- المستخدمون لا يمكنهم مراجعة تقاريرهم الخاصة
- المدققون يتم تعيينهم عشوائياً
- كشف الأنماط يضع علامة على السلوك المشبوه في التصويت
          `,
        },
        {
          id: "admin-revenue",
          title: "التدفق المالي وإيرادات الإدارة",
          content: `
**مصادر الإيرادات**

1. **عمولات المحققين (10%)**
   - تُخصم من مكافآت المحققين
   - مثال: محقق يربح 1 باي → الإدارة تحصل على 0.1 باي، المحقق يستلم 0.9 باي

2. **رسوم السحب (5%)**
   - تُطبق عندما يسحب المستخدمون أرباحهم إلى محفظة باي
   - مثال: مستخدم يسحب 100 باي → الإدارة تحصل على 5 باي، المستخدم يستلم 95 باي

3. **الخدمات المميزة (100%)**
   - المشاريع الخارجية يمكنها شراء خدمات التحقق
   - جميع الرسوم تذهب مباشرة لخزينة الإدارة

**مخطط تدفق الأموال**
\`\`\`
نشاط المستخدم → المكافأة الإجمالية
       ↓
   عمولة 10% → خزينة الإدارة
       ↓
   مكافأة صافية 90% → رصيد محفظة المستخدم
       ↓
   إحالة 5% → المُحيل (مكافأة المنصة، لا تُخصم من المستخدم)
\`\`\`

**لوحة تحكم خزينة الإدارة**
- تتبع الرصيد في الوقت الفعلي
- تفصيل حسب مصدر الإيرادات
- معدلات عمولة قابلة للتعديل
- إدارة السحوبات
          `,
        },
        {
          id: "referral-system",
          title: "آليات نظام الإحالة",
          content: `
**كيف يعمل**

1. **إنشاء الرابط**: المستخدم يحصل على كود إحالة فريد (مثل REF-ABC123)
2. **المشاركة**: المستخدمون الجدد يسجلون باستخدام الرابط
3. **التفعيل**: الإحالة تصبح "نشطة" بعد أول نشاط حقيقي (تقرير/تحقق)
4. **عمولة مدى الحياة**: المُحيل يربح 5% من جميع أرباح المستخدم المُحال، إلى الأبد

**قواعد العمولة**
- ✅ **لا تقلل** من أرباح المستخدم المُحال
- ✅ المنصة تضيف مكافأة 5% فوق مكافأة المستخدم
- ✅ تتبع متعدد المستويات (المُحيل + الإحالات الفرعية)
- ✅ دفع العمولة في الوقت الفعلي

**مثال**
- المستخدم A يحيل المستخدم B
- المستخدم B يتحقق من تقرير → يربح 1 باي (المبلغ الكامل)
- المنصة تضيف عمولة 0.05 باي → المستخدم A يستلم 0.05 باي
- المستخدم B لا يعرف أبداً أو يخسر أي شيء
          `,
        },
        {
          id: "bug-bounty",
          title: "نظام مكافأة الثغرات",
          content: `
**اكتشاف أنماط احتيال جديدة**

1. **إرسال التقرير**:
   - العنوان: اسم طريقة الاحتيال
   - الوصف: شرح تفصيلي
   - الأدلة: لقطة شاشة أو إثبات
   - الكلمات المفتاحية: مصطلحات رئيسية للكشف

2. **مراجعة الإدارة**:
   - التحقق اليدوي من قبل مالك المنصة (Axis2030)
   - التحقق مما إذا كان النمط جديد حقاً

3. **في حال الموافقة**:
   - 🎁 **+50 نقطة سمعة**
   - 💰 **+10 باي مكافأة**
   - 🤖 **إضافة الكلمات المفتاحية إلى كشف الذكاء الاصطناعي**
   - 🔔 **إشعار فوري للمُبلّغ**

4. **في حال الرفض**:
   - لا يوجد عقوبة
   - يتم تقديم ملاحظات
   - يمكن إعادة التقديم مع تحسينات

**التأثير**: اكتشافك يساعد في حماية مجتمع شبكة Pi بأكمله!
          `,
        },
      ],
    },
    roadmap: {
      title: "خارطة طريق تطوير P314",
      phases: [
        {
          phase: "المرحلة 1: الأساس ✅ مكتمل",
          status: "completed",
          items: [
            "✅ تكامل مصادقة شبكة Pi",
            "✅ بوت ذكاء اصطناعي أساسي مع معرفة أمنية",
            "✅ نظام الإبلاغ عن الاحتيال",
            "✅ تتبع سمعة المستخدم",
            "✅ دعم متعدد اللغات (10 لغات)",
            "✅ الوضع الداكن/الفاتح",
          ],
        },
        {
          phase: "المرحلة 2: اللامركزية ✅ مكتمل",
          status: "completed",
          items: [
            "✅ نظام إجماع الـ 3 محققين",
            "✅ مكافآت وعقوبات المدققين",
            "✅ البنية التحتية لعمولة الإدارة",
            "✅ نظام الإحالة مع عمولات مدى الحياة",
            "✅ برنامج مكافأة الثغرات",
            "✅ رهن سمعة NFT (الأساس)",
          ],
        },
        {
          phase: "المرحلة 3: تحقيق الدخل 🚀 قيد التقدم",
          status: "in_progress",
          items: [
            "✅ مصادقة محفظة Pi",
            "✅ نظام السحب مع تحصيل الرسوم",
            "✅ لوحة تحكم خزينة الإدارة",
            "🔄 واجهة برمجة التطبيقات للتحقق المميز للمشاريع الخارجية",
            "🔄 مستويات الاشتراك للميزات المتقدمة",
            "⏳ مدفوعات التعدين الشهرية التلقائية للسمعة",
          ],
        },
        {
          phase: "المرحلة 4: الميزات المتقدمة 📅 مخطط",
          status: "planned",
          items: [
            "⏳ سوق NFT للسمعة",
            "⏳ نظام التصويت على الحوكمة",
            "⏳ التنبؤ بأنماط الاحتيال بالذكاء الاصطناعي",
            "⏳ التحقق من المحفظة عبر السلاسل",
            "⏳ تطبيق الهاتف المحمول (iOS & Android)",
            "⏳ منظمة لا مركزية للإشراف المجتمعي",
          ],
        },
        {
          phase: "المرحلة 5: نمو النظام البيئي 🎯 مستقبلي",
          status: "future",
          items: [
            "⏳ التكامل مع تطبيقات Pi الرئيسية",
            "⏳ خدمات تدقيق الأمان للشركات",
            "⏳ قاعدة معرفة لا مركزية",
            "⏳ كشف الاحتيال بالتعلم الآلي الإصدار 2",
            "⏳ تحالف السلامة العالمي لشبكة Pi",
          ],
        },
      ],
    },
    modules: {
      title: "الترابط بين الوحدات",
      description: "كيف تعمل جميع الأنظمة معاً",
      diagram: `
**مخطط بنية النظام**

┌─────────────────────────────────────────────┐
│           طبقة واجهة المستخدم                │
│  (الدردشة، لوحة التحكم، الملف، لوحة الإدارة) │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         طبقة منطق الأعمال الأساسية          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │    نظام      │◄─┤    نظام     │       │
│  │   السمعة     │  │   الإحالة    │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│  ┌──────▼───────┐  ┌──────▼───────┐       │
│  │    نظام      │◄─┤   إيرادات   │       │
│  │   التحقق     │  │   الإدارة    │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│  ┌──────▼───────┐  ┌──────▼───────┐       │
│  │    مكافأة    │  │    ربط       │       │
│  │   الثغرات    │  │   المحفظة    │       │
│  └──────────────┘  └──────────────┘       │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          طبقة قاعدة البيانات (PostgreSQL)    │
│  المستخدمون، التقارير، التحققات، الخزينة     │
└─────────────────────────────────────────────┘

**مثال على تدفق البيانات: المستخدم يتحقق من تقرير**
1. المستخدم ينقر على "احتيال مؤكد" على التقرير المعين
2. نظام التحقق يسجل التصويت → قاعدة البيانات
3. التحقق مما إذا تم الوصول إلى إجماع 2/3
4. إذا نعم:
   أ. إيرادات الإدارة: خصم عمولة 10%
   ب. نظام السمعة: إضافة +5 نقاط، +0.9 باي
   ج. نظام الإحالة: دفع 5% للمُحيل (إذا كان موجوداً)
   د. تحديث مستوى المستخدم إذا تجاوز العتبة
5. واجهة المستخدم تتحدث في الوقت الفعلي عبر الخطافات
      `,
    },
  },
  // ... (remaining 8 languages would follow the same structure)
}
