import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const payment = searchParams.get('payment_status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    let query = supabaseAdmin.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (status) query = query.eq('order_status', status);
    if (payment) query = query.eq('payment_status', payment);
    if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;
    return NextResponse.json({ orders: data, total: count, page, limit });
  } catch (err) {
    console.error('Admin orders fetch error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...update } = await req.json();
    const { data, error } = await supabaseAdmin.from('orders').update(update).eq('id', id).select().single();
    if (error) throw error;

    // Send status update email if order_status changed
    if (update.order_status && data) {
      try {
        const { sendStatusUpdate } = await import('@/lib/resend');
        await sendStatusUpdate({ order_number: data.order_number, customer_name: data.customer_name, customer_email: data.customer_email, order_status: data.order_status });
      } catch { /* email optional */ }
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
