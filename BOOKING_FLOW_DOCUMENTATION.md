# Booking Flow Documentation

## Overview
This document explains the complete booking flow in the Engracedsmile Travel and Logistics system, from customer payment to data display in both customer and admin portals.

## System Architecture

```
Customer → Payment Verification → Backend API → Database
                ↓                      ↓
         Booking Creation         Payment Record
                ↓                      ↓
         Customer Portal         Admin Portal
```

## Complete Booking Flow

### 1. **Customer Initiates Payment**
- Customer selects a trip and chooses seats
- Frontend sends payment initialization request to Paystack
- Customer completes payment on Paystack's secure platform
- Paystack redirects back with payment reference

### 2. **Payment Verification** (`/frontend/src/app/api/payments/verify/route.ts`)

When the customer returns from Paystack, the frontend calls this API route:

#### Step-by-Step Process:

**a) Verify Payment with Paystack**
```typescript
POST https://api.paystack.co/transaction/verify/{reference}
```
- Verifies the payment was successful
- Retrieves payment metadata (trip ID, customer info, seats, etc.)

**b) Get Trip Information**
```typescript
GET /api/v1/trips/{tripId}
```
- Fetches trip details including route ID

**c) Check for Existing User**
```typescript
GET /api/v1/users/by-email/{email}
```
- Checks if customer has an account
- Returns userId if found, null if not (guest booking)

**d) Create Booking**
```typescript
POST /api/v1/bookings
```
Payload:
```json
{
  "tripId": "trip-id",
  "routeId": "route-id",
  "userId": "user-id or null for guests",
  "passengerCount": 1,
  "contactInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+2348071116229"
  },
  "passengerDetails": [{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+2348071116229"
  }],
  "seatNumbers": ["A1", "B2"],
  "paymentReference": "PAY_xxx",
  "paymentStatus": "PAID",
  "totalAmount": 15000
}
```

**e) Record Payment**
```typescript
POST /api/v1/payments/record
```
Payload:
```json
{
  "bookingId": "booking-id",
  "amount": 15000,
  "paystackRef": "PAY_xxx",
  "paymentStatus": "PAID",
  "paymentDate": "2025-10-11T10:30:00Z",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+2348071116229"
}
```

### 3. **Data Storage**

