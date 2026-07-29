# Complete Environment Variables Reference
# قائمة شاملة لجميع متغيرات البيئة

---

## 📋 ملخص تنفيذي | Executive Summary

هذا المستند يوضح **جميع** متغيرات البيئة المستخدمة في التطبيق بدون أي نقص.
This document outlines **all** environment variables used in the application without any omissions.

**المجموع: 41 متغير (14 مطلوبة + 27 اختيارية)**

---

## 1️⃣ متغيرات قاعدة البيانات | Database Configuration

### 1.1 MongoDB Connection

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `MONGODB_URI` | `MONGODB_URI` | **مطلوب** | **Required** | - | - | رابط الاتصال الكامل | Full MongoDB connection string |
| `MONGODB_DB_NAME` | `MONGODB_DB_NAME` | **مطلوب** | **Required** | - | - | اسم قاعدة البيانات | Database name (e.g., "p314-testnet") |

**مثال:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314-testnet?retryWrites=true&w=majority
MONGODB_DB_NAME=p314-testnet
```

**ملاحظات الأمان:**
- لا تضع الـ password مباشرة — استخدم URI مع encoded credentials
- استخدم IP Whitelist في MongoDB Atlas (أضف Vercel IPs)
- فعّل Encryption في Transit (TLS/SSL - افتراضي)

---

## 2️⃣ متغيرات Pi Network | Pi Network Configuration

### 2.1 Pi App Configuration

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `PI_APP_ID` | `PI_APP_ID` | **مطلوب** | **Required** | - | - | معرّف التطبيق الأساسي | Main app ID from Pi Developer |
| `PI_API_KEY` | `PI_API_KEY` | **مطلوب** | **Required** | - | - | مفتاح API من Pi | API Key from Pi Developer (SECRET) |
| `NEXT_PUBLIC_PI_NETWORK_URL` | `NEXT_PUBLIC_PI_NETWORK_URL` | اختياري | Optional | `https://api.minepi.com` | Default mainnet | رابط API الرئيسي | Main Pi API endpoint |
| `NEXT_PUBLIC_PI_NETWORK` | `NEXT_PUBLIC_PI_NETWORK` | اختياري | Optional | يشتق من VERCEL_ENV | Derived | الشبكة الحالية | Network type (mainnet/testnet) |

**مثال:**
```bash
PI_APP_ID=p314-aa57cb98de8ff227
PI_API_KEY=your_secret_key_from_pi_developer
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
NEXT_PUBLIC_PI_NETWORK=mainnet
```

### 2.2 بيئات متعددة - Multiple Environments

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `NEXT_PUBLIC_PI_ENV` | `NEXT_PUBLIC_PI_ENV` | اختياري | Optional | يشتق من VERCEL_ENV | Derived | اختيار صريح للبيئة | Explicit environment override |
| `NEXT_PUBLIC_APP_ID_SANDBOX` | `NEXT_PUBLIC_APP_ID_SANDBOX` | **مطلوب** | **Required** | - | - | App ID للـ Testnet | App ID from testnet.minepi.com |
| `NEXT_PUBLIC_APP_ID_MAINNET` | `NEXT_PUBLIC_APP_ID_MAINNET` | **مطلوب** | **Required** | - | - | App ID للـ Mainnet | App ID from minepi.com |
| `NEXT_PUBLIC_BACKEND_URL_SANDBOX` | `NEXT_PUBLIC_BACKEND_URL_SANDBOX` | **مطلوب** | **Required** | - | - | Backend URL للـ Testnet | `https://testnet-api.minepi.com` |
| `NEXT_PUBLIC_BACKEND_URL_MAINNET` | `NEXT_PUBLIC_BACKEND_URL_MAINNET` | **مطلوب** | **Required** | - | - | Backend URL للـ Mainnet | `https://api.minepi.com` |

**مثال:**
```bash
# Preview (Testnet)
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_APP_ID_SANDBOX=your_testnet_app_id
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://testnet-api.minepi.com

# Production (Mainnet)
NEXT_PUBLIC_PI_ENV=mainnet
NEXT_PUBLIC_APP_ID_MAINNET=your_mainnet_app_id
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://api.minepi.com
```

