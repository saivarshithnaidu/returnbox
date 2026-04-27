import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('products').select('*, category:categories(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data });
  } catch (err) {
    console.error('Admin products fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('products').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    console.error('Admin create product error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
