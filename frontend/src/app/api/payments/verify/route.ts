import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();
    
    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Payment was successful, create booking in backend
      const paymentData = data.data;
      const metadata = paymentData.metadata || {};

      try {
        // Get trip and route information
        const tripResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/trips/${metadata.tripId}`);
        let routeId = '';
        
        if (tripResponse.ok) {
          const tripData = await tripResponse.json();
          routeId = tripData.routeId;
        }

        // Create booking in backend
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
            notes: `Payment Reference: ${reference}`
          }),
        });

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          console.error('Failed to create booking in backend:', errorText);
        } else {
          const bookingData = await backendResponse.json();
          console.log('Booking created successfully:', bookingData);
        }
      } catch (backendError) {
        console.error('Error creating booking:', backendError);
      }

      // Return payment verification result
      return NextResponse.json({
        success: true,
        data: data.data,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment failed
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
