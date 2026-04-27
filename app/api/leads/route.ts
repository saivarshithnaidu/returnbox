import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email } = await req.json();
    if (!name || !phone || !email) return NextResponse.json({ error: 'All fields required' }, { status: 400 });

    const discount_code = 'WELCOME10';
    const { data: lead, error } = await supabaseAdmin.from('leads').insert({ name, phone, email, discount_code, source: 'website_popup' }).select().single();
    if (error) throw error;

    // Check/Create Customer Profile & Referral Code
    try {
      const { data: existing } = await supabaseAdmin.from('customer_profiles').select('id, referral_code').or(`phone.eq.${phone},email.eq.${email}`).single();
      
      if (!existing) {
        const referral_code = `${name.slice(0, 3).toUpperCase()}${phone.slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
        await supabaseAdmin.from('customer_profiles').insert({
          name, phone, email, referral_code, discount_code
        });
      }
    } catch (err) {
      console.error('Profile creation error (non-blocking):', err);
    }

    // Send welcome email (non-blocking)
    try {
      const { sendWelcomeEmail } = await import('@/lib/resend');
      await sendWelcomeEmail({ name, email, discount_code });
    } catch { /* email service may not be configured */ }

    return NextResponse.json({ success: true, discount_code, lead });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('leads').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;
    return NextResponse.json({ leads: data, total: count, page, limit });
  } catch (err) {
    console.error('Leads fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
