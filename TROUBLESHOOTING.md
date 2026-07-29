# حل المشاكل الشائعة - P314

## المشكلة: لا أجد زر التحميل في v0

**الحل:**
1. انظر في أعلى نافذة الدردشة
2. ابحث عن أيقونة النقاط الثلاث (...)
3. أو ابحث عن كلمة "Export" أو "Download"

**بديل:**
- استخدم زر "Publish to Vercel" مباشرة

---

## المشكلة: خطأ في اتصال MongoDB

**الخطأ:** `MONGODB_URI not configured` أو `MongoNetworkError`

**الحل:**
1. تحقق من أن `MONGODB_URI` مضاف في Vercel Environment Variables
2. تحقق من صحة Connection String (يجب أن يبدأ بـ `mongodb+srv://`)
3. تحقق من أن IP مضاف في MongoDB Atlas Network Access (أو `0.0.0.0/0`)
4. تحقق من اسم المستخدم وكلمة المرور في الـ URI

**للتحقق:**
```bash
# في Console (F12)
console.log("MongoDB URI set:", !!process.env.MONGODB_URI)
```

**خطأ IP:** إذا ظهر `connection timed out`، اذهب إلى MongoDB Atlas → Network Access وأضف IP الخاص بـ Vercel أو `0.0.0.0/0`.

---

## المشكلة: Pi Network Authentication لا يعمل

**الخطأ:** `Pi SDK not initialized`

**الحل:**
1. تحقق من أن `PI_APP_ID` موجود في Environment Variables
2. تحقق من أن التطبيق مسجل في Pi Developer Portal
3. تحقق من أن Domain مضاف في Pi Settings

**Domain يجب أن يكون:**
- Production: `https://your-project.vercel.app`
- Development: `http://localhost:3000`

---

## المشكلة: قاعدة البيانات لا تحفظ البيانات

**الخطأ:** `Collection not found` أو البيانات لا تظهر بعد التحديث

**الحل:**
1. تشغيل سكريبت الفهارس لإنشاء الـ collections:
```bash
node scripts/03-mongodb-access-control.js
```
2. تحقق من MongoDB Atlas → Collections للتأكد من وجودها
3. تحقق من `MONGODB_DB_NAME` — يجب أن يطابق اسم قاعدة البيانات في Atlas

---

## المشكلة: القنوات لا تظهر للمستخدمين الآخررين

**السبب:** القنوات محفوظة في MongoDB — تحقق من الاتصال أولاً

**الحل:**
1. تحقق من أن `MONGODB_URI` صحيح
2. افتح MongoDB Atlas → Collections → channels وتحقق من وجود البيانات
3. راجع Console للأخطاء

---

## المشكلة: البوت بطيء أو لا يستجيب

**الحلول:**
1. تحقق من اتصال الإنترنت
2. تحقق من Vercel Deployment Logs
3. افتح MongoDB Atlas → Performance Advisor وتحقق من الفهارس

---

## المشكلة: مفاتيح التشفير لا تعمل

**الخطأ:** `Invalid encryption key`

**الحل:**
1. تحقق من أن `ENCRYPTION_KEY` يساوي بالضبط 64 حرف hex (32 bytes)
2. تحقق من أن `ENCRYPTION_IV` يساوي بالضبط 32 حرف hex (16 bytes)
3. توليد مفاتيح جديدة:
```bash
# ENCRYPTION_KEY
openssl rand -hex 32

# ENCRYPTION_IV
openssl rand -hex 16
```

---

## المشكلة: لا أستطيع النشر على Vercel

**خطوات الحل:**
1. تأكد من تسجيل الدخول بـ GitHub
2. تأكد من أن المشروع على GitHub
3. جرب "Import Project" بدلاً من "New Project"

**بديل — Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel
```

---

## المشكلة: Environment Variables لا تعمل

**الحل:**
1. في Vercel → Settings → Environment Variables
2. تأكد من إضافة كل المتغيرات
3. اضغط "Redeploy" بعد الإضافة

**مهم:** المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` يجب أن تكون موجودة في:
- Production
- Preview
- Development

---

## الحصول على المساعدة

إذا استمرت المشكلة:
1. راجع Console (F12) → Console Tab
2. راجع Vercel Deployment Logs
3. راجع MongoDB Atlas → Activity Feed
4. أرسل screenshot من الخطأ
