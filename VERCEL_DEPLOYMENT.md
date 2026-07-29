# دليل نشر P314 على Vercel وربطه بـ Pi Network

## الخطوة 1: إنشاء حساب GitHub ورفع المشروع

1. اذهب إلى https://github.com وأنشئ حساب (إذا لم يكن لديك)
2. أنشئ repository جديد باسم `p314-bot`
3. حمل المشروع من v0 كـ ZIP
4. ارفع الملفات إلى GitHub repository

## الخطوة 2: إنشاء حساب Vercel

1. اذهب إلى https://vercel.com
2. اضغط "Sign Up" واختر "Continue with GitHub"
3. امنح Vercel الصلاحيات للوصول لـ GitHub

## الخطوة 3: نشر المشروع

1. من لوحة تحكم Vercel، اضغط "Add New Project"
2. اختر `p314-bot` repository
3. اضغط "Deploy" (سينشر تلقائياً)

## الخطوة 4: إضافة Environment Variables

في Vercel Project Settings > Environment Variables، أضف:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot
PI_API_KEY=your_pi_api_key
PI_APP_ID=p314-aa57cb98de8ff227
NEXT_PUBLIC_PI_NETWORK_URL=https://api.minepi.com
ENCRYPTION_KEY=<openssl rand -hex 32>
ENCRYPTION_IV=<openssl rand -hex 16>
SESSION_SECRET=<random_secure_string>
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
```

اضغط "Save" ثم "Redeploy"

## الخطوة 5: إعداد MongoDB Atlas

1. اذهب إلى https://cloud.mongodb.com
2. أنشئ مشروع وـ Cluster جديد (M0 مجاني)
3. أنشئ مستخدم قاعدة بيانات
4. في Network Access: أضف `0.0.0.0/0` أو IP محدد لـ Vercel
5. انسخ Connection String وأضفه كـ `MONGODB_URI`
6. شغّل سكريبت الفهارس:
```bash
node scripts/03-mongodb-access-control.js
```

## الخطوة 6: ربط Pi Network

1. اذهب إلى Pi Developer Portal: https://develop.pi
2. افتح تطبيقك `p314-aa57cb98de8ff227`
3. في App Settings:
   - **App URL**: أضف رابط Vercel (مثل: `https://p314.vercel.app`)
   - **Redirect URL**: نفس الرابط
4. احفظ التغييرات

## الخطوة 7: اختبار التطبيق

1. افتح رابط Vercel الخاص بك
2. جرب المصادقة بحساب Pi
3. جرب إنشاء قناة والانضمام إليها

## الخطوة 8: نشر في Pi Browser

1. من Pi Developer Portal
2. اذهب إلى "Submit for Review"
3. املأ معلومات التطبيق
4. اضغط "Submit"

بعد الموافقة، سيظهر P314 في Pi Browser لجميع مستخدمي Pi Network.

---

## التكلفة النهائية: 0$ (مجاني 100%)

- Vercel: مجاني للمشاريع الشخصية
- MongoDB Atlas: 512 MB مجاني (M0 Cluster)
- Pi Network: مجاني

---

## الدعم

إذا واجهت أي مشكلة:
1. تحقق من Vercel Logs
2. تحقق من MongoDB Atlas → Activity Feed
3. تحقق من Pi Network Developer Console
4. راجع `TROUBLESHOOTING.md`
