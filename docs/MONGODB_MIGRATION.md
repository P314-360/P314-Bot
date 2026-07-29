# ═══════════════════════════════════════════════════════════════════════════════
# P314 Bot: دليل إعداد قاعدة بيانات MongoDB
# ═══════════════════════════════════════════════════════════════════════════════

## نظرة عامة

تم بناء مشروع P314 Bot بالكامل على MongoDB (قاعدة بيانات NoSQL) بدون أي تبعيات على قواعد بيانات SQL.

### الأسباب الرئيسية للهجرة:
- أداء أفضل للعمليات المعقدة
- مرونة أكثر في هيكلة البيانات
- تكاليف أقل على مستوى الإنتاج
- سهولة التوسع الأفقي

---

## الملفات المُنشأة الجديدة

### 1. `/lib/env.ts`
- **الوظيفة**: قراءة وتحقق متغيرات البيئة
- **الميزات الرئيسية**:
  - تحميل جميع متغيرات البيئة المطلوبة
  - التحقق من المتغيرات المطلوبة
  - التحقق من صحة مفاتيح التشفير
  - إرجاع كائن `env` آمن

### 2. `/lib/mongodb.ts`
- **الوظيفة**: إدارة الاتصال بـ MongoDB
- **الميزات الرئيسية**:
  - تجميع الاتصالات (Connection Pooling)
  - إعادة محاولة الاتصال
  - إنشاء المجموعات والفهارس تلقائياً
  - فحص صحة الاتصال

### 3. `/lib/mongodb-client.ts`
- **الوظيفة**: أدوات على جانب العميل (Client-side)
- **الدوال الرئيسية**:
  - `fetchFromApi()`: جلب البيانات من API
  - `postToApi()`: إرسال البيانات إلى API
  - `getFromApi()`: طلبات GET
  - `putToApi()`: تحديث البيانات
  - `deleteFromApi()`: حذف البيانات

### 4. `/lib/mongodb-server.ts`
- **الوظيفة**: أدوات على جانب الخادم (Server-side)
- **الدوال الرئيسية**:
  - `getUsersCollection()`: الوصول لمجموعة المستخدمين
  - `getSessionsCollection()`: الوصول للجلسات
  - `getMessagesCollection()`: الوصول للرسائل
  - `getChannelsCollection()`: الوصول للقنوات
  - `findUserByPiUid()`: البحث عن مستخدم
  - `withTransaction()`: تنفيذ عمليات ذرية

---

## الملفات المُحدّثة

### 1. `/lib/config.ts`
**التغييرات**:
- إضافة تحميل من `env.ts`
- إضافة متغيرات جديدة للتشفير وتحديد السرعة
- جميع قيم الإعدادات تُقرأ من متغيرات البيئة

**الإعدادات الجديدة**:
```typescript
MONGODB_URI: env.mongodbUri || "",
MONGODB_DB_NAME: env.mongodbDbName,
ENCRYPTION_KEY: env.encryptionKey || "",
```

**بعد**:
```typescript
MONGODB_URI: env.mongodbUri || "",
MONGODB_DB_NAME: env.mongodbDbName,
ENCRYPTION_KEY: env.encryptionKey || "",
ENCRYPTION_IV: env.encryptionIv || "",
```

### 2. `/lib/db.ts`
**التغييرات**:
- تم استبدال اتصال PostgreSQL بـ MongoDB
- إزالة `Pool` من `pg`
- إضافة فئة `MongoQuery` للعمليات الشائعة

**الدوال الحالية**:
- `isDatabaseConfigured()`: التحقق من الإعدادات
- `getDb()`: الحصول على instance قاعدة البيانات
- `testConnection()`: اختبار الاتصال
- `healthCheck()`: فحص صحة الاتصال

### 3. `/app/api/init-user/route.ts`
**التغييرات**:
- استبدال استدعاءات قاعدة البيانات القديمة بـ `getUsersCollection()`
- تغيير منطق البحث والإدراج
- إضافة معالجة أفضل للأخطاء

### 4. `/hooks/use-channels.ts`
**التغييرات**:
- إزالة الاشتراكات الفعلية في الوقت الحقيقي
- إضافة polling كل 5 ثوانٍ بدلاً من الاشتراكات
- استخدام `getFromApi()` و `postToApi()` من mongodb-client

---

## ملفات API الجديدة

### 1. `/app/api/channels/list/route.ts`
- **الغرض**: جلب قائمة القنوات
- **الوسائط**:
  - `skip`: عدد السجلات المراد تخطيها (للترقيم)
  - `limit`: عدد السجلات المراد جلبها
  - `sort`: حقل الفرز والاتجاه

### 2. `/app/api/channels/create/route.ts`
- **الغرض**: إنشاء قناة جديدة
- **الوسائط المطلوبة**:
  - `name`: اسم القناة
  - `description`: وصف القناة
  - `ownerUsername`: اسم مالك القناة
  - `ownerPiUid`: معرّف Pi للمالك

---

## ملف البيئة الجديد (`.env.example`)

```env
# ─── MongoDB Configuration ───
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p314?retryWrites=true&w=majority
MONGODB_DB_NAME=p314_bot

# ─── Encryption Keys ───
ENCRYPTION_KEY=your_32_char_hex_string_here
ENCRYPTION_IV=your_16_char_hex_string_here

# ─── Session Configuration ───
SESSION_SECRET=your_session_secret_here
SESSION_TIMEOUT_MS=86400000
```

---

## مجموعات MongoDB المُنشأة

