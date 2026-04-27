import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('bulk_enquiries').insert({
    contact_name: body.contact_name,
    whatsapp_number: body.whatsapp_number,
    email: body.email || null,
    occasion_type: body.occasion_type,
    event_date: body.event_date || null,
    quantity: body.quantity,
    budget_range: body.budget_range || null,
    preferred_products: body.preferred_products || [],
    color_preferences: body.color_preferences || null,
    personalization_notes: body.personalization_notes || null,
    reference_images: body.reference_images || [],
    additional_notes: body.additional_notes || null,
    status: 'new',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ enquiry: data });
}
