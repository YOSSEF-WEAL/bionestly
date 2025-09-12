# BioNestly - Linktree Clone

موقع مثل Linktree مبني باستخدام Next.js و Supabase مع نظام مصادقة كامل.

## المميزات

- 🔐 نظام مصادقة كامل مع Supabase
- 📧 تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- 🔍 تسجيل الدخول عبر Google OAuth
- 👤 إنشاء ملف شخصي تلقائياً
- 🔄 إعادة تعيين كلمة المرور
- 📱 تصميم متجاوب
- 🌙 دعم الوضع المظلم
- 🎨 واجهة مستخدم جميلة مع Tailwind CSS

## التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19
- **Backend**: Supabase (Auth + Database)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React

## البدء

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env.local` وأضف قيم Supabase الخاصة بك:

```bash
cp .env.example .env.local
```

املأ المتغيرات التالية في `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here
```

### 3. إعداد قاعدة البيانات

قم بتشغيل الكود SQL الموجود في `supabase-schema.sql` في لوحة تحكم Supabase لإنشاء جدول `profiles` والـ triggers المطلوبة.

### 4. إعداد Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعل Google+ API
4. أنشئ OAuth 2.0 credentials
5. أضف `http://localhost:3000/auth/oauth` إلى Authorized redirect URIs
6. انسخ Client ID و Client Secret إلى `.env.local`

### 5. إعداد Supabase OAuth

في لوحة تحكم Supabase:
1. اذهب إلى Authentication > Providers
2. فعل Google provider
3. أضف Google Client ID و Client Secret
4. أضف `http://localhost:3000/auth/oauth` إلى Redirect URLs

### 6. تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## بنية المشروع

```
├── app/
│   ├── _blocks/          # مكونات Header و UserMenu
│   ├── _services/        # خدمات المصادقة (غير مستخدمة حالياً)
│   ├── account/          # صفحة الحساب المحمية
│   ├── api/auth/         # API routes للمصادقة
│   ├── auth/             # صفحات المصادقة
│   └── layout.js         # Layout الرئيسي
├── components/
│   ├── ui/               # مكونات UI الأساسية
│   ├── login-form.jsx    # نموذج تسجيل الدخول
│   ├── sign-up-form.jsx  # نموذج إنشاء حساب
│   └── ...
├── lib/
│   ├── client.js         # Supabase client للمتصفح
│   ├── server.js         # Supabase client للخادم
│   ├── middleware.js     # Middleware للمصادقة
│   └── utils.js          # دوال مساعدة
└── middleware.js         # Next.js middleware
```

## المشاكل المحلولة

✅ مشكلة `useRouter` في `logout-button.jsx`  
✅ تسجيل الخروج لا يعمل بشكل صحيح  
✅ Header لا يتحدث بعد تسجيل الدخول بـ Google  
✅ تسجيل الدخول بـ Email والـ Password  
✅ إنشاء Profile تلقائياً عند تسجيل الدخول أول مرة  
✅ مشكلة Forgot Password  
✅ الصور المفقودة (استخدام UI Avatars كـ fallback)  

## الميزات القادمة

- [ ] صفحة إدارة الروابط
- [ ] تخصيص الثيم والألوان
- [ ] إحصائيات النقرات
- [ ] رفع الصور المخصصة
- [ ] SEO optimization

## المساهمة

مرحب بالمساهمات! يرجى فتح issue أو pull request.

## الترخيص

MIT License
