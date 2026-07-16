# دليل نشر الموقع على الإنترنت
# Website Deployment Guide

## 🌐 خيارات النشر المتاحة / Available Deployment Options

---

## 1️⃣ **Heroku** (الخيار الأسهل والأسرع)

### المميزات:
- ✅ سهل جداً للمبتدئين
- ✅ نسخة مجانية متاحة
- ✅ دعم Node.js كامل
- ✅ قاعدة بيانات مجانية (JawsDB)
- ✅ SSL مجاني

### خطوات النشر:

#### 1. إنشاء حساب Heroku
```bash
# تثبيت Heroku CLI
# Windows: تحميل من https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew tap heroku/brew && brew install heroku
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# تسجيل الدخول
heroku login
```

#### 2. إنشاء تطبيق على Heroku
```bash
cd /home/ubuntu/abu_bakr_dynamic_site
heroku create abu-bakr-oil-site
```

#### 3. إضافة قاعدة البيانات
```bash
# إضافة JawsDB MySQL
heroku addons:create jawsdb:kitefin

# الحصول على رابط الاتصال
heroku config:get JAWSDB_URL
```

#### 4. تحديث ملف .env
```bash
# إضافة متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your_secret_key
```

#### 5. نشر الموقع
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### 6. الوصول للموقع
```
https://abu-bakr-oil-site.herokuapp.com
```

---

## 2️⃣ **Railway** (الخيار الحديث والسريع)

### المميزات:
- ✅ سهل جداً
- ✅ نسخة مجانية متاحة ($5 شهرياً)
- ✅ دعم Node.js وMySQL
- ✅ واجهة حديثة
- ✅ سرعة عالية

### خطوات النشر:

#### 1. إنشاء حساب Railway
زيارة: https://railway.app

#### 2. ربط المشروع
```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# نشر المشروع
railway up
```

#### 3. إضافة قاعدة البيانات
- انتقل إلى لوحة التحكم
- اضغط "New"
- اختر "Database"
- اختر "MySQL"
- انسخ رابط الاتصال

#### 4. الوصول للموقع
```
https://your-project-name.railway.app
```

---

## 3️⃣ **Render** (الخيار المستقر)

### المميزات:
- ✅ نسخة مجانية متاحة
- ✅ دعم Node.js وMySQL
- ✅ أداء عالي
- ✅ سهل الاستخدام

### خطوات النشر:

#### 1. إنشاء حساب Render
زيارة: https://render.com

#### 2. إنشاء Web Service
- اضغط "New +"
- اختر "Web Service"
- ربط مستودع GitHub الخاص بك
- اختر الفرع الرئيسي

#### 3. إعدادات التطبيق
```
Build Command: npm install
Start Command: npm start
```

#### 4. إضافة متغيرات البيئة
- اضغط "Environment"
- أضف متغيرات من ملف .env

#### 5. الوصول للموقع
```
https://your-project-name.onrender.com
```

---

## 4️⃣ **DigitalOcean** (الخيار الاحترافي)

### المميزات:
- ✅ أداء عالي جداً
- ✅ تحكم كامل
- ✅ سعر معقول ($5-$6 شهرياً)
- ✅ دعم فني جيد

### خطوات النشر:

#### 1. إنشاء حساب DigitalOcean
زيارة: https://www.digitalocean.com

#### 2. إنشاء Droplet (خادم افتراضي)
- اختر Ubuntu 20.04 LTS
- اختر الخطة الأساسية ($5/شهر)
- اختر المنطقة الأقرب

#### 3. الاتصال بالخادم
```bash
ssh root@your_droplet_ip
```

#### 4. تثبيت البرامج المطلوبة
```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# تثبيت MySQL
apt install -y mysql-server

# تثبيت Nginx (خادم ويب عكسي)
apt install -y nginx
```

#### 5. نسخ المشروع
```bash
# تثبيت Git
apt install -y git

# استنساخ المشروع
git clone <repository-url> /var/www/abu-bakr-oil-site
cd /var/www/abu-bakr-oil-site

# تثبيت المكتبات
npm install
```

#### 6. إعداد قاعدة البيانات
```bash
mysql -u root -p < config/database.sql
```

