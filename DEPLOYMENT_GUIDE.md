# دليل نشر P314 Bot

## الطريقة 1: النشر المباشر على Vercel (الأسهل)

### الخطوات:
1. اذهب إلى: https://vercel.com
2. سجل دخول بحساب GitHub أو Email
3. اضغط على "Add New Project"
4. اختر "Import Git Repository"

### المتغيرات البيئية المطلوبة في Vercel Dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot
PI_APP_ID=your_pi_app_id
PI_API_KEY=your_pi_api_key
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=your_session_secret
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
```

---

## الطريقة 2: تحميل الملفات من v0

إذا كنت تستخدم v0.dev:
1. اضغط على الثلاث نقاط في أعلى يسار المشروع
2. اختر "Download ZIP"
3. فك الضغط على جهازك

---

## الطريقة 3: إنشاء المشروع يدوياً

```bash
mkdir p314-bot && cd p314-bot
# انسخ الملفات
pnpm install
# انشئ .env.local من .env.local.example وأضف القيم
pnpm dev
```

---

## إعداد قاعدة البيانات MongoDB

1. أنشئ cluster مجاني في: https://cloud.mongodb.com
2. أنشئ مستخدم قاعدة بيانات وانسخ connection string
3. شغّل مرة واحدة: `node scripts/03-mongodb-access-control.js`
4. تحقق من ظهور: `[P314 DB] ✓ Connection successful` في Logs

للتفاصيل الكاملة: راجع `MONGODB_SETUP.md`

---

## تسجيل التطبيق في Pi Network

1. اذهب إلى: https://develop.pi
2. سجل التطبيق: App Name: P314، App URL: رابط Vercel
3. انتظر الموافقة

---

## التحقق من النشر

بعد النشر على Vercel، زر:
```
https://your-project.vercel.app
```

يجب أن ترى:
- واجهة P314
- زر تسجيل الدخول عبر Pi Network
- نظام الدردشة يعمل

---

## الدعم الفني

إذا واجهت مشاكل:
1. تحقق من أن جميع Environment Variables مضافة في Vercel
2. تحقق من أن `scripts/03-mongodb-access-control.js` تم تنفيذه
3. تحقق من Console لأي أخطاء

للدعم الفني: راجع ملف `TROUBLESHOOTING.md`
