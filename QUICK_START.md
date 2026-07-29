# البداية السريعة - P314

## خيار 1: النشر المباشر (الأسهل - 5 دقائق)

### الخطوة 1: افتح Vercel
- اذهب إلى: https://vercel.com/new
- سجل دخول بـ Email أو GitHub

### الخطوة 2: استيراد المشروع
إذا كنت تستخدم v0.dev:
1. في v0، ابحث عن زر "Publish" أو "Deploy to Vercel"
2. اضغط عليه، ثم سجل دخول Vercel
3. سيتم النشر تلقائياً

إذا لم تجد الزر:
1. حمل المشروع كـ ZIP
2. في Vercel، اختر "Import Project"
3. ارفع ملف ZIP

### الخطوة 3: أضف Environment Variables
في Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI
MONGODB_DB_NAME
PI_API_KEY
PI_APP_ID
ENCRYPTION_KEY
ENCRYPTION_IV
SESSION_SECRET
NEXT_PUBLIC_API_URL
```

راجع `.env.local.example` للقيم التوضيحية.

### الخطوة 4: أعد النشر
- اضغط "Redeploy" في Vercel
- انتظر دقيقة
- افتح الرابط: https://your-project.vercel.app

---

## خيار 2: التشغيل المحلي (للتطوير)

### الخطوة 1: حمل المشروع
من v0.dev:
- ابحث عن "Download ZIP" في القائمة العلوية
- أو انسخ الملفات يدوياً

### الخطوة 2: إعداد البيئة
```bash
cp .env.local.example .env.local
# افتح .env.local وأضف MONGODB_URI والمتغيرات الأخرى
```

### الخطوة 3: تشغيل المشروع
```bash
cd p314-bot
pnpm install
pnpm dev
```

### الخطوة 4: افتح المتصفح
http://localhost:3000

---

## إعداد MongoDB (مرة واحدة فقط)

### الخطوة 1: أنشئ Cluster في MongoDB Atlas
1. اذهب إلى: https://cloud.mongodb.com
2. أنشئ Free Cluster (M0)
3. أنشئ مستخدم قاعدة بيانات
4. أضف IP Address (0.0.0.0/0 للسماح بجميع الاتصالات)
5. انسخ Connection String

### الخطوة 2: تشغيل سكريبت الفهارس
```bash
MONGODB_URI="your_connection_string" node scripts/03-mongodb-access-control.js
```

تم! قاعدة البيانات جاهزة.

---

## التحقق من العمل

زر البوت:
- يجب أن تظهر واجهة P314
- جرب إرسال رسالة
- جرب إنشاء قناة
- جرب تسجيل الدخول بـ Pi Network

إذا واجهت مشاكل:
1. تحقق من Console (F12)
2. تحقق من أن Environment Variables مضافة
3. تحقق من أن MONGODB_URI صحيح
4. راجع `TROUBLESHOOTING.md`

---

## التسجيل في Pi Network

بعد نشر المشروع على Vercel:

1. اذهب إلى: https://develop.pi
2. App Settings:
   - Name: P314
   - URL: https://your-project.vercel.app
   - Type: Web Application
3. انتظر الموافقة (عادة 1-3 أيام)

---

## هل تحتاج مساعدة؟

- راجع `README.md` للتفاصيل الكاملة
- راجع `TROUBLESHOOTING.md` لحل المشاكل
- راجع `MONGODB_SETUP.md` لإعداد قاعدة البيانات