#### 7. إعداد Nginx
```bash
# إنشاء ملف إعدادات
nano /etc/nginx/sites-available/abu-bakr-oil-site
```

أضف المحتوى التالي:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 8. تفعيل الموقع
```bash
ln -s /etc/nginx/sites-available/abu-bakr-oil-site /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 9. تشغيل التطبيق (استخدام PM2)
```bash
npm install -g pm2
pm2 start server/index.js --name "abu-bakr-oil-site"
pm2 startup
pm2 save
```

#### 10. إضافة SSL (HTTPS)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

## 5️⃣ **AWS** (الخيار الاحترافي المتقدم)

### المميزات:
- ✅ أداء عالي جداً
- ✅ قابل للتوسع
- ✅ نسخة مجانية لمدة سنة
- ✅ دعم فني ممتاز

### خطوات النشر:

#### 1. إنشاء حساب AWS
زيارة: https://aws.amazon.com

#### 2. إنشاء EC2 Instance
- اختر Ubuntu 20.04 LTS
- اختر t2.micro (مجاني)
- اتبع نفس خطوات DigitalOcean

#### 3. إضافة RDS (قاعدة البيانات)
- انتقل إلى RDS
- اختر MySQL
- اختر النسخة المجانية

---

## 6️⃣ **Google Cloud** (الخيار الموثوق)

### المميزات:
- ✅ أداء عالي
- ✅ نسخة مجانية متاحة
- ✅ دعم فني ممتاز
- ✅ قابل للتوسع

### خطوات النشر:

#### 1. إنشاء حساب Google Cloud
زيارة: https://cloud.google.com

#### 2. إنشاء Compute Engine
- اختر Ubuntu 20.04 LTS
- اختر النسخة المجانية

#### 3. اتبع نفس خطوات DigitalOcean

---

## 📊 مقارنة الخيارات

| الخيار | السعر | السهولة | الأداء | التحكم |
|--------|------|--------|--------|--------|
| Heroku | مجاني/دفع | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Railway | $5+ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Render | مجاني/دفع | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| DigitalOcean | $5+ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| AWS | مجاني/دفع | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Google Cloud | مجاني/دفع | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ التوصية الأفضل للمبتدئين:

### **Railway** أو **Heroku**
- سهلة جداً
- نسخة مجانية متاحة
- أداء جيد
- دعم فني جيد

---

## 🔒 نصائح الأمان عند النشر:

1. ✅ استخدم HTTPS دائماً
2. ✅ غيّر `SESSION_SECRET` إلى قيمة قوية
3. ✅ استخدم كلمات مرور قوية لقاعدة البيانات
4. ✅ حدّث المكتبات بانتظام
5. ✅ استخدم متغيرات البيئة للمعلومات الحساسة
6. ✅ فعّل جدار الحماية
7. ✅ استخدم SSL/TLS

---

## 📝 ملاحظات مهمة:

- ✅ تأكد من أن ملف `.env` لا يُرفع إلى المستودع
- ✅ استخدم `.gitignore` لاستبعاد الملفات الحساسة
- ✅ اختبر الموقع محلياً قبل النشر
- ✅ احتفظ بنسخة احتياطية من قاعدة البيانات
- ✅ راقب أداء الموقع بعد النشر

---

## 🆘 استكشاف الأخطاء:

### الموقع لا يعمل بعد النشر:
1. تحقق من السجلات (logs)
2. تأكد من متغيرات البيئة
3. تأكد من اتصال قاعدة البيانات
4. تأكد من أن جميع المكتبات مثبتة

### الصور لا تظهر:
1. تحقق من مسارات الصور
2. تأكد من وجود مجلد `public`
3. تحقق من أذونات الملفات

### الترجمة لا تعمل:
1. تأكد من وجود ملف `locales/translations.json`
2. امسح ملفات الكوكيز
3. أعد تحميل الصفحة

---

## 📞 الدعم والمساعدة:

إذا واجهت أي مشاكل:
- اقرأ التوثيق الرسمي للخدمة
- ابحث عن الخطأ على Google
- اطلب المساعدة من مجتمع المطورين

---

**آخر تحديث: يناير 2024**
