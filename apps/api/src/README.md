# API integration points

The API intentionally keeps external secrets server-side.

Implement/configure these adapters before live launch:
1. OTP verification provider: issue and verify OTPs; rate-limit requests.
2. Payment gateway: create payment order, verify webhook signatures, update Payment.
3. Maps: geocode address, validate delivery zone, calculate route/ETA.
4. Push: send order-status notifications via FCM/APNs/Expo.
5. Storage: signed uploads for product images.

Do not accept a client-supplied final total as authoritative in production.
The server should load prices/availability/charges from PostgreSQL and calculate the order total inside a transaction.
Use an idempotency key for order creation and gateway webhook processing.
