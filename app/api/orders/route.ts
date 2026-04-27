import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, customer_email, delivery_address, items, subtotal, delivery_charge, discount_amount, coupon_code, total, payment_method, razorpay_order_id, razorpay_payment_id, payment_screenshot_url, billing_details_url, special_instructions, referred_by_code } = body;

    if (!customer_name || !customer_phone || !customer_email || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order_number = generateOrderNumber();
    const payment_status = payment_method === 'qr_upload' ? 'pending_verification' : payment_method === 'razorpay' && razorpay_payment_id ? 'paid' : 'pending';

    const { data, error } = await supabaseAdmin.from('orders').insert({
      order_number, customer_name, customer_phone, customer_email, delivery_address, items, subtotal, delivery_charge: delivery_charge || 0, discount_amount: discount_amount || 0, coupon_code, total, payment_method, payment_status, order_status: 'new', razorpay_order_id, razorpay_payment_id, payment_screenshot_url, billing_details_url, special_instructions, referred_by_code,
    }).select().single();

    if (error) throw error;

    // Referral Credit Logic
    if (referred_by_code) {
      try {
        const { data: referrer } = await supabaseAdmin.from('customer_profiles').select('phone').eq('referral_code', referred_by_code).single();
        if (referrer) {
          await supabaseAdmin.from('referral_credits').insert({
            referrer_phone: referrer.phone,
            referred_order_id: data.id,
            referral_code: referred_by_code,
            credit_amount: 100,
          });
        }
      } catch { /* ignore referral errors to not block order */ }
    }

    // Increment coupon usage
    if (coupon_code) {
      await supabaseAdmin.rpc('increment_coupon_usage', { coupon_code_input: coupon_code });
    }

    // Send emails (non-blocking)
    try {
      const { sendOrderConfirmation, sendOrderNotificationToAdmin } = await import('@/lib/resend');
      await Promise.all([
        sendOrderConfirmation({ order_number, customer_name, customer_email, items, subtotal, delivery_charge: delivery_charge || 0, discount_amount: discount_amount || 0, total, delivery_address }),
        sendOrderNotificationToAdmin({ order_number, customer_name, customer_phone, customer_email, items, total, payment_method, payment_status, delivery_address, special_instructions }),
      ]);
    } catch { /* email not configured */ }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const order_number = searchParams.get('order_number');
    const phone = searchParams.get('phone');

    if (!order_number && !phone) return NextResponse.json({ error: 'Provide order_number or phone' }, { status: 400 });

    let query = supabaseAdmin.from('orders').select('*');
    if (order_number) query = query.eq('order_number', order_number);
    if (phone) query = query.eq('customer_phone', phone);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
