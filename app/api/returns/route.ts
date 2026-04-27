import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('return_requests').insert({
    order_id: body.order_id,
    order_number: body.order_number,
    issue_type: body.issue_type,
    description: body.description,
    photos: body.photos || [],
    preferred_resolution: body.preferred_resolution,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    status: 'new',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}
