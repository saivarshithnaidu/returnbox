import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });

    const expectedSig = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order payment status
    const { supabaseAdmin } = await import('@/lib/supabase/server');
    await supabaseAdmin.from('orders').update({ payment_status: 'paid', razorpay_payment_id }).eq('razorpay_order_id', razorpay_order_id);

    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
