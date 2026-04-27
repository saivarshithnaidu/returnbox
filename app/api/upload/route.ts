import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabaseAdmin.storage.from('returnbox').upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw error;
    const { data: { publicUrl } } = supabaseAdmin.storage.from('returnbox').getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl, fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
