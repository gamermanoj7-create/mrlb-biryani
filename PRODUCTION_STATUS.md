# MRLB Biryani production status

Implemented in this revision:
- Server-side product/variant price lookup during order creation
- Idempotency key to reduce duplicate orders
- Payment method persisted separately from payment status
- Address CRUD with ownership checks
- Admin order/dashboard endpoints with RBAC
- Audit events for administrative order-status changes
- Customer agreement acceptance tied to order
- JWT secret is mandatory and must be >= 32 characters
- Restricted CORS configuration
- Physical-device API URL via EXPO_PUBLIC_API_URL
- GitHub Actions API type-check/Prisma generation
- Render deployment template
- EAS Android/iOS build profiles
- Supplied MRLB logo retained

Still requires external business accounts/secrets before accepting real orders:
- PostgreSQL production instance
- OTP provider
- Payment gateway + webhook secret
- Maps/geocoding API
- Push notification provider
- Object storage/CDN
- Apple Developer signing/account
- Google Play Console signing/account
- Production domain/HTTPS
- Legally reviewed policies

Never commit production secrets to GitHub.
