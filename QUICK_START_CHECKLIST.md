# ✅ قائمة التحقق السريعة - Setup Checklist

## ما الذي أضفناه الآن

✅ **Environment Selector UI** - واجهة لاختيار Testnet أو Mainnet
✅ **localStorage Persistence** - الاختيار يُحفظ تلقائياً
✅ **Vercel Environment Detection** - تلقائي حسب Preview/Production
✅ **Documentation** - توثيق شامل لكل المتغيرات

---

## 🚀 الخطوات التي يجب عليك فعلها الآن

### المرحلة 1: الحصول على App IDs (10 دقائق)

#### لـ Testnet:
- [ ] اذهب إلى https://testnet.minepi.com
- [ ] سجّل دخولك أو أنشئ حساب جديد
- [ ] اذهب إلى Developer Dashboard
- [ ] انشئ تطبيق جديد أو استخدم القديم
- [ ] انسخ **App ID** (مثال: `c8c0d8c0d8c0d8c0d8c0d8c0`)
- [ ] احفظه في ملف آمن

#### لـ Mainnet:
- [ ] اذهب إلى https://minepi.com
- [ ] تأكد من حسابك معيّن KYC ✓
- [ ] اذهب إلى Developer Dashboard
- [ ] انشئ تطبيق جديد أو استخدم القديم
- [ ] انسخ **App ID**
- [ ] احفظه في ملف آمن

### المرحلة 2: إعداد MongoDB (15 دقيقة)

#### لـ Testnet:
- [ ] اذهب إلى https://www.mongodb.com/cloud/atlas
- [ ] أنشئ cluster جديد اسمه `p314-testnet`
- [ ] اختر Shared Tier (مجاني)
- [ ] انسخ Connection String
- [ ] مثال: `mongodb+srv://user:pass@cluster-testnet.mongodb.net/p314_testnet?retryWrites=true&w=majority`

#### لـ Mainnet:
- [ ] أنشئ cluster جديد اسمه `p314-mainnet`
- [ ] اختر M10 Dedicated Tier أو أعلى
- [ ] فعّل Encryption و Backup
- [ ] أضف Vercel IPs إلى IP Whitelist
- [ ] انسخ Connection String

### المرحلة 3: إضافة Environment Variables في Vercel (20 دقيقة)

#### الخطوة 1: افتح Vercel Dashboard
```
https://vercel.com/dashboard
```

#### الخطوة 2: اختر مشروعك
```
اسم المشروع → Settings → Environment Variables
```

#### الخطوة 3: أضف متغيرات Preview (Testnet)

اضغط "Add Environment Variable" وأضف:

| الاسم | القيمة | الـ Context |
|--------|--------|----------|
| `NEXT_PUBLIC_PI_ENV` | `sandbox` | Preview |
| `NEXT_PUBLIC_BACKEND_URL_SANDBOX` | `https://testnet-api.minepi.com` | Preview |
| `NEXT_PUBLIC_APP_ID_SANDBOX` | `<your-testnet-app-id>` | Preview |
| `MONGODB_URI_SANDBOX` | `<your-testnet-connection-string>` | Preview |

#### الخطوة 4: أضف متغيرات Production (Mainnet)

اضغط "Add Environment Variable" وأضف:

| الاسم | القيمة | الـ Context |
|--------|--------|----------|
| `NEXT_PUBLIC_PI_ENV` | `mainnet` | Production |
| `NEXT_PUBLIC_BACKEND_URL_MAINNET` | `https://api.minepi.com` | Production |
| `NEXT_PUBLIC_APP_ID_MAINNET` | `<your-mainnet-app-id>` | Production |
| `MONGODB_URI_MAINNET` | `<your-mainnet-connection-string>` | Production |

#### مثال كامل:

```
الاسم: NEXT_PUBLIC_BACKEND_URL_SANDBOX
القيمة: https://testnet-api.minepi.com
الـ Context: Preview
[Save]

الاسم: NEXT_PUBLIC_BACKEND_URL_MAINNET
القيمة: https://api.minepi.com
الـ Context: Production
[Save]
```

### المرحلة 4: الاختبار المحلي (10 دقائق)

```bash
# 1. افتح Terminal وادخل المشروع
cd /path/to/p314-bot

# 2. شغّل التطبيق
npm run dev

# 3. افتح http://localhost:3000

# 4. يجب أن ترى:
#    - شاشة اختيار البيئة
#    - خيار "Testnet (Sandbox)" - أصفر
#    - خيار "Mainnet (Production)" - أحمر

# 5. اختر Testnet

# 6. يجب أن تجد:
#    - زر "Login with Pi"
#    - يمكنك تسجيل الدخول بـ Testnet Pi Account

# 7. اختبر جميع الميزات:
#    - [ ] Chat مع الـ bot
#    - [ ] إنشاء قناة
#    - [ ] إضافة wallet
#    - [ ] عمل withdrawal
#    - [ ] Admin Panel (إن كنت admin)
```

### المرحلة 5: النشر على Vercel (5 دقائق)

```bash
# 1. تأكد من أن جميع المتغيرات معيّنة في Vercel ✓

# 2. ادفع الـ commit:
git push origin main

# 3. Vercel سينشر تلقائياً

# 4. اختبر على Production:
https://your-project.vercel.app

# 5. يجب أن تلاحظ:
#    - الاختيار بين Testnet/Mainnet
#    - لو في Production branch: يختار Mainnet تلقائياً
#    - لو في Preview: يمكن اختيار Testnet يدويا
```

---

## 📋 جدول المتغيرات للنسخ واللصق

