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
        
        // Here you would typically:
        // 1. Update booking status in database
        // 2. Send confirmation email
        // 3. Update seat availability
        // 4. Generate ticket/booking reference
        
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
