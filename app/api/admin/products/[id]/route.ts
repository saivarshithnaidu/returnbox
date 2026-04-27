import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin.from('products').select('*, category:categories(*)').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    console.error('Fetch product error:', err);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('products').update(body).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
