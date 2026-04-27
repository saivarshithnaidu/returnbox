import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Get post
  const { data: post, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  // Increment views
  await supabaseAdmin.from('blog_posts').update({ view_count: (post.view_count || 0) + 1 }).eq('id', post.id);

  // Get related posts
  const { data: related } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, cover_image_url, published_at, created_at')
    .eq('is_published', true)
    .neq('id', post.id)
    .limit(2);

  return NextResponse.json({ post, related: related || [] });
}
