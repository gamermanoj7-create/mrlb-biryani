# MRLB Biryani — deployment

## 1. Database
Run PostgreSQL (managed recommended), set `DATABASE_URL`, then:
`npm run db:generate`
`npm run db:migrate`

## 2. API
Deploy `apps/api` behind HTTPS. Set all production environment variables.
Restrict CORS to the customer/admin domains.

## 3. Customer Android APK
After installing dependencies and configuring Expo/EAS:
`cd apps/customer`
`eas build --platform android --profile preview`

For Play Store:
`eas build --platform android --profile production`

## 4. iOS
`eas build --platform ios --profile production`
Then submit using:
`eas submit --platform ios --profile production`

Apple Developer and Google Play developer accounts, signing credentials, and store metadata are required.

## 5. Credentials that cannot be safely invented
Real OTP, payment, Maps, push-notification, Apple/Google signing and production database credentials belong to the business accounts. Replace the placeholders in `.env.production.example` with real values in the deployment secret manager.

## 6. Before accepting real orders
- Test payment success/failure/cancel/refund webhooks.
- Test COD lifecycle.
- Test delivery-zone rejection.
- Test duplicate order submission.
- Test driver location permission denial.
- Test network/offline states.
- Review legal policies for the actual operating jurisdiction.
- Enable backups, monitoring, HTTPS and audit logs.
