# كيفية رفع P314 إلى GitHub

## الطريقة 1: من موقع GitHub (الأسهل)

1. **إنشاء Repository:**
   - اذهب إلى https://github.com/new
   - اسم Repository: `p314-bot`
   - اختر "Public" أو "Private"
   - اضغط "Create repository"

2. **رفع الملفات:**
   - حمل المشروع من v0 كـ ZIP
   - افتح الـ ZIP واستخرج الملفات
   - اذهب إلى GitHub repository الذي أنشأته
   - اضغط "Add file" > "Upload files"
   - اسحب جميع الملفات
   - اضغط "Commit changes"

## الطريقة 2: باستخدام Git (متقدم)

إذا كان لديك Git مثبت:

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial P314 Bot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/p314-bot.git
git push -u origin main
```

## بعد الرفع

Repository جاهز للنشر على Vercel! اتبع الخطوات في `VERCEL_DEPLOYMENT.md`
