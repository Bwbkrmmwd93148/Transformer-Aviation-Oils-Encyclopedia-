# تعليمات النشر السريعة على الإنترنت
# Quick Deployment Instructions

## 🚀 الطريقة الأسهل: استخدام Railway

### الخطوة 1: إنشاء حساب Railway
1. اذهب إلى: https://railway.app
2. اضغط "Sign Up"
3. استخدم حسابك على GitHub أو Google

---

### الخطوة 2: ربط المشروع

#### الطريقة أ: من خلال GitHub (الأسهل)

1. **رفع المشروع إلى GitHub:**
   ```bash
   cd /home/ubuntu/abu_bakr_dynamic_site
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/abu-bakr-oil-site.git
   git push -u origin main
   ```

2. **في لوحة تحكم Railway:**
   - اضغط "New Project"
   - اختر "Deploy from GitHub"
   - اختر المستودع الخاص بك
   - اضغط "Deploy"

#### الطريقة ب: من خلال Railway CLI

```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
cd /home/ubuntu/abu_bakr_dynamic_site
railway link

# نشر المشروع
railway up
```

---

### الخطوة 3: إضافة قاعدة البيانات

1. في لوحة تحكم Railway:
   - اضغط "New Service"
   - اختر "Database"
   - اختر "MySQL"
   - اضغط "Create"

2. انسخ رابط الاتصال (Connection String)

3. أضف المتغيرات:
   - اضغط "Variables"
   - أضف:
     ```
     DATABASE_URL = <الرابط الذي نسخته>
     NODE_ENV = production
     SESSION_SECRET = your_secret_key_here
     ```

---

### الخطوة 4: الحصول على الرابط

1. في لوحة تحكم Railway:
   - اختر "Deployments"
   - انظر إلى "Domains"
   - ستجد رابط مثل: `https://your-project-name.railway.app`

---

## 🌐 الرابط النهائي:

بعد النشر، سيكون الموقع متاحاً على:

```
https://your-project-name.railway.app
```

---

## 🔄 تغيير اللغة:

```
https://your-project-name.railway.app/?lang=en      # English
https://your-project-name.railway.app/?lang=ar      # العربية
https://your-project-name.railway.app/?lang=fr      # Français
... إلخ
```

---

## ✅ التحقق من النشر:

1. افتح الرابط في المتصفح
2. تأكد من ظهور الصفحة الرئيسية
3. جرّب تغيير اللغة
4. جرّب البحث والتنقل

---

## 🆘 استكشاف الأخطاء:

### الموقع يعرض خطأ:
1. تحقق من السجلات في Railway
2. تأكد من متغيرات البيئة
3. تأكد من اتصال قاعدة البيانات

### قاعدة البيانات لا تعمل:
1. تأكد من تشغيل MySQL
2. تأكد من رابط الاتصال صحيح
3. قم بتشغيل ملف SQL

### الصور لا تظهر:
1. تأكد من وجود مجلد `public/images`
2. تحقق من مسارات الصور

---

## 📝 ملاحظات مهمة:

- ✅ تأكد من تحديث ملف `.env` بقيم الإنتاج
- ✅ استخدم كلمات مرور قوية
- ✅ احتفظ بنسخة احترياطية من البيانات
- ✅ راقب أداء الموقع بعد النشر

---

## 🎯 خطوات إضافية (اختيارية):

### إضافة نطاق مخصص (Domain):
1. اشتري نطاق من GoDaddy أو Namecheap
2. في Railway، اذهب إلى "Domains"
3. أضف النطاق الخاص بك
4. اتبع التعليمات

### إضافة SSL (HTTPS):
- Railway يضيف SSL تلقائياً ✅

### تفعيل البريد الإلكتروني:
- أضف متغيرات SMTP في البيئة
- استخدم Gmail أو Mailgun

---

**النشر يستغرق 5-10 دقائق فقط! 🚀**

هل تريد مساعدة في أي خطوة؟
