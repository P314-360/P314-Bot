# Pi Network Environment Setup Guide

## نظرة عامة / Overview

التطبيق الآن يدعم بيئتين:
- **Testnet (Sandbox)** - للاختبار والتطوير
- **Mainnet (Production)** - للشبكة الحقيقية

عند فتح التطبيق، سيرى المستخدم خياري البيئة ويختار أيهما.

---

## 1. متغيرات البيئة المطلوبة

### المتغيرات العامة (لكل البيئات)

```bash
# الوصف: إصدار Python المطلوب
PYTHON_VERSION=3.11

# الوصف: متغير Vercel المدمج (تلقائي)
# لا تحتاج تعيينه يدويا
VERCEL_ENV=preview  # أو production
```

### متغيرات Preview (التطوير/Testnet)

أضفها في **Settings → Environment Variables → Preview**

```bash
# اختياري - فرض استخدام Testnet
NEXT_PUBLIC_PI_ENV=sandbox

# Testnet Backend API
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://testnet-api.minepi.com

# Testnet App ID
NEXT_PUBLIC_APP_ID_SANDBOX=<YOUR_TESTNET_APP_ID>

# MongoDB للـ Testnet
MONGODB_URI_SANDBOX=mongodb+srv://user:pass@cluster.mongodb.net/p314_testnet

# للدفع (اختياري)
STRIPE_PUBLISHABLE_KEY_TESTNET=pk_test_...
STRIPE_SECRET_KEY_TESTNET=sk_test_...
```

### متغيرات Production (Mainnet)

أضفها في **Settings → Environment Variables → Production**

```bash
# فرض استخدام Mainnet
NEXT_PUBLIC_PI_ENV=mainnet

# Mainnet Backend API
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://api.minepi.com

# Mainnet App ID
NEXT_PUBLIC_APP_ID_MAINNET=<YOUR_MAINNET_APP_ID>

# MongoDB للـ Mainnet
MONGODB_URI_MAINNET=mongodb+srv://user:pass@cluster.mongodb.net/p314_mainnet

# للدفع (مهم جداً!)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 2. كيفية الحصول على App ID

### للـ Testnet:
1. اذهب إلى https://testnet.minepi.com
2. سجّل دخولك بـ Pi Account
3. انشئ تطبيق جديد أو استخدم التطبيق الموجود
4. انسخ **App ID** من صفحة تفاصيل التطبيق

### للـ Mainnet:
1. اذهب إلى https://minepi.com
2. سجّل دخولك بـ Pi Account
3. تأكد من تفعيل KYC (Know Your Customer)
4. انشئ تطبيق جديد أو استخدم التطبيق الموجود
5. انسخ **App ID** من صفحة تفاصيل التطبيق

---

## 3. إعداد MongoDB

### Option A: MongoDB Atlas (موصى به)

#### للـ Testnet:
```bash
# 1. اذهب إلى mongodb.com/cloud
# 2. انشئ cluster جديد باسم: p314-testnet
# 3. اختر Shared Tier (مجاني)
# 4. انسخ connection string وضعه هنا:
# mongodb+srv://username:password@cluster-testnet.mongodb.net/p314_testnet?retryWrites=true&w=majority
```

#### للـ Mainnet:
```bash
# 1. اذهب إلى mongodb.com/cloud
# 2. انشئ cluster جديد باسم: p314-mainnet
# 3. اختر Shared Tier أو أعلى
# 4. اختر Production Security:
#    - IP Whitelist: أضف Vercel IPs
#    - Enable Database Encryption
#    - Enable Backup
# 5. انسخ connection string وضعه هنا:
# mongodb+srv://username:password@cluster-mainnet.mongodb.net/p314_mainnet?retryWrites=true&w=majority
```

---

## 4. إضافة المتغيرات في Vercel

### الخطوة 1: افتح Dashboard
```
https://vercel.com/dashboard
```

### الخطوة 2: اختر مشروعك
```
Click على اسم المشروع → Settings → Environment Variables
```

### الخطوة 3: أضف متغيرات Preview

لكل متغير:
1. ضع الاسم (مثلاً: `NEXT_PUBLIC_APP_ID_SANDBOX`)
2. ضع القيمة
3. اختر **Preview** من السياق
4. اضغط **Save**

### الخطوة 4: أضف متغيرات Production

كرر نفس العملية لكن اختر **Production** بدلاً من Preview

### الخطوة 5: أضف المتغيرات المشتركة

بعض المتغيرات تعمل في كل البيئات، ضعها في **All** بدلاً من Preview/Production

---

## 5. اختبار البيئات

### في المتصفح المحلي (Testnet):

```bash
# 1. شغّل التطبيق
npm run dev

# 2. افتح http://localhost:3000

# 3. يجب أن ترى شاشة اختيار البيئة

# 4. اختر "Testnet (Sandbox)" بـ الأصفر

# 5. سيحمّل SDK من:
# https://sdk.minepi.com/pi-sdk.js (مع sandbox=true)

# 6. سجّل دخولك بـ حساب Testnet Pi
```

### على Vercel Production (Mainnet):

```bash
# 1. ادفع كود جديد إلى main branch
git push origin main

# 2. سينشر Vercel تلقائياً

# 3. افتح https://your-project.vercel.app

# 4. يجب أن يختار Mainnet تلقائياً
#    (لأن NEXT_PUBLIC_PI_ENV=mainnet مُعيّن في Production)

# 5. سيحمّل SDK من:
# https://sdk.minepi.com/pi-sdk.js (مع sandbox=false)

# 6. سجّل دخولك بـ حساب Mainnet Pi
```

---

## 6. كيفية التحويل بين البيئات

### أثناء التطوير:

```bash
# Testnet (افتراضي):
NEXT_PUBLIC_PI_ENV=sandbox npm run dev