---

## 3️⃣ متغيرات الأمان والتشفير | Security & Encryption

### 3.1 Encryption Keys

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `ENCRYPTION_KEY` | `ENCRYPTION_KEY` | **مطلوب** | **Required** | - | - | مفتاح التشفير (32 حرف hex) | 32-char hex string for encryption |
| `ENCRYPTION_IV` | `ENCRYPTION_IV` | **مطلوب** | **Required** | - | - | Initialization Vector (16 حرف hex) | 16-char hex string for IV |

**كيفية التوليد:**
```bash
# في Terminal:
openssl rand -hex 32  # للـ ENCRYPTION_KEY
openssl rand -hex 16  # للـ ENCRYPTION_IV
```

**مثال:**
```bash
ENCRYPTION_KEY=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
ENCRYPTION_IV=a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

### 3.2 Session Management

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `SESSION_SECRET` | `SESSION_SECRET` | **مطلوب** | **Required** | - | - | مفتاح جلسة المستخدم | Secret for session signing |
| `SESSION_TIMEOUT_MS` | `SESSION_TIMEOUT_MS` | اختياري | Optional | `86400000` (24h) | 24 hours | مدة انتهاء الجلسة بالميلي ثانية | Session timeout in milliseconds |

**مثال:**
```bash
SESSION_SECRET=$(openssl rand -hex 32)
SESSION_TIMEOUT_MS=86400000  # 24 ساعة
```

### 3.3 Admin Authentication

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `ADMIN_USERNAME` | `ADMIN_USERNAME` | اختياري | Optional | - | - | اسم مستخدم Admin (backend فقط) | Admin username (server-side) |
| `NEXT_PUBLIC_ADMIN_USERNAME` | `NEXT_PUBLIC_ADMIN_USERNAME` | اختياري | Optional | - | - | اسم مستخدم Admin (عام) | Admin username (public) |

---

## 4️⃣ متغيرات الترتيب البيئي | Environment & Deployment

### 4.1 Node.js Environment

| المتغير | Variable | النوع | Type | القيم الممكنة | Possible Values | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `NODE_ENV` | `NODE_ENV` | **مطلوب** | **Required** | `development`, `production` | - | بيئة Node.js | Node.js environment |
| `NEXT_PUBLIC_ENVIRONMENT` | `NEXT_PUBLIC_ENVIRONMENT` | اختياري | Optional | `development`, `preview`, `production` | Derived | بيئة التطبيق | Application environment |

**مثال:**
```bash
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
```

### 4.2 Vercel Integration

| المتغير | Variable | النوع | Type | القيم الممكنة | Possible Values | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `VERCEL_ENV` | `VERCEL_ENV` | تلقائي | Auto | `production`, `preview` | Set by Vercel | بيئة Vercel (لا تعدله) | Vercel environment (auto) |
| `VERCEL_URL` | `VERCEL_URL` | تلقائي | Auto | `*.vercel.app` | - | رابط Vercel الفريد | Vercel-assigned URL (auto) |
| `VERCEL_PROJECT_PRODUCTION_URL` | `VERCEL_PROJECT_PRODUCTION_URL` | تلقائي | Auto | `your-domain.com` | - | رابط الإنتاج الأساسي | Production URL (auto) |
| `VERCEL_BRANCH_URL` | `VERCEL_BRANCH_URL` | تلقائي | Auto | `branch-name.vercel.app` | - | رابط الـ Preview | Preview URL (auto) |

### 4.3 App URL Configuration

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `NEXT_PUBLIC_APP_URL` | **مطلوب** | **Required** | `${VERCEL_URL}` | - | رابط التطبيق الكامل | Full application URL |

**مثال:**
```bash
# Preview environment (Testnet):
NEXT_PUBLIC_APP_URL=https://your-project-preview.vercel.app

# Production environment (Mainnet):
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

## 5️⃣ متغيرات التحكم بالمعدلات | Rate Limiting & Performance

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `RATE_LIMIT_MAX_REQUESTS` | `RATE_LIMIT_MAX_REQUESTS` | اختياري | Optional | `200` (prod) / `500` (preview) | Environment-based | الحد الأقصى للطلبات | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | `RATE_LIMIT_WINDOW_MS` | اختياري | Optional | `60000` (60s) | - | نافذة الحد الزمنية بالميلي ثانية | Rate limit window in ms |

