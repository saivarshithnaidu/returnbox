import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ leads: data });
  } catch (err) {
    console.error('Admin leads error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...update } = await req.json();
    if (update.status === 'contacted') update.contacted_at = new Date().toISOString();
    const { data, error } = await supabaseAdmin.from('leads').update(update).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ lead: data });
  } catch (err) {
    console.error('Update lead error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
