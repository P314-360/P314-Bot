# كيفية نشر P314 Bot

## الخطوات السريعة

### 1. إعداد MongoDB Atlas

1. اذهب إلى https://cloud.mongodb.com وأنشئ حساباً
2. أنشئ Cluster مجاني (M0)
3. أنشئ مستخدم قاعدة بيانات وانسخ connection string
4. اضبط IP Allowlist: `0.0.0.0/0`

للتفاصيل: راجع `MONGODB_SETUP.md`

### 2. الحصول على Pi Network Keys

1. اذهب إلى: https://develop.pi
2. أنشئ تطبيقاً جديداً واحصل على `PI_APP_ID` و `PI_API_KEY`

### 3. النشر على Vercel

1. اذهب إلى https://vercel.com → "New Project"
2. استورد مستودع GitHub

في **Settings → Environment Variables**، أضف:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
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

لتوليد مفاتيح التشفير:
```bash
openssl rand -hex 32  # ENCRYPTION_KEY
openssl rand -hex 16  # ENCRYPTION_IV
```

3. اضغط **Deploy**

### 4. تهيئة قاعدة البيانات

بعد النشر، شغّل مرة واحدة:
```bash
MONGODB_URI="your_uri" node scripts/03-mongodb-access-control.js
```

### 5. تحديث Pi App Redirect URL

في Pi Developer Portal، حدّث **Redirect URL** لرابط Vercel.

---

## التحقق من نجاح النشر

- افتح رابط Vercel في المتصفح
- ابحث في Vercel Logs عن: `[P314 DB] ✓ Connection successful`
- جرّب تسجيل الدخول عبر Pi Network

للمزيد من التفاصيل: `docs/DEPLOYMENT_PRODUCTION.md`