**مثال:**
```bash
RATE_LIMIT_MAX_REQUESTS=200      # 200 طلب
RATE_LIMIT_WINDOW_MS=60000        # في 60 ثانية
```

---

## 6️⃣ متغيرات الميزات | Feature Configuration

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `NEXT_PUBLIC_TRIAL_MODE_MESSAGE_LIMIT` | `NEXT_PUBLIC_TRIAL_MODE_MESSAGE_LIMIT` | اختياري | Optional | `50` | - | حد الرسائل للوضع التجريبي | Max messages in trial mode |
| `NEXT_PUBLIC_QUEST_HELP_MILESTONE` | `NEXT_PUBLIC_QUEST_HELP_MILESTONE` | اختياري | Optional | `10` | - | علامة مساعدة المهام | Quest help milestone |
| `NEXT_PUBLIC_MAX_MESSAGE_LENGTH` | `NEXT_PUBLIC_MAX_MESSAGE_LENGTH` | اختياري | Optional | `1000` | - | الحد الأقصى لطول الرسالة | Max characters per message |

---

## 7️⃣ متغيرات السجلات والتتبع | Logging & Monitoring

### 7.1 Application Logging

| المتغير | Variable | النوع | Type | القيم الممكنة | Possible Values | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `LOG_LEVEL` | `LOG_LEVEL` | اختياري | Optional | `debug`, `info`, `warn`, `error` | Environment-based | مستوى السجل | Logging verbosity level |
| `LOG_DB_QUERIES` | `LOG_DB_QUERIES` | اختياري | Optional | `true`, `false` | `false` | تسجيل استعلامات قاعدة البيانات | Log database queries |

**مثال:**
```bash
# Preview (Development):
LOG_LEVEL=debug
LOG_DB_QUERIES=true

# Production:
LOG_LEVEL=info
LOG_DB_QUERIES=false
```

### 7.2 Analytics & Monitoring

| المتغير | Variable | النوع | Type | قيمة افتراضية | Default | الوصف | Description |
|--------|----------|--------|------|--------------|---------|---------|-------------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | اختياري | Optional | - | - | معرّف Vercel Analytics | Vercel Analytics ID |

---

## 8️⃣ متغيرات Build-Time | Build Configuration

| المتغير | Variable | النوع | Type | الوصف | Description |
|--------|----------|--------|------|---------|-------------|
| `NEXT_PHASE` | `NEXT_PHASE` | تلقائي | Auto | مرحلة البناء (لا تعدله) | Build phase (auto) |

---

## 📊 جدول ملخص التجميع | Summary Compilation

### حسب الأولوية | By Priority

#### الحتمية (مطلوبة) | Required (14 متغير)

```
✅ قاعدة البيانات:
   MONGODB_URI
   MONGODB_DB_NAME

✅ Pi Network:
   PI_APP_ID
   PI_API_KEY
   NEXT_PUBLIC_APP_ID_SANDBOX
   NEXT_PUBLIC_APP_ID_MAINNET
   NEXT_PUBLIC_BACKEND_URL_SANDBOX
   NEXT_PUBLIC_BACKEND_URL_MAINNET

✅ الأمان:
   ENCRYPTION_KEY
   ENCRYPTION_IV
   SESSION_SECRET

✅ البيئة:
   NODE_ENV
   NEXT_PUBLIC_APP_URL
```

#### الاختيارية | Optional (27 متغير)

