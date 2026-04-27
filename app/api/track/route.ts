import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { page, session_id, device } = await req.json();
    const country = req.headers.get('x-vercel-ip-country') || 'unknown';

    // Dynamic import to avoid build errors if supabase not configured
    const { supabaseAdmin } = await import('@/lib/supabase/server');
    await supabaseAdmin.from('page_visits').insert({ page, session_id, device, country });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