#### Booking Table
```typescript
{
  id: string,
  bookingNumber: string,        // Auto-generated: BK-123456
  userId: string | null,         // Null for guest bookings
  tripId: string,
  routeId: string,
  passengerCount: number,
  totalAmount: Decimal,
  discountAmount: Decimal,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  contactInfo: {                 // JSON: Customer contact
    name: string,
    email: string,
    phone: string
  },
  passengerDetails: [{           // JSON: Array of passengers
    name: string,
    email: string,
    phone: string
  }],
  seatNumbers: string[],         // Array: ["A1", "B2"]
  notes: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Payment Table
```typescript
{
  id: string,
  bookingId: string,             // Links to booking
  amount: Decimal,
  currency: "NGN",
  paystackRef: string,           // Paystack reference
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  paymentMethod: string,         // "card", "bank_transfer", etc.
  paymentDate: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 4. **Customer Portal Display**

#### My Bookings (`/dashboard/bookings/page.tsx`)
```typescript
GET /api/v1/bookings/my-bookings
Authorization: Bearer {userToken}
```

Displays:
- Booking number
- Route (from → to)
- Departure date and time
- Seat numbers
- Total amount
- Booking status
- Payment status
- Created date
- Actions: View details, Download ticket

#### Payment History (`/dashboard/payments/page.tsx`)
```typescript
GET /api/v1/payments/my-payments
Authorization: Bearer {userToken}
```

Displays:
- Payment amount
- Payment status
- Payment date
- Paystack reference
- Route information
- Booking number
- Receipt download option

#### Trip History (`/dashboard/history/page.tsx`)
- Shows all bookings (past and upcoming)
- Sorted by date (most recent first)
- Includes trip status and details

### 5. **Admin Portal Display**

#### Bookings Management (`/admin/bookings/page.tsx`)
```typescript
GET /api/v1/bookings
Authorization: Bearer {adminToken}
```

The admin portal transforms backend data to display:
- **Booking Number**: Unique identifier
- **Customer Information**:
  - Name (from contactInfo or user data)
  - Email (from contactInfo or user data)
  - Phone (from contactInfo or user data)
- **Route**: From → To
- **Date & Time**: Departure information
- **Booking Status**: Pending, Confirmed, Cancelled, Completed
- **Payment Status**: Paid, Pending, Failed
- **Amount**: Total amount in Naira
- **Passengers**: Count and seat numbers
- **Actions**:
  - View details
  - Confirm booking
  - Update status
  - Cancel booking
  - Copy booking ID

#### Payments Management (`/admin/payments/page.tsx`)
```typescript
GET /api/v1/payments
Authorization: Bearer {adminToken}
```

Displays:
- All payment transactions
- Customer names and emails
- Payment amounts and statuses
- Payment references
- Route information
- Statistics and charts
- Export options

## Key Features

### 1. **Guest Booking Support**
- Customers can book without creating an account
- Contact information is stored in `contactInfo` field
- `userId` is null for guest bookings
- Guest bookings still appear in admin portal with full customer details

### 2. **Registered User Bookings**
- For logged-in users, `userId` is populated
- Bookings appear in "My Bookings" section
- Payment history is tracked
- Notifications are sent

### 3. **Customer Information Handling**
The system stores customer information in multiple places for redundancy:
- `contactInfo` (JSON): Always contains name, email, phone
- `passengerDetails` (JSON array): Detailed passenger information
- `user` relation: If userId exists, links to user account
- Admin portal checks all three sources to display customer info

### 4. **Payment Tracking**
- Each booking has a linked payment record
- Payment status is tracked separately on booking
- Paystack reference is stored for reconciliation
- Admin can view all payments with customer details

## API Endpoints Added/Modified

### New Endpoints:
1. **GET `/api/v1/users/by-email/:email`**
   - Purpose: Find user by email for payment verification
   - Access: Public (no authentication required)
   - Returns: User object or null

2. **POST `/api/v1/payments/record`**
   - Purpose: Record payment after verification
   - Access: Public (called from payment verification)
   - Creates payment record linked to booking

### Modified Endpoints:
1. **POST `/api/v1/bookings`**
   - Now accepts optional fields:
     - `paymentReference`: Paystack reference
     - `paymentStatus`: Payment status
     - `totalAmount`: Override calculated amount
   - Supports guest bookings (userId optional)

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Customer Action                       │
│              (Selects trip, pays via Paystack)          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Payment Verification Route                  │
│    /frontend/src/app/api/payments/verify/route.ts      │
│                                                          │
│  1. Verify with Paystack                                │
│  2. Get trip details                                     │
│  3. Check for user (by email)                           │
│  4. Create booking                                       │
│  5. Record payment                                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Database Storage                       │
│                                                          │
│  ┌───────────────┐    ┌──────────────┐                 │
│  │   Bookings    │◄───┤   Payments   │                 │
│  │   Table       │    │    Table     │                 │
│  └───────┬───────┘    └──────────────┘                 │
│          │                                              │
│          ├─── userId (if registered)                    │
│          ├─── contactInfo (JSON)                        │
│          ├─── passengerDetails (JSON)                   │
│          └─── seatNumbers (Array)                       │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  Customer Portal │          │   Admin Portal   │
│                  │          │                  │
│  - My Bookings   │          │  - All Bookings  │
│  - Payments      │          │  - Payments      │
│  - History       │          │  - Analytics     │
└──────────────────┘          └──────────────────┘
```

## Error Handling

### Payment Verification
- If Paystack verification fails → Return error, don't create booking
- If trip not found → Log error, continue with booking (use provided data)
- If user lookup fails → Proceed as guest booking
- If booking creation fails → Log error, return to customer
- If payment record creation fails → Log error, booking still exists

### Data Display
- Missing customer data → Show "Guest" or "N/A"
- Missing trip data → Show "Unknown"
- Null values → Gracefully handle with fallbacks

## Testing Checklist

- [x] Backend endpoints added and tested
- [x] Payment verification flow works
- [x] Guest bookings are created successfully
- [x] Registered user bookings work
- [x] Customer info displays in admin portal
- [x] Bookings appear in customer portal (for registered users)
- [x] Payments are recorded correctly
- [x] Payment history displays correctly

## Troubleshooting

### Bookings Not Showing in Admin Portal
1. Check if backend API is returning data: `/api/v1/bookings`
2. Verify admin token is valid
3. Check browser console for transformation errors

### Customer Info Not Displaying
1. Verify `contactInfo` field is populated during booking creation
2. Check admin portal data transformation logic
3. Ensure backend includes all relations in query

### Guest Bookings Not Working
1. Ensure `userId` is optional in booking DTO
2. Verify payment verification doesn't require userId
3. Check that contactInfo is always provided

## Security Considerations

1. **Payment Verification**: Always verify with Paystack, never trust client data
2. **User Lookup**: Made public for payment verification but returns minimal data
3. **Payment Recording**: Validates booking exists before creating payment
4. **Guest Bookings**: Store contact info securely, comply with data protection

## Future Enhancements

1. **Email Notifications**: Send booking confirmations to guest customers
2. **Receipt Generation**: Auto-generate PDF receipts
3. **SMS Notifications**: Send trip reminders
4. **Guest Account Creation**: Offer to create account after booking
5. **Payment Reconciliation**: Auto-match Paystack webhooks with bookings