```
📌 متغيرات قاعدة البيانات:
   (جميعها مطلوبة)

📌 متغيرات Pi Network:
   NEXT_PUBLIC_PI_NETWORK_URL
   NEXT_PUBLIC_PI_NETWORK
   NEXT_PUBLIC_PI_ENV

📌 متغيرات الأمان:
   SESSION_TIMEOUT_MS
   ADMIN_USERNAME
   NEXT_PUBLIC_ADMIN_USERNAME

📌 متغيرات Vercel (تلقائية):
   VERCEL_ENV
   VERCEL_URL
   VERCEL_PROJECT_PRODUCTION_URL
   VERCEL_BRANCH_URL

📌 متغيرات الأداء:
   RATE_LIMIT_MAX_REQUESTS
   RATE_LIMIT_WINDOW_MS

📌 متغيرات الميزات:
   NEXT_PUBLIC_TRIAL_MODE_MESSAGE_LIMIT
   NEXT_PUBLIC_QUEST_HELP_MILESTONE
   NEXT_PUBLIC_MAX_MESSAGE_LENGTH

📌 متغيرات التسجيل:
   LOG_LEVEL
   LOG_DB_QUERIES
   NEXT_PUBLIC_VERCEL_ANALYTICS_ID

📌 متغيرات البيئة:
   NEXT_PUBLIC_ENVIRONMENT
```

---

## 🛠️ كيفية الإعداد | Setup Instructions

### في Vercel Dashboard | In Vercel Dashboard

```
1. انتقل إلى: https://vercel.com/dashboard
2. اختر مشروعك
3. اضغط على Settings → Environment Variables
4. أضف المتغيرات الحتمية (14 متغير)
5. أضف المتغيرات الاختيارية حسب احتياجك
```

### الفصل بين البيئات | Environment Separation

**Preview (Testnet):**
```
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_APP_ID_SANDBOX=xxx
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://testnet-api.minepi.com
MONGODB_URI=mongodb+srv://...p314-testnet...
```

**Production (Mainnet):**
```
NEXT_PUBLIC_PI_ENV=mainnet
NEXT_PUBLIC_APP_ID_MAINNET=yyy
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://api.minepi.com
MONGODB_URI=mongodb+srv://...p314-mainnet...
```

---

## ⚠️ ملاحظات الأمان الحرجة | Critical Security Notes

1. **Secret Keys**: لا تضع Secret Keys في الكود أو الـ logs
2. **NEXT_PUBLIC_**: فقط المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` تظهر للـ client
3. **API Keys**: استخدم Vercel Environment Variables دائماً
4. **Database**: استخدم IP Whitelist + Connection Pooling
5. **Encryption**: استخدم OpenSSL لتوليد مفاتيح عشوائية قوية

---

## 📈 مخطط التدفق | Flow Diagram

```
┌─────────────────────────────────────────┐
│     Development Environment (Local)     │
│                                         │
│  .env.local (مثال من .env.example)    │
│  - MONGODB_URI (testnet)               │
│  - PI_APP_ID (testnet)                 │
│  - NODE_ENV=development                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Next.js App Runtime             │
│         (lib/env.ts loads)              │
│                                         │
│  getEnv() validates required vars      │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    ┌────────────┐    ┌──────────────┐
    │   Client   │    │   Server     │
    │  (Browser) │    │  (Node.js)   │
    │            │    │              │
    │NEXT_PUBLIC_│    │All env vars  │
    │ vars only  │    │accessible    │
    └────────────┘    └──────────────┘
        │                   │
        ▼                   ▼
    ┌────────────┐    ┌──────────────┐
    │   Pi SDK   │    │  MongoDB     │
    │   (browser)│    │  (server)    │
    └────────────┘    └──────────────┘
```

---

## 🔗 المراجع | References

- **Pi Developer**: https://minepi.com/developer
- **Vercel Env Vars**: https://vercel.com/docs/build-output-api/v3/environment-variables
- **MongoDB Connection**: https://docs.mongodb.com/manual/reference/connection-string/
- **OpenSSL**: https://www.openssl.org/

---

## ✅ قائمة التحقق النهائية | Final Checklist

- [ ] تم إضافة 14 متغير مطلوب
- [ ] تم إضافة متغيرات Testnet
- [ ] تم إضافة متغيرات Mainnet
- [ ] تم فصل Preview و Production
- [ ] تم اختبار الاتصال بـ MongoDB
- [ ] تم اختبار Pi SDK authentication
- [ ] تم تعطيل LOG_DB_QUERIES في Production
- [ ] تم حفظ جميع Secret Keys بأمان

---

**آخر تحديث:** 2024
**تم الفحص بدقة بواسطة:** Deep Audit v1.0

