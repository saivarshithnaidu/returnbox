'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { fetch('/api/admin/blog').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const togglePublish = async (id: string, published: boolean) => {
    await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_published: published }) });
    load();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-white">Blog Posts</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2.5 rounded-xl font-sans text-sm font-medium hover:bg-[#9a5a65] transition-colors"><Plus size={16} /> New Post</Link>
      </div>
      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5 flex items-center gap-4">
            {p.cover_image_url && <img src={p.cover_image_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-white font-medium truncate">{p.title}</p>
              <div className="flex items-center gap-3 font-sans text-xs text-[#8B5E5E] mt-1">
                <span className={`px-2 py-0.5 rounded-full ${p.is_published ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{p.is_published ? 'Published' : 'Draft'}</span>
                {p.view_count > 0 && <span className="flex items-center gap-1"><Eye size={10} /> {p.view_count}</span>}
                <span>{timeAgo(p.created_at)}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => togglePublish(p.id, !p.is_published)} className="p-2 bg-white/5 text-[#A0A0A0] rounded-lg hover:bg-white/10 transition-colors" title={p.is_published ? 'Unpublish' : 'Publish'}>
                {p.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <Link href={`/admin/blog/${p.id}/edit`} className="p-2 bg-white/5 text-[#A0A0A0] rounded-lg hover:bg-white/10 transition-colors"><Edit size={14} /></Link>
              <button onClick={() => deletePost(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {!loading && posts.length === 0 && <p className="text-center py-10 font-sans text-[#8B5E5E]">No blog posts yet</p>}
      </div>
    </div>
  );
}
