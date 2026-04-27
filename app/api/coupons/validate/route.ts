import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    const { data: coupon, error } = await supabaseAdmin.from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single();
    if (error || !coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) return NextResponse.json({ error: 'Coupon not yet valid' }, { status: 400 });
    if (coupon.valid_until && new Date(coupon.valid_until) < now) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    if (subtotal && subtotal < coupon.minimum_order) return NextResponse.json({ error: `Minimum order ₹${coupon.minimum_order} required` }, { status: 400 });

    let discount = coupon.type === 'percentage' ? ((subtotal || 0) * coupon.value) / 100 : coupon.value;
    if (coupon.maximum_discount && discount > coupon.maximum_discount) discount = coupon.maximum_discount;

    return NextResponse.json({ valid: true, coupon, discount: Math.round(discount) });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
