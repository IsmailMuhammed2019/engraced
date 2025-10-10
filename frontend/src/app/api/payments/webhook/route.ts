import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different Paystack events
    switch (event.event) {
      case 'charge.success':
        // Payment was successful
        console.log('Payment successful:', event.data);
        
        const paymentData = event.data;
        const metadata = paymentData.metadata || {};

        try {
          // Get trip and route information
          const tripResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/trips/${metadata.tripId}`);
          let routeId = '';
          
          if (tripResponse.ok) {
            const tripData = await tripResponse.json();
            routeId = tripData.routeId;
          }

          // Create booking in backend if not already created
          const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tripId: metadata.tripId,
              routeId: routeId,
              passengerCount: metadata.seats?.length || 1,
              contactInfo: {
                phone: metadata.phone,
                email: paymentData.customer?.email
              },
              passengerDetails: [
                {
                  name: metadata.passengerName,
                  email: paymentData.customer?.email,
                  phone: metadata.phone
                }
              ],
              seatNumbers: metadata.seats || [],
              promotionCode: metadata.promotionCode || null,
              notes: `Payment Reference: ${paymentData.reference}`
            }),
          });

          if (backendResponse.ok) {
            const bookingData = await backendResponse.json();
            console.log('Booking created successfully:', bookingData);
          } else {
            const errorText = await backendResponse.text();
            console.error('Failed to create booking in backend:', errorText);
          }
        } catch (backendError) {
          console.error('Error creating booking:', backendError);
        }
        
        break;
        
      case 'charge.failed':
        // Payment failed
        console.log('Payment failed:', event.data);
        
        // Here you would typically:
        // 1. Update booking status to failed
        // 2. Release reserved seats
        // 3. Send failure notification
        
        break;
        
      case 'transfer.success':
        // Transfer was successful (if you're using transfers)
        console.log('Transfer successful:', event.data);
        break;
        
      case 'transfer.failed':
        // Transfer failed
        console.log('Transfer failed:', event.data);
        break;
        
      default:
        console.log('Unhandled event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
