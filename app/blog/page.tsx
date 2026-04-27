'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Eye, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/supabase/types';

const CATEGORIES = ['All', 'Tips', 'Behind the Scenes', 'New Products', 'Gifting Guides'];

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || p.category === category.toLowerCase().replace(/ /g, '-');
    return matchesSearch && matchesCat;
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#B76E79]/10 px-4 py-2 rounded-full mb-4">
            <BookOpen size={16} className="text-[#B76E79]" />
            <span className="font-sans text-sm font-medium text-[#B76E79]">Our Blog</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#3D1C1C] mb-3">Stories & Inspiration</h1>
          <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">Behind the scenes, gifting guides, and candle care tips</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E5E]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2.5 rounded-xl font-sans text-sm font-medium whitespace-nowrap transition-all ${category === c ? 'bg-[#B76E79] text-white' : 'bg-white text-[#8B5E5E] hover:bg-[#F4B8C1]/10 border border-[#F4B8C1]/20'}`}
              >{c}</button>
            ))}
          </div>
        </div>

        {loading && <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full mx-auto" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-[#F4B8C1] mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#3D1C1C] mb-2">No Posts Yet</h2>
            <p className="font-sans text-sm text-[#8B5E5E]">Check back soon!</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-[#F4B8C1]/20 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F4B8C1]/10">
                  {post.cover_image_url ? (
                    <Image src={post.cover_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><BookOpen size={32} className="text-[#F4B8C1]" /></div>
                  )}
                  {post.category && <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text-xs font-medium text-[#B76E79] capitalize">{post.category.replace(/-/g, ' ')}</span>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg text-[#3D1C1C] mb-2 group-hover:text-[#B76E79] transition-colors line-clamp-2">{post.title}</h3>
                  {post.excerpt && <p className="font-sans text-xs text-[#8B5E5E] line-clamp-2 mb-3">{post.excerpt}</p>}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 font-sans text-[10px] text-[#8B5E5E]">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {fmtDate(post.published_at || post.created_at)}</span>
                      {post.view_count > 0 && <span className="flex items-center gap-1"><Eye size={10} /> {post.view_count}</span>}
                    </div>
                    <ArrowRight size={14} className="text-[#B76E79] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
