# MRLB Biryani — Full-stack ordering platform

A production-oriented monorepo for a biryani-only ordering and home-delivery platform:
- Customer mobile app: Expo + React Native (Android/iOS)
- Admin dashboard: Next.js
- API: Fastify + Prisma + PostgreSQL
- Logo: supplied MRLB master logo, used without redesign
- Architecture includes authentication, products, cart/order flow, payments, delivery, policies, coupons, notifications and audit logging.

## Quick start

Prerequisites: Node 20+, PostgreSQL, Expo CLI.

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run db:generate
npm run db:migrate
npm run dev
```

Customer app:
```bash
cd apps/customer
npm install
npx expo start
```

Admin:
```bash
cd apps/admin
npm install
npm run dev
```

The API defaults to `http://localhost:4000`.

## Production integrations to configure
- OTP provider (e.g. Firebase Auth/Twilio/MSG91)
- Payment gateway (Razorpay/Cashfree/PayU/etc.)
- Maps/geocoding and delivery tracking provider
- Push notifications (FCM/APNs via Expo Notifications)
- Object storage/CDN for product images
- HTTPS, managed PostgreSQL, secrets manager, backups, monitoring

Never store raw card data. Store gateway references/status only.
Legal policy text must be reviewed by the business owner/legal adviser before production use.
