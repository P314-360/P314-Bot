# دليل إعداد MongoDB لـ P314

## نظرة عامة
يستخدم مشروع P314 قاعدة بيانات **MongoDB** لتخزين:
- بيانات المستخدمين
- القنوات والرسائل المشفرة
- بلاغات الاحتيال
- نظام السمعة والـ NFT

---

## الخطوة 1: إنشاء Cluster في MongoDB Atlas

1. افتح: https://cloud.mongodb.com
2. اضغط **Create** → اختر **M0 Free** للتطوير
3. **Cluster Name:** `p314-bot`
4. اختر المنطقة الأقرب لمستخدميك
5. انتظر حتى ينتهي الإنشاء

---

## الخطوة 2: إنشاء مستخدم قاعدة البيانات

1. Atlas → **Database Access** → **Add New Database User**
2. اختر **Password** authentication
3. اسم المستخدم: `p314_user`
4. كلمة المرور: اختر كلمة مرور قوية (احفظها!)
5. Permissions: `readWrite` على قاعدة بيانات `p314_bot`
6. اضغط **Add User**

---

## الخطوة 3: ضبط IP Allowlist

1. Atlas → **Network Access** → **Add IP Address**
2. اضغط **Allow Access from Anywhere** (`0.0.0.0/0`)
   - هذا مطلوب لأن Vercel يستخدم IPs ديناميكية
3. اضغط **Confirm**

---

## الخطوة 4: الحصول على Connection String

1. Atlas → **Connect** → **Drivers**
2. Driver: **Node.js**, Version: 5.5 أو أحدث
3. انسخ الـ URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. استبدل `<username>` و `<password>` بالبيانات الصحيحة
5. أضف اسم قاعدة البيانات: أضف `/p314_bot` قبل `?`
   ```
   mongodb+srv://p314_user:mypassword@cluster0.xxxxx.mongodb.net/p314_bot?retryWrites=true&w=majority
   ```

---

## الخطوة 5: إضافة المتغيرات البيئية في Vercel

1. افتح Vercel Dashboard → مشروعك
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف:

| المفتاح | القيمة |
|---------|--------|
| `MONGODB_URI` | connection string الذي نسخته |
| `MONGODB_DB_NAME` | `p314_bot` |
| `PI_APP_ID` | من Pi Developer Portal |
| `PI_API_KEY` | من Pi Developer Portal |
| `ENCRYPTION_KEY` | مفتاح hex عشوائي 64 حرف |
| `ENCRYPTION_IV` | مفتاح hex عشوائي 32 حرف |
| `SESSION_SECRET` | نص عشوائي آمن |

لتوليد مفاتيح التشفير:
```bash
openssl rand -hex 32   # للـ ENCRYPTION_KEY
openssl rand -hex 16   # للـ ENCRYPTION_IV
```

---

## الخطوة 6: تهيئة المجموعات والفهارس

بعد إضافة `MONGODB_URI`، شغّل هذا الأمر مرة واحدة:

```bash
MONGODB_URI="your_uri" node scripts/03-mongodb-access-control.js
```

سيقوم الأمر بإنشاء جميع المجموعات (Collections) مع فهارسها المحسّنة وفهارس TTL للرسائل المؤقتة.

---

## الخطوة 7: التحقق من النجاح

بعد تشغيل التطبيق، ابحث في Vercel Logs عن:
```
[P314 DB] ✓ Connection successful
```

أو في MongoDB Atlas:
1. اذهب إلى **Collections**
2. يجب أن ترى قاعدة بيانات `p314_bot` مع مجموعات مثل: `users`, `channels`, `messages`, ...

---

## المجموعات الرئيسية

| المجموعة | الوظيفة |
|---------|--------|
| `users` | بيانات المستخدمين المصادق عليهم |
| `channels` | القنوات المُنشأة من المستخدمين |
| `messages` | رسائل المحادثات |
| `chat_sessions` | جلسات الدردشة |
| `fraud_reports` | بلاغات الاحتيال |
| `wallet_verifications` | التحقق من المحافظ |
| `quest_progress` | تقدم المهام |
| `shards` | شظايا النقاط |
| `nft_contributions` | مساهمات NFT |
| `reputation_activities` | سجل نقاط السمعة |
| `referral_links` | روابط الإحالة |
| `channel_notifications` | إشعارات القنوات |

---

## المشاكل الشائعة

### المشكلة: "Connection timeout"
**الحل:** تأكد من أن `0.0.0.0/0` مضاف في Network Access

### المشكلة: "Authentication failed"
**الحل:** تحقق من اسم المستخدم وكلمة المرور في الـ URI

### المشكلة: "MONGODB_URI not configured"
**الحل:** تأكد من إضافة `MONGODB_URI` في Vercel Environment Variables

---

## الانتهاء

الآن قاعدة البيانات MongoDB جاهزة بالكامل. عد إلى `docs/DEPLOYMENT_PRODUCTION.md` وأكمل خطوات النشر.
