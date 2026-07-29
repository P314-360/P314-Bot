# دليل التشغيل المحلي لـ P314 Bot

## المتطلبات الأساسية

- **Node.js** (الإصدار 18 أو أحدث)
- **pnpm** (`npm install -g pnpm`)
- محرر نصوص (VS Code مُوصى به)
- حساب MongoDB Atlas (مجاني)

---

## الخطوة 1: تحميل المشروع

### من v0:
في واجهة المشروع، اضغط على الثلاث نقاط → **Download ZIP**، ثم فك الضغط.

### من Git:
```bash
git clone https://github.com/YOUR_USERNAME/p314-bot.git
cd p314-bot
```

---

## الخطوة 2: فتح المشروع في Terminal

```bash
cd path/to/p314-bot
```

---

## الخطوة 3: تثبيت المكتبات

```bash
pnpm install
```

---

## الخطوة 4: إعداد قاعدة البيانات MongoDB

### 4.1 إنشاء قاعدة البيانات

1. افتح https://cloud.mongodb.com → أنشئ Cluster مجاني (M0)
2. أنشئ مستخدم قاعدة بيانات
3. اضبط IP Allowlist: `0.0.0.0/0`
4. انسخ connection string

للتفاصيل الكاملة: راجع `MONGODB_SETUP.md`

### 4.2 إنشاء ملف `.env.local`

انسخ من `.env.local.example`:
```bash
cp .env.local.example .env.local
```

ثم عدّل القيم:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot
PI_APP_ID=your_pi_app_id
PI_API_KEY=your_pi_api_key
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=any_secure_string
NEXT_PUBLIC_ENVIRONMENT=development
NODE_ENV=development
```

### 4.3 تهيئة المجموعات والفهارس

شغّل مرة واحدة:
```bash
node scripts/03-mongodb-access-control.js
```

---

## الخطوة 5: تشغيل المشروع

```bash
pnpm dev
```

ستظهر:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

---

## الخطوة 6: فتح البوت في المتصفح

```
http://localhost:3000
```

---

## الخطوة 7: اختبار الميزات

1. جرّب إرسال رسائل (Trial Mode: 50 رسالة)
2. جرّب المصادقة عبر Pi Network (تتطلب domain مسجلاً)
3. تحقق من ظهور البيانات في MongoDB Atlas → Collections

---

## المشاكل الشائعة وحلولها

### مشكلة 1: `pnpm install` يفشل
```bash
pnpm store prune
pnpm install
```

### مشكلة 2: خطأ في MongoDB Connection
- تأكد من صحة `MONGODB_URI` في `.env.local`
- تأكد من أن IP `0.0.0.0/0` مسموح به في Atlas

### مشكلة 3: Pi Network SDK لا يعمل محلياً
- Pi SDK يعمل فقط على domains مسجلة
- للتجربة المحلية، يعمل البوت في "Trial Mode"
- للاختبار الكامل، يجب النشر على Vercel

---

## الخطوات التالية

بعد التجربة المحلية الناجحة:
1. **النشر على Vercel** — راجع `HOW_TO_DEPLOY.md`
2. **تسجيل Domain في Pi Network** — Pi Developer Portal
3. **تفعيل Pi SDK بشكل كامل**

---

## تحديث المشروع

```bash
# أوقف السيرفر (Ctrl + C)
pnpm dev
```

---

**ملاحظة:** Pi Network SDK يتطلب domain مسجل للعمل الكامل. للاختبار الكامل مع Pi Network، يجب النشر على Vercel.
