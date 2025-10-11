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
      const customer = paymentData.customer || {};

      try {
        // Get trip and route information
        const tripResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/trips/${metadata.tripId}`);
        let routeId = '';
        let userId = null;
        
        if (tripResponse.ok) {
          const tripData = await tripResponse.json();
          routeId = tripData.routeId;
        }

        // Check if user exists by email and get userId
        try {
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/users/by-email/${customer.email || metadata.email || 'unknown@example.com'}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userId = userData.id;
          }
        } catch (userError) {
          console.log('User not found, booking as guest');
        }

        // Prepare passenger name
        const passengerName = metadata.passengerName || `${customer.first_name || 'Unknown'} ${customer.last_name || 'Customer'}`;
        const passengerEmail = customer.email || metadata.email || paymentData.customer?.email || '';
        const passengerPhone = metadata.phone || '';

        // Create booking in backend
        const bookingPayload = {
          tripId: metadata.tripId,
          routeId: routeId,
          userId: userId, // Will be null if user doesn't exist (guest booking)
          passengerCount: metadata.seats?.length || 1,
          contactInfo: {
            phone: passengerPhone,
            email: passengerEmail,
            name: passengerName
          },
          passengerDetails: [
            {
              name: passengerName,
              email: passengerEmail,
              phone: passengerPhone
            }
          ],
          seatNumbers: metadata.seats || [],
          promotionCode: metadata.promotionCode || null,
          notes: `Payment Reference: ${reference}. Customer: ${passengerName}`,
          paymentReference: reference,
          paymentStatus: 'PAID',
          totalAmount: paymentData.amount / 100 // Convert from kobo to naira
        };

        console.log('Creating booking with payload:', bookingPayload);

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          console.error('Failed to create booking in backend:', errorText);
        } else {
          const bookingData = await backendResponse.json();
          console.log('Booking created successfully:', bookingData);
          
          // Create payment record in backend with customer details
          try {
            const paymentPayload = {
              bookingId: bookingData.id,
              amount: paymentData.amount / 100,
              paystackRef: reference,
              paymentStatus: 'PAID',
              paymentDate: new Date().toISOString(),
              customerName: passengerName,
              customerEmail: passengerEmail,
              customerPhone: passengerPhone
            };

            const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://engracedsmile.com'}/api/v1/payments/record`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentPayload),
            });

            if (paymentResponse.ok) {
              console.log('Payment record created successfully');
            }
          } catch (paymentError) {
            console.error('Error creating payment record:', paymentError);
          }
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
