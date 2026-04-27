'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Clock, Share2, Loader2 } from 'lucide-react';
import type { BlogPost } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`).then(r => r.json()).then(d => { setPost(d.post || null); setRelated(d.related || []); }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#FFF8F0] pt-32 flex justify-center"><Loader2 className="animate-spin text-[#B76E79]" size={32} /></div>;
  if (!post) return <div className="min-h-screen bg-[#FFF8F0] pt-32 text-center"><p className="font-serif text-2xl text-[#3D1C1C] mb-4">Post not found</p><Link href="/blog" className="text-[#B76E79] hover:underline">← Back to blog</Link></div>;

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + url)}`);
    else if (platform === 'copy') { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
  };

  const renderVideo = () => {
    if (!post.video_url) return null;
    if (post.video_type === 'youtube') {
      const videoId = post.video_url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?]+)/)?.[1];
      return videoId ? <div className="aspect-video rounded-2xl overflow-hidden mb-8"><iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allowFullScreen /></div> : null;
    }
    return <video src={post.video_url} controls className="w-full rounded-2xl mb-8" />;
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-28 pb-20 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[#8B5E5E] hover:text-[#B76E79] font-sans text-sm mb-8 transition-colors"><ArrowLeft size={16} /> Back to blog</Link>

        {post.cover_image_url && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="800px" priority />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap mb-4">
          {post.category && <span className="bg-[#B76E79]/10 text-[#B76E79] px-3 py-1 rounded-full font-sans text-xs font-medium capitalize">{post.category.replace(/-/g, ' ')}</span>}
          <span className="font-sans text-xs text-[#8B5E5E] flex items-center gap-1"><Calendar size={12} /> {fmtDate(post.published_at || post.created_at)}</span>
          <span className="font-sans text-xs text-[#8B5E5E] flex items-center gap-1"><Clock size={12} /> {readTime} min read</span>
          <span className="font-sans text-xs text-[#8B5E5E] flex items-center gap-1"><Eye size={12} /> {post.view_count} views</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-[#3D1C1C] mb-6">{post.title}</h1>

        {renderVideo()}

        <div className="prose prose-lg max-w-none font-sans text-[#3D1C1C] leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-xl [&_p]:text-[#5a3a3a] [&_a]:text-[#B76E79] [&_blockquote]:border-l-[#B76E79] [&_blockquote]:text-[#8B5E5E] [&_img]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || '' }} />

        {/* Share */}
        <div className="flex items-center gap-3 mt-10 pt-8 border-t border-[#F4B8C1]/20">
          <span className="font-sans text-sm text-[#8B5E5E]">Share:</span>
          <button onClick={() => handleShare('whatsapp')} className="px-4 py-2 bg-green-500 text-white rounded-full font-sans text-xs font-medium hover:bg-green-600 transition-colors">WhatsApp</button>
          <button onClick={() => handleShare('copy')} className="px-4 py-2 bg-[#3D1C1C] text-white rounded-full font-sans text-xs font-medium hover:bg-[#2D1515] transition-colors flex items-center gap-1"><Share2 size={12} /> Copy Link</button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-[#3D1C1C] mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-4 bg-white rounded-xl border border-[#F4B8C1]/20 p-4 hover:shadow-md transition-shadow">
                  {r.cover_image_url && <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0"><Image src={r.cover_image_url} alt={r.title} fill className="object-cover" sizes="80px" /></div>}
                  <div><h3 className="font-serif text-sm text-[#3D1C1C] line-clamp-2">{r.title}</h3><p className="font-sans text-[10px] text-[#8B5E5E] mt-1">{fmtDate(r.published_at || r.created_at)}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
