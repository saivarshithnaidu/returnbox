import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();
    if (!amount) return NextResponse.json({ error: 'Amount required' }, { status: 400 });

    const { razorpay } = await import('@/lib/razorpay');
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `rb_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
