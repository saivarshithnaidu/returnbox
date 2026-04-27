import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ coupons: data });
  } catch (err) {
    console.error('Coupons error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    body.code = body.code.toUpperCase();
    const { data, error } = await supabaseAdmin.from('coupons').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ coupon: data });
  } catch (err) {
    console.error('Create coupon error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...update } = await req.json();
    const { data, error } = await supabaseAdmin.from('coupons').update(update).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ coupon: data });
  } catch (err) {
    console.error('Update coupon error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete coupon error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
