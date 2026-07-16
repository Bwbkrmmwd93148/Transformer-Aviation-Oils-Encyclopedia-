# دليل التثبيت والتشغيل
# Installation and Setup Guide

## 📋 المتطلبات الأساسية / Prerequisites

- **Node.js** v14 أو أحدث (v14 or higher)
- **npm** أو **yarn**
- **MySQL** v5.7 أو أحدث (v5.7 or higher)
- **Git** (اختياري / optional)

---

## 🚀 خطوات التثبيت / Installation Steps

### 1. استنساخ المشروع / Clone the Project

```bash
git clone <repository-url>
cd abu_bakr_dynamic_site
```

### 2. تثبيت المكتبات / Install Dependencies

```bash
npm install
```

أو باستخدام yarn:
```bash
yarn install
```

### 3. إعداد قاعدة البيانات / Setup Database

#### الطريقة الأولى: استخدام MySQL CLI
```bash
mysql -u root -p < config/database.sql
```

#### الطريقة الثانية: استخدام MySQL Workbench
1. افتح MySQL Workbench
2. اذهب إلى File → Open SQL Script
3. اختر ملف `config/database.sql`
4. اضغط Execute

#### الطريقة الثالثة: إنشاء يدوي
```sql
CREATE DATABASE IF NOT EXISTS abu_bakr_oil_site;
USE abu_bakr_oil_site;

-- ثم قم بتشغيل محتوى ملف config/database.sql
```

### 4. إعداد متغيرات البيئة / Setup Environment Variables

أنشئ ملف `.env` في جذر المشروع:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=abu_bakr_oil_site
DB_PORT=3306

# Session Configuration
SESSION_SECRET=your_session_secret_key_here

# Email Configuration (اختياري / optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password

# Site Configuration
SITE_URL=http://localhost:3000
SITE_NAME=أبو بكر محمود
```

### 5. تشغيل الخادم / Start the Server

#### في بيئة التطوير / Development Mode:
```bash
npm run dev
```

#### في بيئة الإنتاج / Production Mode:
```bash
npm start
```

---

## 🌐 الوصول للموقع / Access the Website

بعد تشغيل الخادم، افتح متصفحك وانتقل إلى:

```
http://localhost:3000
```

### تغيير اللغة / Change Language

أضف معامل `lang` إلى الرابط:

```
http://localhost:3000/?lang=en      # English
http://localhost:3000/?lang=ar      # العربية
http://localhost:3000/?lang=fr      # Français
http://localhost:3000/?lang=de      # Deutsch
http://localhost:3000/?lang=es      # Español
http://localhost:3000/?lang=it      # Italiano
http://localhost:3000/?lang=pt      # Português
http://localhost:3000/?lang=ja      # 日本語
http://localhost:3000/?lang=zh      # 中文
http://localhost:3000/?lang=ru      # Русский
```

---

## 🧪 تشغيل الاختبارات / Running Tests

```bash
npm test
```

أو:

```bash
node tests/test.js
```

---

## 📁 هيكل المشروع / Project Structure

```
abu_bakr_dynamic_site/
├── config/                  # إعدادات التطبيق
│   ├── database.js         # إعدادات قاعدة البيانات
│   └── database.sql        # ملف SQL لإنشاء الجداول
├── middleware/             # Middleware functions
│   └── i18n.js            # نظام الترجمة المتعدد
├── models/                 # نماذج قاعدة البيانات
│   ├── Article.js
│   ├── User.js
│   ├── Comment.js
│   └── Category.js
├── routes/                 # المسارات
│   ├── home.js
│   ├── articles.js
│   ├── auth.js
│   ├── admin.js
│   └── api.js
├── views/                  # قوالب EJS
│   ├── layout.ejs
│   ├── index.ejs
│   ├── article.ejs
│   ├── category.ejs
│   ├── search.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   └── 404.ejs
├── public/                 # ملفات ثابتة
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── locales/               # ملفات الترجمة
│   └── translations.json
├── data/                  # بيانات المقالات
│   └── articles.json
├── tests/                 # الاختبارات
│   └── test.js
├── server/               # ملفات الخادم
│   └── index.js
├── .env                  # متغيرات البيئة
├── package.json          # المكتبات والتبعيات
└── README.md            # دليل المشروع
```

---

## 🔧 استكشاف الأخطاء / Troubleshooting

### المشكلة: خطأ في الاتصال بقاعدة البيانات
**الحل:**
1. تأكد من أن MySQL يعمل
2. تحقق من بيانات الاتصال في ملف `.env`
3. تأكد من أن قاعدة البيانات موجودة

### المشكلة: الصور لا تظهر
**الحل:**
1. تأكد من وجود مجلد `public/images`
2. تحقق من مسارات الصور في الملفات
3. أعد تشغيل الخادم

### المشكلة: الترجمة لا تعمل
**الحل:**
1. تأكد من وجود ملف `locales/translations.json`
2. تحقق من صحة JSON في الملف
3. امسح ملفات الكوكيز وأعد تحميل الصفحة

### المشكلة: خطأ في npm install
**الحل:**
```bash
# حذف node_modules وملف package-lock.json
rm -rf node_modules package-lock.json

# إعادة التثبيت
npm install
```

---

## 📚 المكتبات المستخدمة / Dependencies

### Backend
- **express** - خادم الويب
- **mysql2** - قاعدة البيانات
- **ejs** - محرك القوالب
- **bcryptjs** - تشفير كلمات المرور
- **express-validator** - التحقق من البيانات
- **helmet** - أمان HTTP
- **cors** - السماح بالطلبات من مصادر أخرى
- **dotenv** - متغيرات البيئة

### Development
- **nodemon** - إعادة تشغيل تلقائية
- **jest** - اختبارات الوحدة

---

## 🔐 الأمان / Security

### نصائح الأمان:
1. ✅ غيّر `SESSION_SECRET` إلى قيمة قوية
2. ✅ استخدم HTTPS في الإنتاج
3. ✅ حدّث المكتبات بانتظام
4. ✅ لا تشارك ملف `.env` في الإنترنت
5. ✅ استخدم كلمات مرور قوية لقاعدة البيانات

---

## 📞 الدعم والمساعدة / Support

إذا واجهت أي مشاكل:

1. تحقق من ملف `README.md`
2. اقرأ رسائل الخطأ بعناية
3. تحقق من سجلات الخادم
4. اتصل بفريق الدعم

---

## 📝 ملاحظات مهمة / Important Notes

- ✅ تأكد من أن المنفذ 3000 غير مستخدم
- ✅ تأكد من أن MySQL يعمل قبل تشغيل الخادم
- ✅ استخدم Node.js v14 أو أحدث
- ✅ تحديث المكتبات بانتظام

---

**آخر تحديث: يناير 2024**
