'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Camera, X } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';

const CATEGORIES = ['tips', 'behind-scenes', 'new-products', 'gifting-guides'];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
    video_url: '', video_type: '' as string, tags: '', category: '',
    seo_title: '', seo_description: '', is_published: false,
  });

  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) u('cover_image_url', data.url);
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.title),
          tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
          is_published: publish,
        }),
      });
      if (res.ok) { toast.success(publish ? 'Published!' : 'Saved as draft'); router.push('/admin/blog'); }
      else toast.error('Failed to save');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#0F0A0A] border border-white/10 font-sans text-sm text-white placeholder:text-[#8B5E5E]/60 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-[#8B5E5E] hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="font-serif text-2xl text-white">New Blog Post</h1>
      </div>

      <div className="space-y-4">
        <input className={inputCls} placeholder="Post Title *" value={form.title} onChange={e => { u('title', e.target.value); if (!form.slug) u('slug', slugify(e.target.value)); }} />
        <input className={inputCls} placeholder="Slug (auto-generated)" value={form.slug} onChange={e => u('slug', e.target.value)} />
        <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Excerpt (shown on blog list)" value={form.excerpt} onChange={e => u('excerpt', e.target.value)} />

        {/* Cover image */}
        <div>
          <label className="font-sans text-xs font-medium text-[#A0A0A0] block mb-1.5">Cover Image</label>
          {form.cover_image_url ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
              <img src={form.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
              <button onClick={() => u('cover_image_url', '')} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 cursor-pointer hover:bg-white/5 transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin text-[#B76E79]" /> : <Camera size={16} className="text-[#B76E79]" />}
              <span className="font-sans text-sm text-[#8B5E5E]">{uploading ? 'Uploading...' : 'Upload cover image'}</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="font-sans text-xs font-medium text-[#A0A0A0] block mb-1.5">Content (HTML supported)</label>
          <textarea className={`${inputCls} resize-y font-mono text-xs`} rows={12} placeholder="Write your post content here... HTML tags supported." value={form.content} onChange={e => u('content', e.target.value)} />
        </div>

        {/* Video */}
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Video URL (YouTube or upload)" value={form.video_url} onChange={e => u('video_url', e.target.value)} />
          <select className={inputCls} value={form.video_type} onChange={e => u('video_type', e.target.value)}>
            <option value="">Video Type</option>
            <option value="youtube">YouTube</option>
            <option value="upload">Upload</option>
          </select>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <select className={inputCls} value={form.category} onChange={e => u('category', e.target.value)}>
            <option value="">Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
          </select>
          <input className={inputCls} placeholder="Tags (comma separated)" value={form.tags} onChange={e => u('tags', e.target.value)} />
        </div>

        {/* SEO */}
        <input className={inputCls} placeholder="SEO Title" value={form.seo_title} onChange={e => u('seo_title', e.target.value)} />
        <input className={inputCls} placeholder="SEO Description (155 chars)" value={form.seo_description} onChange={e => u('seo_description', e.target.value)} maxLength={155} />

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => handleSubmit(false)} disabled={saving} className="flex-1 border-2 border-white/10 text-white py-3 rounded-xl font-sans font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 size={16} className="animate-spin" />} Save Draft
          </button>
          <button onClick={() => handleSubmit(true)} disabled={saving} className="flex-1 bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 size={16} className="animate-spin" />} Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}
