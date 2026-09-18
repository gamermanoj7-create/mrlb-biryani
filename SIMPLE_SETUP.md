# Simple MRLB Biryani setup

Customer does NOT need:
- OTP
- customer login
- customer password
- customer account

Customer only enters:
1. Name
2. Phone number
3. Full address
4. Biryani/cart items
5. COD or UPI

Admin panel shows:
- Order number
- Customer name
- Phone
- Address
- Items
- Total
- Payment method
- Order status

Before deployment, set DATABASE_URL and ADMIN_KEY in the API environment.
Set NEXT_PUBLIC_API_URL in the admin app and EXPO_PUBLIC_API_URL in the customer app.
