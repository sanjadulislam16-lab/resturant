# Saffron & Ember — Restaurant OS & Online Ordering Platform

A complete, production-ready Restaurant Management & Online Food Ordering System built with **React 19**, **TypeScript**, **Tailwind CSS**, **Express + WebSockets**, **PostgreSQL (Cloud SQL + Drizzle ORM)**, and **Firebase Authentication**.

## Core Modules

1. **Floor & Table Management (`/floor`)**
   - Visual zone-based floor map (`Main Dining`, `Patio`, `Chef Counter`, `Private Lounge`)
   - 8 live table statuses (`Available`, `Occupied`, `Ordering`, `Preparing`, `Food Served`, `Bill Requested`, `Payment Pending`, `Completed`)
   - Add/edit/delete tables, seat guests, transfer active orders between tables, and generate downloadable/printable PNG QR codes (`/?table=T01`)

2. **QR Table Ordering & Digital Menu (`/menu`)**
   - 10 full menu categories (`Breakfast`, `Lunch`, `Dinner`, `Fast Food`, `Pizza`, `Burgers`, `Rice & Biryani`, `Drinks`, `Desserts`, `Special Offers`)
   - Full dish customization modal (Half/Full, Size, Spice Level, Extra Cheese/Toppings/Add-ons, Special Instructions, Ingredients, Allergens, Reviews)
   - Table lock protection when scanned via `?table=T01` plus live **Call Waiter** requests (`Water`, `Napkins`, `Bill`, `Assistance`)

3. **Online Ordering, Checkout & Server-Verified Billing (`/cart`, `/checkout`, `/confirmation`)**
   - Supports Dine-In, Takeaway, and Delivery with zone-based delivery fees and free-delivery thresholds
   - Promo codes (`EMBER15`, `WELCOME10`, `FEAST20`), loyalty voucher redemption, tips, and multi-guest bill splitting
   - Payment methods (`Card`, `Cash`, `bKash`, `Nagad`, `Rocket`, `Bank Transfer`) verified server-side with automatic PDF invoice generation

4. **Real-Time 9-Stage Order Tracking (`/track`)**
   - WebSocket-powered live timeline (`Order Placed` -> `Order Confirmed` -> `Accepted by Kitchen` -> `Preparation Started` -> `Food Being Prepared` -> `Food Ready` -> `Ready for Pickup / Out for Delivery` -> `Delivered / Served` -> `Completed`)
   - Secure access via unique tracking token or Order ID + phone verification
   - Post-order star ratings, reviews, and downloadable PDF invoices

5. **Kitchen Display System (`/kitchen`)**
   - 5-stage ticket board (`New Orders`, `Accepted`, `Preparing`, `Ready at Pass`, `Handed Off / Done`)
   - Live Green / Yellow / Red preparation timers and instant Accept, Reject with reason, Start Cooking, Ready, and Complete actions

6. **Staff / Waiter & Delivery Dispatch (`/staff`)**
   - Real-time incoming Waiter Call alerts, Dine-in table service & bill settlement, and Delivery courier assignment

7. **Admin Dashboard, Analytics & Settings (`/admin`, `/analytics`, `/settings`)**
   - Revenue KPIs, Order Management, Menu CRUD, Customer CRM, Staff & Role Management, Promotions, Audit Logs
   - Interactive revenue charts, payment mix breakdown, staff performance, and CSV / PDF report exports

## Environment Variables

See `.env.example` for Supabase `DATABASE_URL`, `SESSION_SECRET`, and the first production administrator credentials. For the full Supabase + Netlify deployment walkthrough, see [`README-DEPLOY-BN.md`](README-DEPLOY-BN.md).

## Local Development & Verification

```bash
# Run unit tests
npm test

# Typecheck & build
npm run lint
npm run build

# Start full-stack Express + WebSocket + Vite server on port 3000
npm run dev

# Generate a migration after changing the Drizzle schema
npm run db:generate

# Seed a fresh, migrated database once
npm run db:seed
```

## Demo Staff Credentials

These shared demo accounts are for local development only. In production the demo staff/customer accounts are seeded as inactive, and the administrator is created from `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`.

- **Super Admin**: `admin@saffronember.com` / `SaffronDemo2026!`
- **Kitchen Chef**: `kitchen@saffronember.com` / `SaffronDemo2026!`
- **Floor Waiter**: `staff@saffronember.com` / `SaffronDemo2026!`
- **Delivery Courier**: `courier@saffronember.com` / `SaffronDemo2026!`
- **Guest Account**: `guest@saffronember.com` / `SaffronDemo2026!`
