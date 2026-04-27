'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Category } from '@/lib/supabase/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetch_ = () => { fetch('/api/admin/categories').then(r => r.json()).then(d => setCategories(d.categories || [])); };
  useEffect(fetch_, []);

  const save = async () => {
    setLoading(true);
    const body = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...body }) });
    } else {
      await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    toast.success(editing ? 'Updated' : 'Created');
    setForm({ name: '', slug: '', description: '' });
    setEditing(null);
    fetch_();
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    toast.success('Deleted');
    fetch_();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl text-white">Categories</h1>
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <input placeholder="Category name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) })); }}
          className="w-full px-4 py-2.5 rounded-lg bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]" />
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-lg bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]" />
        <button onClick={save} disabled={loading || !form.name} className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm font-medium hover:bg-[#9a5a65] transition-colors flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} {editing ? 'Update' : 'Add'} Category
        </button>
      </div>
      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="bg-[#1A1010] rounded-lg border border-white/5 px-4 py-3 flex items-center justify-between">
            <div><p className="font-sans text-sm text-white font-medium">{c.name}</p><p className="font-sans text-xs text-[#8B5E5E]">/{c.slug}</p></div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || '' }); }} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-blue-400"><Edit size={14} /></button>
              <button onClick={() => del(c.id)} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
