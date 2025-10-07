import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, email, reference, callback_url, metadata, firstName, lastName } = await request.json();
    
    if (!amount || !email || !reference) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract customer name from metadata if not provided directly
    const customerFirstName = firstName || metadata?.passengerName?.split(' ')[0] || 'Customer';
    const customerLastName = lastName || metadata?.passengerName?.split(' ').slice(1).join(' ') || '';

    // Initialize payment with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        reference,
        callback_url,
        first_name: customerFirstName,
        last_name: customerLastName,
        metadata
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({
        success: true,
        data: data.data,
        message: 'Payment initialized successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to initialize payment'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