### متغيرات Preview (Copy & Paste):

```
NEXT_PUBLIC_PI_ENV=sandbox
NEXT_PUBLIC_BACKEND_URL_SANDBOX=https://testnet-api.minepi.com
NEXT_PUBLIC_APP_ID_SANDBOX=<REPLACE_WITH_YOUR_ID>
MONGODB_URI_SANDBOX=<REPLACE_WITH_YOUR_CONNECTION_STRING>
```

### متغيرات Production (Copy & Paste):

```
NEXT_PUBLIC_PI_ENV=mainnet
NEXT_PUBLIC_BACKEND_URL_MAINNET=https://api.minepi.com
NEXT_PUBLIC_APP_ID_MAINNET=<REPLACE_WITH_YOUR_ID>
MONGODB_URI_MAINNET=<REPLACE_WITH_YOUR_CONNECTION_STRING>
```

---

## 🎯 ما الذي سيحدث بعد الاتمام

✅ **للمستخدمين:**
```
1. يفتحون التطبيق
2. يرون خيارين:
   - Testnet (أصفر) - للاختبار
   - Mainnet (أحمر) - للحقيقي
3. يختاران واحد
4. يسجلون دخولهم بـ Pi
5. يستخدمون كل الميزات
```

✅ **للـ Admin:**
```
1. Revenue Dashboard عاملة في كل البيئات
2. معرفة إجمالي الأرباح من Testnet و Mainnet
3. تعديل معدلات الأرباح
4. تتبع جميع السحب والتحويلات
```

✅ **للـ Payments:**
```
1. الـ Wallet Linking يعمل
2. السحب يحسب الرسوم تلقائياً
3. جميع العمليات تُسجل في MongoDB
4. كل بيئة في database منفصلة
```

---

## ⚠️ نقاط مهمة جداً

1. **لا تنسى الـ SLASH في نهاية URLs:**
   ```bash
   ✓ https://api.minepi.com
   ✓ https://testnet-api.minepi.com
   ✗ https://api.minepi.com/  (بـ trailing slash)
   ```

2. **App IDs يجب أن تكون من نفس البيئة:**
   ```bash
   ✓ NEXT_PUBLIC_APP_ID_SANDBOX = من testnet.minepi.com
   ✓ NEXT_PUBLIC_APP_ID_MAINNET = من minepi.com
   ✗ NEXT_PUBLIC_APP_ID_SANDBOX = من minepi.com (خطأ!)
   ```

3. **MongoDB يجب أن يكون accessible من Vercel:**
   ```bash
   في MongoDB Atlas:
   1. Security → Network Access
   2. Add IP Address
   3. أضف Vercel deployment IPs أو 0.0.0.0/0
   ```

4. **الأمان - لا تنسى:**
   ```bash
   ✗ لا تضع Secret Keys في الكود
   ✗ لا تنسخ/تلصق secrets في public repos
   ✓ استخدم Vercel Environment Variables فقط
   ✓ Secret keys بدون접두사 NEXT_PUBLIC_
   ```

---

## 🔍 كيفية التحقق من أن كل شيء يعمل

### Local Testing:
```bash
# 1. Terminal
npm run dev

# 2. في المتصفح
http://localhost:3000

# 3. يجب أن ترى Environment Selector ✓

# 4. اختر Testnet

# 5. يجب أن تحمل SDK بنجاح ✓

# 6. اختبر Login ✓

# 7. في Console (F12):
# يجب أن ترى رسالة مثل:
# [Pi Environment Config] {
#   environment: "sandbox",
#   sandbox: true,
#   description: "Pi Network Sandbox (Testnet)",
#   ...
# }
```

### Vercel Testing:
```bash
# 1. ادفع commits:
git push origin main

# 2. انتظر Vercel ينشر (~2 دقائق)

# 3. فتح:
https://your-project.vercel.app

# 4. يجب أن تجد Environment Selector ✓

# 5. كل بيئة تستخدم URLs الصحيحة ✓
```

---

## 📞 إذا واجهت مشاكل

### المشكلة: "Cannot find Environment Selector"

```bash
تأكد من:
1. git pull (تحديث الكود الأخير)
2. npm install (تثبيت dependencies)
3. npm run dev (تشغيل من جديد)
4. CTRL+Shift+R (تحديث المتصفح - hard refresh)
```

### المشكلة: "App ID مرفوضة"

```bash
تأكد من:
1. App ID من نفس البيئة (Testnet/Mainnet)
2. App ID كتابتها صحيح (بدون مسافات)
3. App ID مفعلة في Pi Developer Dashboard
```

### المشكلة: "MongoDB Connection Failed"

```bash
تأكد من:
1. Connection String كتابته صحيح
2. Username و Password صحيحين
3. IP Whitelist في MongoDB يتضمن Vercel IPs
4. Database name موجود في Connection String
```

---

## 📚 ملفات التوثيق

اقرأ هذه الملفات لمعلومات تفصيلية:

- 📄 `ENVIRONMENT_SETUP.md` - شرح مفصل لكل متغير
- 📄 `PAYMENT_AUTH_AUDIT.md` - فحص شامل للنظام
- 📄 `MANUAL_SETUP_REQUIRED.md` - المهام اليدوية

---

## ✨ ملخص بسيط جداً

```
1. احصل على App IDs
2. أنشئ MongoDB Clusters
3. أضف Variables في Vercel
4. ادفع الكود
5. اختبر

Done! 🎉
```

---

**اسئلة؟ الملفات الأخرى في المستودع تحتوي شرح تفصيلي لكل خطوة!**