# Mainnet (للاختبار):
NEXT_PUBLIC_PI_ENV=mainnet npm run dev
```

### عند المستخدم:

المستخدم يختار البيئة من الواجهة عند فتح التطبيق أول مرة:
- يمكنه الضغط على "Testnet" أو "Mainnet"
- الاختيار يُحفظ في `localStorage`
- يمكنه تغييره من **Settings** لاحقاً

---

## 7. جدول متغيرات المفاتيح

| المتغير | Testnet | Mainnet | الملاحظات |
|--------|---------|---------|----------|
| `NEXT_PUBLIC_PI_ENV` | `sandbox` | `mainnet` | اختياري - يُحدد من VERCEL_ENV |
| `NEXT_PUBLIC_BACKEND_URL_SANDBOX` | ✓ مطلوب | ✗ غير مستخدم | - |
| `NEXT_PUBLIC_BACKEND_URL_MAINNET` | ✗ غير مستخدم | ✓ مطلوب | - |
| `NEXT_PUBLIC_APP_ID_SANDBOX` | ✓ مطلوب | ✗ غير مستخدم | من Pi Developer |
| `NEXT_PUBLIC_APP_ID_MAINNET` | ✗ غير مستخدم | ✓ مطلوب | من Pi Developer |
| `MONGODB_URI_SANDBOX` | ✓ مطلوب | ✗ غير مستخدم | MongoDB Atlas |
| `MONGODB_URI_MAINNET` | ✗ غير مستخدم | ✓ مطلوب | MongoDB Atlas |
| `STRIPE_PUBLISHABLE_KEY_TESTNET` | اختياري | ✗ غير مستخدم | للدفع في الاختبار |
| `STRIPE_SECRET_KEY_TESTNET` | اختياري | ✗ غير مستخدم | للدفع في الاختبار |
| `STRIPE_PUBLISHABLE_KEY` | ✗ غير مستخدم | ✓ مطلوب | للدفع الحقيقي |
| `STRIPE_SECRET_KEY` | ✗ غير مستخدم | ✓ مطلوب | للدفع الحقيقي |

---

## 8. ملخص الخطوات السريعة

```bash
# 1. اذهب إلى Vercel Dashboard
https://vercel.com/dashboard

# 2. اختر مشروعك → Settings → Environment Variables

# 3. أضف متغيرات Preview (Testnet):
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://testnet-api.minepi.com
NEXT_PUBLIC_APP_ID_SANDBOX=xxxx
MONGODB_URI_SANDBOX=mongodb+srv://...

# 4. أضف متغيرات Production (Mainnet):
NEXT_PUBLIC_PI_ENV=mainnet
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://api.minepi.com
NEXT_PUBLIC_APP_ID_MAINNET=yyyy
MONGODB_URI_MAINNET=mongodb+srv://...

# 5. ادفع تغييراتك
git push origin main

# 6. Vercel سينشر تلقائياً

# 7. اختبر:
# - المحلي: http://localhost:3000 (اختر Testnet)
# - Production: https://your-project.vercel.app (يختار Mainnet تلقائياً)
```

---

## 9. استكشاف الأخطاء

### المشكلة: "Failed to load Pi SDK"

**الحل:**
```bash
# تأكد من أن SDK URL صحيح:
# Testnet: https://sdk.minepi.com/pi-sdk.js ✓
# Mainnet: https://sdk.minepi.com/pi-sdk.js ✓

# السبب: إعدادات CSP قد تحجب التحميل
# الحل: تحقق من lib/security-headers.ts
# يجب أن تتضمن: script-src https://sdk.minepi.com
```

### المشكلة: "Backend URL is not configured"

**الحل:**
```bash
# تأكد من تعيين المتغير الصحيح:
# Testnet: NEXT_PUBLIC_BACKEND_URL_SANDBOX
# Mainnet: NEXT_PUBLIC_BACKEND_URL_MAINNET

# في Vercel Dashboard:
# 1. اذهب إلى Settings → Environment Variables
# 2. تأكد من المتغير معيّن
# 3. اختر Context الصحيح (Preview/Production)
# 4. أعد بناء التطبيق
```

### المشكلة: "Wallet Link Failed"

**الحل:**
```bash
# تأكد من:
# 1. MongoDB متصل بشكل صحيح
# 2. App ID صحيح (من Pi Developer)
# 3. الحساب متحقق من KYC (خاصة للـ Mainnet)
# 4. Testnet لا يتطلب KYC
```

---

## 10. الأمان والملاحظات المهمة

⚠️ **لا تضع Secret Keys في الكود أبداً!**

✓ افعل هذا:
```bash
# في Vercel Environment Variables:
STRIPE_SECRET_KEY=sk_live_...  # مخفي من الكود
```

✗ لا تفعل هذا:
```javascript
// ❌ خطير جداً:
const stripeKey = "sk_live_..."  // في الكود
```

✓ استخدم المتغيرات بدون접두사 `NEXT_PUBLIC_`:
```javascript
// السرية (فقط في API routes):
const secret = process.env.STRIPE_SECRET_KEY

// العامة (يمكن في العميل):
const public = process.env.NEXT_PUBLIC_APP_ID
```

---

## المتابعة والدعم

إذا واجهت أي مشاكل:
1. تحقق من Console في المتصفح (F12)
2. اقرأ Vercel Logs (في Dashboard → Deployments)
3. تأكد من جميع متغيرات البيئة
4. جرب بفتح التطبيق في Incognito/Private Window

---

**✅ الآن التطبيق جاهز لـ Testnet و Mainnet!**