### 1. `users`
- **الفهارس**: `piUid` (فريد)، `email`، `createdAt`
- **الحقول الرئيسية**:
  - `piUid`: معرّف Pi الفريد
  - `piUsername`: اسم المستخدم
  - `reputation`: كائن النقاط والمستوى
  - `wallet`: معلومات المحفظة
  - `settings`: إعدادات المستخدم

### 2. `sessions`
- **الفهارس**: `userId`، `expiresAt` (مع انتهاء الصلاحية)
- **الحقول الرئيسية**:
  - `userId`: معرّف المستخدم
  - `token`: رمز الجلسة
  - `expiresAt`: وقت انتهاء الصلاحية

### 3. `messages`
- **الفهارس**: `userId + createdAt`، `channelId + createdAt`
- **الحقول الرئيسية**:
  - `userId`: مرسل الرسالة
  - `channelId`: القناة
  - `content`: محتوى الرسالة
  - `encrypted`: هل الرسالة مشفرة
  - `createdAt`: وقت الإنشاء

### 4. `channels`
- **الفهارس**: `name`، `ownerId`، `createdAt`
- **الحقول الرئيسية**:
  - `name`: اسم القناة
  - `description`: الوصف
  - `ownerId`: معرّف المالك
  - `members`: قائمة الأعضاء
  - `subscribers`: عدد المشتركين

### 5. `quests`
- **الفهارس**: `userId`، `status`
- **الحقول الرئيسية**:
  - `userId`: معرّف المستخدم
  - `questId`: معرّف المهمة
  - `status`: الحالة (pending, completed, etc.)
  - `rewards`: المكافآت

### 6. `reputation`
- **الفهارس**: `userId`، `score`
- **الحقول الرئيسية**:
  - `userId`: معرّف المستخدم
  - `score`: النقاط
  - `level`: مستوى السمعة
  - `multiplier`: مضاعف المكافآت

### 7. `fraudReports`
- **الفهارس**: `reportedUserId`، `status`، `createdAt`
- **الحقول الرئيسية**:
  - `reportedUserId`: معرّف المستخدم المبلّغ عنه
  - `reporterId`: معرّف المبلّغ
  - `status`: حالة التقرير
  - `evidence`: الأدلة

---

## خطوات الإعداد

### 1. تثبيت المكتبة
```bash
pnpm add mongodb@6.3.0
```

### 2. إعداد متغيرات البيئة في Vercel
```
MONGODB_URI: mongodb+srv://user:pass@cluster.mongodb.net/p314?retryWrites=true&w=majority
MONGODB_DB_NAME: p314_bot
ENCRYPTION_KEY: (generate with: openssl rand -hex 32)
ENCRYPTION_IV: (generate with: openssl rand -hex 16)
SESSION_SECRET: (any secure string)
```

### 3. اختبار الاتصال
```typescript
import { testConnection } from "@/lib/db"

const connected = await testConnection()
console.log("Connected:", connected)
```

---

## الميزات المحفوظة

جميع الميزات الأمنية والخوارزميات تم الحفاظ عليها:

✅ **التشفير**:
- ECDH + AES-GCM للرسائل المباشرة
- جميع مفاتيح التشفير محفوظة كما هي

✅ **المصادقة**:
- Pi Network OAuth محفوظ بنفس الطريقة
- Guest Mode محفوظ بنفس المنطق
- جلسات آمنة محفوظة

✅ **الأمان**:
- تحديد السرعة (Rate Limiting) محفوظ
- التحقق من المدخلات محفوظ
- رؤوس الأمان HTTP محفوظة

✅ **الأداء**:
- تخزين مؤقت محسّن
- فهارس قاعدة البيانات
- تجميع الاتصالات

---

## الملفات المُهملة - تم الحذف

الملفات الخاصة بقاعدة البيانات القديمة تم حذفها بالكامل من المشروع. لا يوجد أي تبعية على قواعد بيانات أخرى.

---

## الفروقات الرئيسية

| الميزة | SQL (القديم) | MongoDB (الحالي) |
|--------|------------|-----------------|
| نوع قاعدة البيانات | Relational SQL | NoSQL (Document) |
| الاشتراكات الفعلية | نعم | API Polling (5s) |
| معرّف السجل | uuid | ObjectId |
| التشفير | جانب التطبيق | محفوظ كما هو |
| الأداء | جيد | ممتاز للعمليات المعقدة |

---

## استكشاف الأخطاء

### المشكلة: "MONGODB_URI not configured"
**الحل**: تأكد من إضافة `MONGODB_URI` في إعدادات البيئة في Vercel

### المشكلة: "Connection timeout"
**الحل**: تحقق من قائمة السماح بـ IP في MongoDB Atlas

### المشكلة: "Authentication failed"
**الحل**: ت��قق من اسم المستخدم وكلمة المرور والمجموعة في الـ URI

---

## الخطوات التالية

1. إضافة `MONGODB_URI` في Vercel Environment Variables
2. تشغيل `scripts/03-mongodb-access-control.js` لإنشاء الفهارس
3. اختبار جميع APIs والـ Hooks
4. اختبار شامل قبل الإطلاق الفعلي

---

## الدعم والمراجع

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Connection: https://www.mongodb.com/docs/drivers/node/current/connection/
- Best Practices: https://www.mongodb.com/docs/manual/core/data-modeling/

---

**تاريخ التحديث**: يوليو 2026
**الحالة**: ✅ تم الانتهاء من الهجرة الأساسية
