import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('categories').select('*').order('display_order');
    if (error) throw error;
    return NextResponse.json({ categories: data });
  } catch (err) {
    console.error('Categories fetch error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('categories').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ category: data });
  } catch (err) {
    console.error('Create category error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...update } = body;
    const { data, error } = await supabaseAdmin.from('categories').update(update).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ category: data });
  } catch (err) {
    console.error('Update category error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete category error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
