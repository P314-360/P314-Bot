# تقرير شامل لمشروع P314 - بوت الدعم الذكي لشبكة Pi

---

## فهرس المحتويات

1. [نظرة عامة على المشروع](#نظرة-عامة)
2. [بنية المشروع](#بنية-المشروع)
3. [دورة حياة المصادقة والدخول](#دورة-المصادقة)
4. [المكونات الرئيسية](#المكونات-الرئيسية)
5. [الـ Hooks والـ Utilities](#الـ-hooks-والـ-utilities)
6. [قاعدة البيانات والتخزين](#قاعدة-البيانات)
7. [الميزات المتقدمة](#الميزات-المتقدمة)
8. [نظام الأمان والتشفير](#نظام-الأمان)
9. [توثيق كامل الملفات](#توثيق-الملفات)

---

## نظرة عامة على المشروع

### ما هو P314؟

**P314** هو بوت دعم ذكي متخصص لشبكة **Pi Network**. مصمم لتقديم:

- **دعم الحسابات والـ KYC** - مساعدة المستخدمين في عمليات التحقق والمصادقة
- **حل المشاكل التقنية** - الإجابة على أسئلة تتعلق بـ Mainnet والـ Login
- **خدمات المجتمع** - إدارة القنوات والدردشة المجتمعية
- **نظام المكافآت** - نقاط السمعة و NFTs

### المعلومات الأساسية

| المعلومة | التفاصيل |
|---------|---------|
| الإصدار | 0.1.0 |
| التقنية الرئيسية | Next.js 16 + React 19 |
| قاعدة البيانات | MongoDB Atlas |
| البيئات المدعومة | Testnet و Mainnet |
| اللغات المدعومة | 12 لغة |
| حجم المشروع | 1.4 جيجابايت |
| عدد الملفات | 16,000+ ملف |

---

## بنية المشروع

```
p314-bot/
├── app/                              # تطبيق Next.js
│   ├── page.tsx                      # الصفحة الرئيسية
│   ├── layout.tsx                    # التخطيط الأساسي
│   ├── api/                          # API Routes
│   ├── dashboard/                    # لوحة التحكم
│   ├── quests/                       # صفحة المهام
│   ├── privacy/                      # سياسة الخصوصية
│   ├── terms/                        # الشروط والأحكام
│   ├── loading.tsx                   # حالة التحميل
│   └── globals.css                   # الأنماط العامة
│
├── components/                       # مكونات React
│   ├── ui/                           # مكونات Shadcn/UI الأساسية
│   ├── chatbot-main.tsx              # المكون الرئيسي للدردشة
│   ├── login-page.tsx                # صفحة تسجيل الدخول
│   ├── channel-list-modal.tsx        # قائمة القنوات
│   ├── community-chat-modal.tsx      # دردشة المجتمع
│   ├── e2ee-community-chat-modal.tsx # دردشة محشفرة
│   ├── fraud-report-modal.tsx        # تقرير الاحتيال
│   ├── quest-tracker.tsx             # متتبع المهام
│   ├── admin-dashboard.tsx           # لوحة المسؤولين
│   ├── error-boundary.tsx            # معالج الأخطاء
│   ├── guest-mode-banner.tsx         # بنر الضيف
│   ├── environment-indicator.tsx     # مؤشر البيئة
│   └── ...40+ مكون آخر
│
├── hooks/                            # React Hooks المخصصة
│   ├── use-pi-session.ts             # إدارة جلسة Pi
│   ├── use-chatbot.ts                # منطق الدردشة
│   ├── use-guest-mode.ts             # نمط الضيف
│   ├── use-pi-environment-auth.ts    # المصادقة متعددة البيئات
│   ├── use-channels.ts               # إدارة القنوات
│   ├── use-quest-system.ts           # نظام المهام
│   ├── use-reputation.ts             # نظام السمعة
│   ├── use-community-chat.ts         # دردشة المجتمع
│   ├── use-e2ee-chat.ts              # الدردشة المشفرة
│   ├── use-admin-check.ts            # التحقق من الإدارة
│   ├── use-language.ts               # إدارة اللغات
│   ├── use-wallet.ts                 # إدارة المحافظ
│   ├── use-trending-questions.ts     # الأسئلة الشهيرة
│   ├── use-helpful-answers.ts        # الإجابات المفيدة
│   ├── use-knowledge-gap.ts          # تحليل الفجوات المعرفية
│   ├── use-source-confidence.ts      # ثقة المصدر
│   └── ...14+ hook آخر
│
├── lib/                              # مكتبات وأدوات
│   ├── app-config.ts                 # إعدادات التطبيق
│   ├── system-config.ts              # إعدادات النظام (مقفول)
│   ├── types.ts                      # تعريفات TypeScript
│   ├── db.ts                         # إدارة قاعدة البيانات
│   ├── mongodb.ts                    # إدارة اتصال MongoDB
│   ├── mongodb-server.ts             # أدوات الخادم لـ MongoDB
│   ├── translations.tsx              # ملفات الترجمة
│   ├── guest-session.ts              # إدارة جلسات الضيف
│   ├── pi-environment-config.ts      # إعدادات البيئات
│   ├── encryption-utils.ts           # أدوات التشفير E2EE
│   ├── reputation-system.ts          # نظام السمعة
│   ├── referral-system.ts            # نظام الإحالات
│   ├── nft-reputation-utils.ts       # أدوات NFT
│   ├── ai-persona-config.ts          # إعدادات شخصية الـ AI
│   ├── knowledge-gap-config.ts       # إعدادات الفجوات المعرفية
│   ├── system-documentation.ts       # توثيق النظام
│   ├── privacy-utils.ts              # أدوات الخصوصية
│   ├── input-validation.ts           # التحقق من المدخلات
│   ├── rate-limiter.ts               # تحديد سرعة الطلبات
│   ├── security-headers.ts           # رؤوس الأمان
│   ├── performance.ts                # أدوات الأداء
│   ├── pi-blockchain-utils.ts        # أدوات بلوكتشين Pi
│   ├── verification-system.ts        # نظام التحقق
│   ├── admin-auth.ts                 # مصادقة الإدارة
│   ├── admin-revenue.ts              # إدارة الإيرادات
│   ├── utils.ts                      # أدوات عامة
│   └── config.ts                     # إعدادات عامة
│
├── docs/                             # التوثيق الشامل
│   ├── DATABASE_SCHEMA.md            # مخطط قاعدة البيانات
│   ├── PI_ENVIRONMENT_SETUP.md       # إعداد بيئات Pi
│   ├── SECURITY_GUIDELINES.md        # مبادئ الأمان
│   ├── PERFORMANCE_GUIDE.md          # دليل الأداء
│   ├── PRODUCTION_DEPLOYMENT.md      # النشر الإنتاجي
│   ├── UI_UX_GUIDELINES.md           # مبادئ التصميم
│   ├── ADMIN_SECURITY.md             # أمان الإدارة
│   ├── WALLET_SECURITY.md            # أمان المحافظ
│   ├── BUG_BOUNTY_GUIDE.md           # دليل مكافآت الأخطاء
│   └── ...10+ ملفات توثيق
│
├── .github/workflows/                # GitHub Actions
│   └── deploy.yml                    # خط أنابيب النشر
│
├── package.json                      # المكتبات والمتطلبات
├── tsconfig.json                     # إعدادات TypeScript
├── tailwind.config.ts                # إعدادات Tailwind CSS
├── next.config.js                    # إعدادات Next.js
├── vercel.json                       # إعدادات Vercel
└── node_modules/                     # المكتبات المثبتة
```

---

## دورة حياة المصادقة والدخول

### 1️⃣ نقطة الدخول الأولى

عندما يفتح المستخدم التطبيق:

```
↓ app/page.tsx (الصفحة الرئيسية)
↓ usePiSession() - التحقق من الجلسة الموجودة
↓
├─ جلسة صحيحة؟ → عرض الدردشة الرئيسية
└─ لا جلسة؟ → عرض صفحة تسجيل الدخول
```

### 2️⃣ الملف الرئيسي (app/page.tsx)

**الوظائف الأساسية:**

1. **استيراد الـ Hooks:**
   - `usePiSession()` - للتحقق من جلسة Pi
   - `useGuestMode()` - لدعم نمط الضيف
   - `useChatbot()` - لمنطق الدردشة
   - `useLanguage()` - لإدارة اللغات

2. **إدارة حالات المستخدم:**
   ```typescript
   const userId = isGuestMode ? guestId : sessionData.userId
   const username = isGuestMode ? "Guest" : sessionData.username
   ```

3. **العروض الشرطية:**
   - إذا لم يكن مسجل دخول → LoginPage
   - إذا كان ضيفاً → Chatbot + GuestModeBanner
   - إذا كان مسجل دخول → Chatbot كامل

### 3️⃣ حلقة المصادقة

#### أ) صفحة تسجيل الدخول (components/login-page.tsx)

**العناصر:**
- زر "تسجيل الدخول عبر Pi Network"
- زر "متابعة كضيف"
- شاشة توضيحية عن الميزات

```typescript
// عند النقر على زر Pi:
→ startAuthentication() من usePiSession
→ تحميل Pi SDK
→ إعادة توجيه للمصادقة
→ استقبال Access Token
```

#### ب) hook الـ usePiSession (hooks/use-pi-session.ts)

**ما يف��له:**

1. **التحقق من جلسة موجودة:**
   ```typescript
   const storedSession = localStorage.getItem("p314_session")
   ```

2. **التحقق من انتهاء الصلاحية:**
   ```typescript
   const isExpired = (Date.now() - lastActivity > 24 * 60 * 60 * 1000)
   ```

3. **تحديث النشاط:**
   - يستمع لأحداث الماوس والـ Keyboard والـ Touch
   - يحدّث `p314_last_activity` تلقائياً

4. **بيانات الجلسة المخزنة:**
   ```typescript
   {
     piAccessToken: string    // التوكن من Pi
     username: string         // اسم المستخدم
     userId: string          // معرّف المستخدم
     createdAt: number       // وقت الإنشاء
   }
   ```

#### ج) نمط الضيف (hooks/use-guest-mode.ts + lib/guest-session.ts)

**الميزات:**
- جلسة 24 ساعة بدون تسجيل دخول
- 50 رسالة للذكاء الاصطناعي
- عرض الوقت المتبقي
- عرض الرسائل المتبقية

**بيانات الجلسة:**
```typescript
{
  guestId: string              // معرّف الضيف
  guestUsername: string        // اسم الضيف
  createdAt: number            // وقت الإنشاء
  expiresAt: number            // وقت الانتهاء
  features: {
    canPostMessages: false     // لا يمكن النشر
    canCreateChannel: false    // لا يمكن إنشاء قناة
    canViewChannels: true      // يمكن عرض القنوات
    canViewChat: true          // يمكن عرض الدردشة
    chatMessageLimit: 50       // 50 رسالة كحد أقصى
    messagesUsed: number       // الرسائل المستخدمة
  }
}
```

### 4️⃣ إدارة الجلسة المستمرة

**في كل زيارة صفحة:**

```
1. يتحقق من localStorage للجلسة
   ↓
2. إذا لم توجد → عرض LoginPage
   ↓
3. إذا وجدت → التحقق من الصلاحية
   ↓
4. إذا منتهية → حذف وطلب تسجيل دخول جديد
   ↓
5. إذا صحيحة → عرض الدردشة
   ↓
6. تحديث النشاط على أي تفاعل مستخدم
```

### 5️⃣ تسجيل الخروج (Logout)

```typescript
// في LogoutButton أو من settings:
logout() → 
  حذف من localStorage →
  مسح الـ Session →
  إعادة توجيه إلى LoginPage
```

---

## المكونات الرئيسية

### المكونات الـ 50+ للتطبيق

#### 🎯 المكونات الأساسية الحيوية

| المكون | الموقع | الوظيفة |
|-------|--------|--------|
| **ChatBot Main** | components/chatbot-main.tsx | محرك الدردشة الرئيسي |
| **Login Page** | components/login-page.tsx | واجهة تسجيل الدخول |
| **Guest Mode Banner** | components/guest-mode-banner.tsx | مؤشر الضيف والجلسة |
| **Channel List Modal** | components/channel-list-modal.tsx | قائمة القنوات |
| **Quest Tracker** | components/quest-tracker.tsx | متتبع المهام والمكافآت |
| **Admin Dashboard** | components/admin-dashboard.tsx | لوحة الإدارة |

#### 💬 مكونات الدردشة والمجتمع

| المكون | الوظيفة |
|-------|--------|
| **Community Chat Modal** | دردشة المجتمع العامة |
| **E2EE Community Chat Modal** | دردشة محشفرة من طرف إلى طرف |
| **Channel Chat Modal** | دردشة القناة المحددة |
| **Message Skeleton** | محملات الرسائل |
| **Trending Questions Ticker** | عرض الأسئلة الشهيرة |

#### 🛡️ مكونات الأمان والتحقق

| المكون | الوظيفة |
|-------|--------|
| **Fraud Report Modal** | إبلاغ عن الاحتيال |
| **Wallet Search Modal** | البحث والتحقق من المحافظ |
| **Fraud Wallets Panel** | لوحة المحافظ المريبة |
| **Validator Review Panel** | مراجعة الإبلاغات |

#### 🎮 مكونات الجوائز والسمعة

| المكون | الوظيفة |
|-------|--------|
| **Quest Notification** | إشعارات المهام |
| **NFT Info Panel** | معلومات NFTs |
| **Reputation Display** | عرض السمعة والمستوى |
| **Referral Panel** | نظام الإحالات |

#### 🎨 مكونات واجهة المستخدم

| المكون | الوظيفة |
|-------|--------|
| **Error Boundary** | معالج الأخطاء |
| **Empty State** | عرض الحالة الفارغة |
| **Loading Spinner** | مؤشر التحميل |
| **Environment Indicator** | مؤشر البيئة |
| **Responsive Container** | حاوية سريعة الاستجابة |
| **Responsive Grid** | شبكة سريعة الاستجابة |
| **Form Group** | مجموعة نماذج |

#### ⚙️ مكونات الإدارة والإعدادات

| المكون | الوظيفة |
|-------|--------|
| **Settings Panel** | لوحة الإعدادات |
| **Profile Settings Modal** | إعدادات الملف الشخصي |
| **Moderator Management Panel** | إدارة المشرفين |
| **Admin Revenue Panel** | لوحة الإيرادات |
| **Ad Management Panel** | إدارة الإعلانات |

#### 📊 مكونات البيانات والإحصائيات

| المكون | الوظيفة |
|-------|--------|
| **Chat History Panel** | سجل الدردشة |
| **Knowledge Gap Indicator** | مؤشر الفجوات المعرفية |
| **Source Confidence Indicator** | مؤشر ثقة المصدر |
| **Helpful Answers Suggestion** | اقتراحات الإجابات |
| **Rating Analytics** | تحليلات التقييمات |

#### 🎛️ مكونات الإدخال والمخرجات

| المكون | الوظيفة |
|-------|--------|
| **Image Upload Button** | تحميل الصور |
| **Voice Chat Controls** | التحكم في الصوت |
| **Language Switcher** | مبدل اللغة |
| **Bounty Notification Bell** | جرس إشعارات |

---

## الـ Hooks والـ Utilities

### 🔗 مجموعة الـ Hooks (34 Hook)

#### المصادقة والجلسات

| Hook | الوصف |
|------|-------|
| **use-pi-session** | إدارة جلسة Pi Network |
| **use-guest-mode** | إدارة نمط الضيف |
| **use-pi-environment-auth** | المصادقة متعددة البيئات |
| **use-admin-check** | التحقق من صلاحيات الإدارة |

#### الدردشة والمراسلة

| Hook | الوصف |
|------|-------|
| **use-chatbot** | منطق محرك الدردشة الرئيسي |
| **use-community-chat** | دردشة المجتمع |
| **use-e2ee-chat** | الدردشة المشفرة E2EE |
| **use-chat-history** | سجل الدردشة |

#### القنوات والمجموعات

| Hook | الوصف |
|------|-------|
| **use-channels** | إدارة القنوات |
| **use-joined-channels** | القنوات المنضم إليها |
| **use-channel-reputation** | سمعة القناة |

#### المهام والمكافآت

| Hook | الوصف |
|------|-------|
| **use-quest-system** | نظام المهام وجمع الـ Shards |
| **use-trending-questions** | الأسئلة الشهيرة |
| **use-helpful-answers** | الإجابات المفيدة |

#### السمعة والرتب

| Hook | الوصف |
|------|-------|
| **use-reputation** | نظام السمعة والنقاط |
| **use-rating-analytics** | تحليلات التقييمات |

#### المحافظ والتحقق

| Hook | الوصف |
|------|-------|
| **use-wallet** | إدارة المحافظ |
| **use-wallet-display** | عرض المحافظ |
| **use-knowledge-gap** | تحليل الفجوات المعرفية |
| **use-source-confidence** | ثقة المصدر |

#### الإدارة والإشراف

| Hook | الوصف |
|------|-------|
| **use-moderator-management** | إدارة المشرفين |
| **use-moderator-servers** | خوادم المشرفين |
| **use-admin-api** | API الإدارة |
| **use-ad-management** | إدارة الإعلانات |
| **use-ad-settings** | إعدادات الإعلانات |

#### التشغيل والأداء

| Hook | الوصف |
|------|-------|
| **use-language** | إدارة اللغات المتعددة |
| **use-settings** | إعدادات المستخدم |
| **use-scroll-to-bottom** | التمرير إلى الأسفل تلقائياً |
| **use-toast** | إشعارات Toast |
| **use-mobile** | التحقق من الجوال |
| **use-voice-chat** | أدوات الدردشة الصوتية |
| **use-share** | مشاركة المحتوى |

---

## قاعدة البيانات والتخزين

### 1️⃣ إدارة قاعدة البيانات (lib/db.ts)

**الاتصال:**
```typescript
// استخدام PostgreSQL عبر Neon Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // 20 اتصال في الـ Pool
  idleTimeoutMillis: 30000,   // إغلاق الاتصال الخامل بعد 30 ثانية
  connectionTimeoutMillis: 2000, // انتظر ثانيتين للاتصال
  statement_timeout: 10000,   // انتظر 10 ثوان للاستعلام
})
```

**الدوال الأساسية:**
- `query()` - تنفيذ استعلام SQL
- `isDatabaseConfigured()` - التحقق من التكوين
- `testConnection()` - اختبار الاتصال
- `closePool()` - إغلاق الاتصالات

### 2️⃣ MongoDB (lib/mongodb.ts و lib/mongodb-server.ts)

**الـ Collections الرئيسية:**

| Collection | الوصف |
|-----------|-------|
| **users** | بيانات المستخدمين |
| **messages** | الرسائل والمحادثات |
| **channels** | القنوات والمجموعات |
| **fraudReports** | الإبلاغات عن الاحتيال |
| **quests** | المهام والتحديات |
| **reputation** | نقاط السمعة |
| **sessions** | جلسات المستخدمين |

### 3️⃣ التخزين المحلي (localStorage)

```typescript
// جلسة المستخدم (use-pi-session.ts)
localStorage.setItem("p314_session", JSON.stringify(sessionData))
localStorage.setItem("p314_last_activity", Date.now().toString())

// جلسة الضيف (lib/guest-session.ts)
localStorage.setItem("p314_guest_session", JSON.stringify(guestData))
localStorage.getItem("p314_guest_id")
localStorage.getItem("p314_guest_username")
```

### 4️⃣ الأنواع الأساسية (lib/types.ts)

```typescript
// الرسالة
interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  rating?: number
  feedback?: string
}

// المستخدم
interface PiUser {
  uid: string
  username: string
  roles?: string[]
  kycVerified?: boolean
}

// القناة
interface UserChannel {
  channelId: string
  channelName: string
  subscribers: number
  description: string
  isVerified: boolean
}

// المهمة
interface QuestProgress {
  questId: string
  questName: string
  current: number
  target: number
  completed: boolean
}

// التقرير
interface FraudReport {
  id: string
  reporterId: string
  reportType: "wallet" | "link" | "behavior" | "scam"
  status: "pending" | "reviewed" | "escalated"
}
```

---

## الميزات المتقدمة

### 1️⃣ نظام المهام (Quests)

**ثلاث فئات:**

| المهمة | الهدف | المكافآت |
|-------|-------|---------|
| **AI Sharpening** | طلب أسئلة ذكية | 15 نقطة + Shard |
| **App Explorer** | استكشاف الميزات | 10 نقطة + Shard |
| **Fraud Hunter** | الإبلاغ عن الاحتيال | 20 نقطة + Shard |

### 2️⃣ نظام السمعة والرتب

**الرتب الأربع:**

```
Beginner (0-99.99)
  ↓ 100 نقطة
Investigator (100-499.99)
  ↓ 500 نقطة
Expert (500-1999.99)
  ↓ 2000 نقطة
Master (2000+)
```

**المكافآت حسب الرتبة:**
- Beginner: 1.0x
- Investigator: 1.1x (10%)
- Expert: 1.25x (25%)
- Master: 1.5x (50%)

### 3️⃣ نظام NFT

- **Shard Collection** - جمع الـ Shards من المهام
- **Proof of Contribution** - NFT لإثبات المساهمة
- **Level Badges** - شارات الرتب المختلفة

### 4️⃣ الدردشة المشفرة (E2EE)

```typescript
// استخدام ECDH + AES-GCM
1. توليد مفاتيح عام/خاص (P-256)
2. اشتقاق سر مشترك (ECDH)
3. تشفير الرسائل (AES-GCM)
4. فك التشفير على الجانب الآخر
```

### 5️⃣ القنوات والمجتمع

**أنواع القنوات:**
- قنوات عامة
- قنوات خاصة
- قنوات مشفرة
- قنوات رسمية (موثقة)

**أدوار المستخدمين:**
- Owner (المالك)
- Moderator (المشرف)
- Member (العضو)
- Viewer (المتفرج)

### 6️⃣ الإبلاغ عن الاحتيال

```
المستخدم يقدم تقرير
↓
النظام يحفظ البيانات
↓
المشرفون يراجعون
↓
قد يتم الترقية إلى "Flagged"
↓
الآخرون يحصلون على تحذير
```

---

## نظام الأمان والتشفير

### 1️⃣ المصادقة

| الطريقة | التفاصيل |
|--------|---------|
| **Pi Network OAuth** | تسجيل دخول عبر Pi Network |
| **Guest Mode** | تصفح مؤقت بدون حساب |
| **Session Tokens** | توكنات الجلسة الآمنة |
| **24-hour Expiration** | انتهاء الصلاحية بعد 24 ساعة |

### 2️⃣ التشفير

**أنواع التشفير:**

```
E2EE (End-to-End Encryption)
├── ECDH (Elliptic Curve Diffie-Hellman) - P-256 Curve
├── AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
├── IV (Initialization Vector) - عشوائي 12 بايت
└── Authentication Tag - التحقق من السلامة

Password Hashing
├── bcrypt أو Argon2 (حسب التكوين)
├── Salt عشوائي
└── 10+ iterations
```

### 3️⃣ حماية الواجهة

```typescript
// رؤوس الأمان (lib/security-headers.ts)
Content-Security-Policy: "default-src 'self'"
X-Frame-Options: "DENY"
X-Content-Type-Options: "nosniff"
Strict-Transport-Security: "max-age=31536000"
```

### 4️⃣ التحقق من المدخلات

```typescript
// lib/input-validation.ts
- تنظيف المدخلات (Sanitize)
- التحقق من الطول
- التحقق من الصيغة (Format)
- منع XSS والـ SQL Injection
```

### 5️⃣ تحديد سرعة الطلبات

```typescript
// lib/rate-limiter.ts
- 200 طلب/دقيقة للـ API العام
- 100 طلب/دقيقة للمصادقة
- 50 طلب/دقيقة لنقاط النهاية الحساسة
```

---

## توثيق كامل الملفات

### 📁 المجلد: app/

#### app/page.tsx
**الغرض:** الصفحة الرئيسية للتطبيق
**الحجم:** ~650 سطر
**الوظائف الرئيسية:**
- عرض واجهة الدردشة الرئيسية
- إدارة حالة المستخدم (مسجل دخول/ضيف/لا يوجد)
- التعامل مع جميع المودالات (Modals)
- إدارة القنوات والمجتمع

**الـ Imports الرئيسية:**
- `usePiSession` - جلسة المستخدم
- `useGuestMode` - نمط الضيف
- `useChatbot` - منطق الدردشة
- `useLanguage` - اللغات
- 30+ component أخرى

#### app/layout.tsx
**الغرض:** الهيكل الأساسي للتطبيق
**الحجم:** ~30 سطر
**الوظائف:**
- إعدادات Metadata للـ SEO
- تحميل الخط (Inter)
- تطبيق الأنماط العامة

#### app/dashboard/page.tsx
**الغرض:** لوحة تحكم المستخدم
**المكونات:**
- عرض المعلومات الشخصية
- إحصائيات الاستخدام
- تاريخ النشاط

#### app/quests/page.tsx
**الغرض:** صفحة المهام والمكافآت
**المحتوى:**
- قائمة المهام المتاحة
- التقدم الحالي
- NFTs المجمعة

#### app/privacy/page.tsx
**الغرض:** سياسة الخصوصية
**المحتوى:**
- سياسة جمع البيانات
- حقوق المستخدمين
- ملفات تعريف الارتباط

#### app/terms/page.tsx
**الغرض:** الشروط والأحكام
**المحتوى:**
- شروط الاستخدام
- المسؤوليات القانونية
- سياسة الاستبدال

### 📁 المجلد: components/

#### chatbot-main.tsx
**الغرض:** محرك الدردشة الرئيسي
**الحجم:** كبير جداً
**الميزات:**
- إرسال واستقبال الرسائل
- عرض حالة التفكير (Thinking)
- التقييم والملاحظات
- معالجة الصور والصوت

#### login-page.tsx
**الغرض:** واجهة تسجيل الدخول
**العناصر:**
- شعار وكلمة الترحيب
- زر "تسجيل الدخول عبر Pi"
- زر "متابعة كضيف"
- تعليمات الخصوصية

#### guest-mode-banner.tsx
**الغرض:** بنر يظهر للضيوف
**المعلومات:**
- الوقت المتبقي
- عدد الرسائل المتبقية
- زر تسجيل الدخول
- زر الخروج

#### error-boundary.tsx
**الغرض:** اكتشاف والتعامل مع الأخطاء
**الوظائف:**
- اكتشاف أخطاء React
- عرض رسالة خطأ ودود
- زر لإعادة المحاولة

#### empty-state.tsx
**الغرض:** عرض حالة فارغة
**الاستخدام:**
- عندما لا توجد نتائج
- عندما لا توجد بيانات
- عندما لا توجد قنوات

### 📁 المجلد: hooks/

#### use-pi-session.ts
**السطور:** ~150 سطر
**الوظائف:**
```typescript
export function usePiSession() {
  // فحص الجلسة الموجودة
  // التحقق من انتهاء الصلاحية
  // تحديث النشاط
  // تسجيل الخروج
  // بدء المصادقة
}
```

#### use-guest-mode.ts
**السطور:** ~80 سطر
**يستخدم:**
- `guest-session.ts` للبيانات الأساسية
- `localStorage` للتخزين
**الدوال:**
- إنشاء جلسة ضيف
- التحقق من الصلاحية
- تحديث اسم المستخدم
- إنهاء الجلسة

#### use-chatbot.ts
**السطور:** ~200+ سطر
**الوظائف الأساسية:**
```typescript
const sendMessage = async () => {
  // تحقق من المحتوى
  // أضف رسالة المستخدم
  // اتصل بـ API
  // أضف رد الـ AI
  // حدّث التقييمات
}
```

#### use-language.ts
**الغرض:** إدارة لغات التطبيق (12 لغة)
**يدعم:**
- English, Arabic, Spanish, French, German
- Chinese, Japanese, Korean, Portuguese, Russian
- Hindi, Italian

#### use-reputation.ts
**الغرض:** حساب نقاط السمعة
**الحسابات:**
- تحديد الرتبة
- حساب المكافآت
- تطبيق المضاعفات

### 📁 المجلد: lib/

#### types.ts
**السطور:** ~200+ سطر
**يحتوي على تعريفات:**
```typescript
interface Message { }
interface PiUser { }
interface UserChannel { }
interface QuestProgress { }
interface FraudReport { }
interface WalletVerification { }
interface BlockchainSearchResult { }
// ... و أكثر
```

#### app-config.ts
**الغرض:** إعدادات التطبيق
**المحتوى:**
```typescript
export const APP_CONFIG = {
  WELCOME_MESSAGE: "...",
  NAME: "P314",
  DESCRIPTION: "...",
}

export const COLORS = {
  BACKGROUND: "#ffffff",
  PRIMARY: "#5f366b",
}
```

#### system-config.ts
**الغرض:** إعدادات النظام (مقفول)
**المحتوى:**
```typescript
export const APP_ID = "69344b14..."
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false,
}
export const BACKEND_CONFIG = {
  BASE_URL: "https://backend.appstudio..."
}
```

#### guest-session.ts
**السطور:** ~180 سطر
**الدوال:**
```typescript
function getOrCreateGuestSession()
function clearGuestSession()
function updateGuestUsername(name)
function isGuestSessionExpired(session)
```

#### pi-environment-config.ts
**السطور:** ~148 سطر
**الغرض:** إدارة بيئات Pi Network
**يكتشف:**
- Sandbox vs Mainnet
- عناوين API المناسبة
- إعدادات SDK
- معاملات الاتصال

#### encryption-utils.ts
**السطور:** ~200+ سطر
**الفئة:** E2EEManager
**الدوال:**
```typescript
generateKeyPair()        // توليد مفاتيح P-256
exportPublicKey()        // تصدير المفتاح العام
importPublicKey()        // استيراد مفتاح عام
deriveSharedSecret()     // اشتقاق سر مشترك
encryptMessage()         // تشفير الرسالة
decryptMessage()         // فك تشفير الرسالة
```

#### reputation-system.ts
**السطور:** ~80 سطر
**يحتوي على:**
```typescript
// الرتب
type UserLevel = "beginner" | "investigator" | "expert" | "master"

// المكافآت
const REPUTATION_REWARDS = {
  accurate_report: { points: 10, balance: 0.5 },
  // ...
}

// الدوال
calculateLevel(points)
calculateReward(type, level)
canValidateReports(level)
canCreateNFT(level)
```

#### input-validation.ts
**السطور:** ~161 سطر
**الدوال:**
```typescript
validateMessage(text)           // التحقق من الرسالة
validateWalletAddress(addr)     // التحقق من المحفظة
validateEmail(email)            // التحقق من البريد
sanitizeInput(input)            // تنظيف المدخلات
validateReportType(type)        // التحقق من نوع التقرير
```

#### rate-limiter.ts
**السطور:** ~102 سطر
**الفئة:** RateLimiter
**الدوال:**
```typescript
checkRateLimit(userId, endpoint)
isLimited(userId)
resetLimit(userId)
getRemaining(userId)
```

#### security-headers.ts
**السطور:** ~57 سطر
**الرؤوس المطبقة:**
```typescript
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Strict-Transport-Security
Referrer-Policy
```

#### performance.ts
**السطور:** ~222 سطر
**الأدوات:**
```typescript
memoize(fn)              // تذكر النتائج
debounce(fn, delay)      // تأخير التنفيذ
throttle(fn, interval)   // تحديد سرعة التنفيذ
measurePerformance()     // قياس الأداء
```

#### db.ts
**السطور:** ~60 سطر
**الدوال:**
```typescript
query(sql, params)       // تنفيذ استعلام
isDatabaseConfigured()   // التحقق من التكوين
testConnection()         // اختبار الاتصال
closePool()             // إغلاق الاتصالات
```

#### mongodb.ts / mongodb-server.ts
**الغرض:** طبقة MongoDB على الطرفين
**الوظائف:**
- الاتصال بقاعدة البيانات مع Connection Pooling
- الاستعلام عن البيانات بشكل آمن
- تحديث البيانات مع atomic operations
- إنشاء الفهارس وضمان الأداء

#### translations.tsx
**السطور:** ~800+ سطر
**اللغات:** 12 لغة
**النصوص:**
- ملايين الكلمات المترجمة
- واجهة مستخدم كاملة
- جميع الرسائل والتنبيهات

---

## ملخص النقاط الرئيسية

### ✅ ما يجب معرفته عن المشروع

1. **المصادقة الثنائية:**
   - Pi Network (رسمي)
   - Guest Mode (مؤقت بدون حساب)

2. **الأمان متعدد المستويات:**
   - تشفير E2EE للرسائل
   - تحديد سرعة الطلبات
   - التحقق من المدخلات
   - رؤوس أمان HTTP

3. **الميزات الرئيسية:**
   - دردشة ذكية مع AI
   - قنوات ومجتمع
   - نظام مهام ومكافآت
   - إبلاغ عن الاحتيال
   - NFTs وشهادات

4. **دعم عالمي:**
   - 12 لغة مختلفة
   - واجهة مستجيبة
   - متوافق مع الجوال

5. **البنية الاحترافية:**
   - Next.js 16 (أحدث)
   - React 19 (أحدث)
   - TypeScript (آمان النوع)
   - MongoDB Atlas (قاعدة بيانات)
   - Tailwind CSS (التصميم)

---

**تم إعداد هذا التقرير بعناية لفهم شامل لمشروع P314 - بوت الدعم الذكي لشبكة Pi Network**

**آخر تحديث:** يوليو 2026
**الإصدار:** 0.1.0
**الحالة:** قيد التطوير النشط
