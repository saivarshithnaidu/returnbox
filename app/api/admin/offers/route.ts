import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('seasonal_offers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ offers: data });
  } catch (err) {
    console.error('Offers error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('seasonal_offers').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ offer: data });
  } catch (err) {
    console.error('Create offer error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...update } = await req.json();
    const { data, error } = await supabaseAdmin.from('seasonal_offers').update(update).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ offer: data });
  } catch (err) {
    console.error('Update offer error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabaseAdmin.from('seasonal_offers').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete offer error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
