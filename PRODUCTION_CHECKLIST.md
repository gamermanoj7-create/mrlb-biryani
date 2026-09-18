# Production launch checklist

## Backend
- [ ] Run PostgreSQL migrations
- [ ] Replace JWT secret with a managed secret
- [ ] Add rate limiting and request-size limits
- [ ] Configure CORS to exact production domains
- [ ] Add OTP provider and phone/email verification
- [ ] Add gateway webhook signature verification
- [ ] Add payment create/order/capture/refund endpoints
- [ ] Add idempotency keys for order/payment creation
- [ ] Add transactional inventory/availability checks
- [ ] Add delivery-zone geospatial rules
- [ ] Add push/SMS/WhatsApp notification provider
- [ ] Add structured audit logging and monitoring
- [ ] Add backups and disaster recovery

## Customer
- [ ] Replace demo home data with `/products`
- [ ] Add real authentication/OTP screens
- [ ] Persist cart server-side for signed-in users
- [ ] Add address CRUD + map/geocoding
- [ ] Add real checkout calculation from backend
- [ ] Add payment SDKs
- [ ] Add live tracking with driver location permissions
- [ ] Add order history, invoices, refunds, support and account deletion

## Admin
- [ ] Add admin login + RBAC
- [ ] Connect dashboard to `/admin/dashboard`
- [ ] Add CRUD screens for products, orders, charges, zones, coupons, policies
- [ ] Add delivery assignment and driver views
- [ ] Add reports/export
- [ ] Add confirmation dialogs and audit trails

## Legal
- [ ] Replace policy placeholders with jurisdiction-reviewed business policies
- [ ] Store policy version accepted by each customer/order
