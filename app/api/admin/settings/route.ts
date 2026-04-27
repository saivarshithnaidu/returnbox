import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('site_settings').select('*');
    if (error) throw error;
    const settings: Record<string, string> = {};
    data?.forEach((s: { key: string; value: string }) => { settings[s.key] = s.value; });
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('Settings error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { settings } = await req.json();
    const updates = Object.entries(settings).map(([key, value]) =>
      supabaseAdmin.from('site_settings').upsert({ key, value: value as string, updated_at: new Date().toISOString() })
    );
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
