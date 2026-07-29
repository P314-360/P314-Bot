# P314 - Smart Support Bot for Pi Network

البوت الذكي للدعم الفني في شبكة Pi Network

## المميزات الرئيسية

- دردشة مع AI مدعومة بالذكاء الاصطناعي
- التشفير من طرف إلى طرف (E2EE)
- نظام القنوات اللامركزي
- دعم 12 لغة
- نظام السمعة وجوائز NFT
- التحقق من المحافظ والإبلاغ عن الاحتيال

## متطلبات التشغيل

- Node.js 18+
- حساب MongoDB Atlas (https://cloud.mongodb.com) — الطبقة المجانية M0 تكفي للتطوير
- حساب مطوّر Pi Network (https://develop.pi)
- حساب Vercel للنشر

## التثبيت السريع

### 1. نسخ المشروع
```bash
cd p314-bot
```

### 2. تثبيت المكتبات
```bash
pnpm install
```

### 3. إضافة المتغيرات البيئية
أنشئ ملف `.env.local` (انسخ من `.env.local.example`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314_bot?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot
PI_APP_ID=your_pi_app_id
PI_API_KEY=your_pi_api_key
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
ENCRYPTION_KEY=your_64_char_hex_key
ENCRYPTION_IV=your_32_char_hex_iv
SESSION_SECRET=your_session_secret
```

### 4. تهيئة قاعدة البيانات
```bash
node scripts/03-mongodb-access-control.js
```

### 5. تشغيل المشروع
```bash
pnpm dev
```

افتح المتصفح على: http://localhost:3000

## النشر على Vercel

1. اذهب إلى https://vercel.com
2. سجل دخول بـ GitHub
3. اضغط "New Project" → "Import Git Repository"
4. أضف Environment Variables (انظر `docs/DEPLOYMENT_PRODUCTION.md`)
5. اضغط "Deploy"

## إعداد قاعدة البيانات

1. أنشئ Cluster في MongoDB Atlas
2. أنشئ مستخدم قاعدة بيانات
3. اضبط IP Allowlist
4. انسخ connection string إلى `MONGODB_URI`
5. شغّل: `node scripts/03-mongodb-access-control.js`

## التسجيل في Pi Network

1. اذهب إلى: https://develop.pi
2. سجل التطبيق: App Name: P314، App URL: رابط Vercel
3. انتظر الموافقة

## الدعم الفني

راجع الملفات:
- `docs/DEPLOYMENT_PRODUCTION.md` - دليل النشر الكامل
- `docs/DATABASE_SETUP_GUIDE.md` - إعداد MongoDB
- `docs/DEPLOYMENT_STAGING.md` - بيئة التجربة

## الترخيص

هذا المشروع مخصص لمجتمع Pi Network
