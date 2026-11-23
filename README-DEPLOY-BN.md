# Supabase + Netlify ডেপ্লয় গাইড

এই প্রজেক্টে React/Vite frontend, Netlify Functions-এ Express API, Drizzle ORM এবং Supabase PostgreSQL আছে। Deploy-এর আগে Supabase schema তৈরি ও production seed চালাতে হবে।

## ১. Supabase project তৈরি করুন

1. [supabase.com](https://supabase.com/) এ sign in করে **New project** বানান। Database password নিরাপদে সংরক্ষণ করুন।
2. Project খুলে **Connect** / **Database settings → Connection string** থেকে **Transaction pooler** URI নিন (সাধারণত port `6543`). Password-এর `[YOUR-PASSWORD]` অংশ বসান। URI-তে query parameter না থাকলে শেষে `?sslmode=require`, আগে থেকেই `?` থাকলে `&sslmode=require` যোগ করুন। URI-র password-এ special character থাকলে URL encode করতে হবে।
3. Supabase **SQL Editor → New query** খুলে project-এর `drizzle/0000_gray_bloodstrike.sql` ফাইলের সম্পূর্ণ SQL paste করে **Run** দিন। এটি ২৭টি প্রয়োজনীয় table/index তৈরি করে।
4. Supabase **Authentication → URL Configuration** এ Netlify domain-টি allowed redirect URL-এ যোগ করুন। Google login চালু করতে চাইলে Authentication → Providers → Google-এ provider credential যোগ ও enable করুন।

> `DATABASE_URL` হবে Supabase **Transaction pooler** connection string; Supabase `service_role` key বা database password কখনও browser code/GitHub-এ দেবেন না।

## ২. Netlify-তে deploy করুন

1. এই project-টি GitHub repository-তে upload করুন; `.env`, `.env.local` বা কোনো secret commit করবেন না। `.env.example` commit করা নিরাপদ template।
2. Netlify-তে **Add new site → Import an existing project** নির্বাচন করে GitHub repository connect করুন। Root directory project root-ই রাখুন; `netlify.toml` build command (`npm run build`), publish folder (`dist`) এবং Functions folder আগেই সেট করে।
3. Netlify site → **Project configuration → Environment variables** এ নিচের variable-গুলো দিন (Production, Deploy previews, Branch deploy প্রযোজ্য scope-এ):
   - `DATABASE_URL` — Supabase transaction-pooler connection URI
   - `SESSION_SECRET` — অন্তত ৩২ random byte-এর secret; উদাহরণ: `openssl rand -base64 48` চালিয়ে তৈরি করুন
   - `BOOTSTRAP_ADMIN_EMAIL` — আপনার নিজস্ব administrator email
   - `BOOTSTRAP_ADMIN_PASSWORD` — শক্তিশালী, অনন্য administrator password (কমপক্ষে ১২ অক্ষর)
   - `NODE_ENV` — `production`
4. Project-এর local clone-এ `.env` ফাইল তৈরি করে উপরের production variables (Supabase `DATABASE_URL`, `SESSION_SECRET`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, `NODE_ENV=production`) দিন, তারপর repository root-এ `npm ci && npm run db:seed` চালান। এটি ১টি admin account তৈরি করবে; production-এ demo staff/customer account নিষ্ক্রিয় থাকবে। `.env` কখনো GitHub-এ push করবেন না।
5. **Deploys → Trigger deploy → Clear cache and deploy site** দিয়ে deployment করুন। `npm run build` ও `npm run lint` local-এ সফল হওয়া উচিত।
6. Deploy শেষ হলে `https://আপনার-site.netlify.app/api/health` খুলে `{"ok":true,...}` দেখুন। Netlify logs-এ `Database service temporarily unavailable` থাকলে Environment variables-এর `DATABASE_URL` এবং Supabase SQL Editor-এ migration/seed সফল হয়েছে কি না দেখুন। Admin login কেবল আপনার `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` দিয়ে করুন।

## ৩. ভবিষ্যতে schema বদলালে

```bash
npm ci
npm run db:generate
```

নতুন তৈরি হওয়া SQL migration ফাইলটি review করে Supabase SQL Editor-এ চালান। Production database-এ local test করার জন্য data delete/update চালাবেন না। `npm run db:migrate` শুধু এমন trusted environment-এ চালান যেখানে `DATABASE_URL` সঠিক database-এ point করে। নতুন খালি database-এ initial data দিতে `npm run db:seed` চালান।

## নিরাপত্তা ও কার্যকরী সীমা

- Production seed-এ `BOOTSTRAP_ADMIN_EMAIL` এবং `BOOTSTRAP_ADMIN_PASSWORD` বাধ্যতামূলক। Demo staff/customer account production-এ inactive থাকে; admin panel থেকে আলাদা staff account তৈরি করুন।
- `.env.example`-এ placeholder আছে; সেটি Netlify-তে literal value হিসেবে দেবেন না।
- API calls চলবে; Netlify Functions WebSocket server চালাতে পারে না, তাই order tracking/KDS-এর polling fallback ব্যবহার হবে। Local Express server-এ WebSocket mode-ও আছে।
- Payment method/UI flow দেখা গেলেও production card/bKash/Nagad payment provider credentials এবং verified gateway integration এই deployment-এর অন্তর্ভুক্ত নয়—বাস্তব পেমেন্ট গ্রহণের আগে provider integration যাচাই করুন।
- Firebase Google sign-in (ঐচ্ছিক) ব্যবহার করতে হলে Firebase Console-এ Netlify domain authorized domain হিসেবে যোগ করুন; client config public, কিন্তু private service-account key কখনও frontend-এ রাখবেন না।
