import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('blog_posts').insert({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt || null,
    content: body.content || null,
    cover_image_url: body.cover_image_url || null,
    video_url: body.video_url || null,
    video_type: body.video_type || null,
    tags: body.tags || [],
    category: body.category || null,
    is_published: body.is_published || false,
    published_at: body.is_published ? new Date().toISOString() : null,
    seo_title: body.seo_title || null,
    seo_description: body.seo_description || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  if (updates.is_published && !updates.published_at) updates.published_at = new Date().toISOString();
  const { error } = await supabaseAdmin.from('blog_posts').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
