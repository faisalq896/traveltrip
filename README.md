# دليل فيصل — تايلاند 2026

## هيكل المشروع

- `index.html` — هيكل الصفحة ونقاط تحميل الملفات.
- `assets/css/app.css` — جميع أنماط الواجهة.
- `assets/js/app.js` — منطق التطبيق وإدارة الحالة.
- `data.js` — بيانات المطاعم والمقاهي والمولات.
- `assets/images/` — مخصص للصور المحلية مستقبلاً.

## تطوير المشروع

يتطلب تشغيل أدوات الجودة Node.js 20 أو أحدث. بعد تثبيته، نفّذ:

```powershell
npm install
npm run verify
```

الأوامر المتاحة:

- `npm run format` — تنسيق الملفات.
- `npm run format:check` — التحقق من التنسيق دون تعديل.
- `npm run lint` — فحص أخطاء JavaScript.
- `npm test` — تشغيل اختبارات السلامة الأساسية.
- `npm run verify` — تشغيل جميع الفحوصات.

هذا الموقع جاهز للنشر على GitHub Pages.

## خطوات النشر

1. افتح موجه الأوامر في المجلد `C:\Users\faisal  PC\phuket-guide`.
2. أنشئ مستودع Git جديد:

```powershell
cd "C:\Users\faisal  PC\phuket-guide"
git init
git add index.html data.js assets README.md
git commit -m "Initial commit"
```

3. أنشئ مستودع جديد على GitHub باسم `phuket-guide` أو أي اسم تريده.
4. اربط المستودع المحلي بالمستودع البعيد:

```powershell
git remote add origin https://github.com/USERNAME/phuket-guide.git
git branch -M main
git push -u origin main
```

5. فعل GitHub Pages من إعدادات المستودع:
   - اختر `Source` = `Branch: main` و `Folder: / (root)`.
   - احفظ.

6. افتح الموقع في المتصفح بعد النشر على الرابط:

```
https://USERNAME.github.io/phuket-guide/
```

## محتويات

- `index.html` — صفحة الموقع كاملة.
- `README.md` — تعليمات النشر.

> ملاحظة: إذا أردت اسم نطاق مخصص، أضف ملف `CNAME` بالمجلد الجذر.
