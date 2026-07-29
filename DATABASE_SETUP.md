# دليل إعداد قاعدة بيانات P314 (MongoDB)

لإعداد قاعدة البيانات بالتفصيل، راجع:

- **`MONGODB_SETUP.md`** — الدليل الشامل خطوة بخطوة لإعداد MongoDB Atlas
- **`docs/DATABASE_SETUP_GUIDE.md`** — دليل المطوّر التقني
- **`docs/DATABASE_SCHEMA.md`** — مخطط قاعدة البيانات الكامل

## ملخص سريع

1. أنشئ Cluster مجاني في https://cloud.mongodb.com
2. أنشئ مستخدم قاعدة بيانات وانسخ connection string
3. أضف `MONGODB_URI` و `MONGODB_DB_NAME=p314_bot` في Vercel Environment Variables
4. شغّل مرة واحدة: `node scripts/03-mongodb-access-control.js`
5. أعد النشر على Vercel

## الميزات الداخلية للقاعدة

- **التشفير من طرف إلى طرف (E2EE):** الرسائل مشفرة قبل الحفظ
- **الرسائل المؤقتة:** رسائل القنوات تُحذف تلقائياً (TTL index)
- **الأمان:** كل استعلام مقيّد بـ userId
- **الأداء:** 25+ فهرس محسّن لأسرع الاستعلامات
