'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Loader2, Save, Upload, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '@/lib/supabase/types';
import Image from 'next/image';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', short_description: '', category_id: '', price: '', sale_price: '', stock_count: '0', is_featured: false, is_active: true, is_in_stock: true, fragrance: '', materials: '', burn_time_hours: '', weight_grams: '', dimensions: '' });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([pData, cData]) => {
      setCategories(cData.categories || []);
      if (pData.product) {
        const p = pData.product;
        setForm({
          name: p.name || '', slug: p.slug || '', description: p.description || '', short_description: p.short_description || '',
          category_id: p.category_id || '', price: String(p.price || ''), sale_price: p.sale_price ? String(p.sale_price) : '',
          stock_count: String(p.stock_count || 0), is_featured: p.is_featured, is_active: p.is_active, is_in_stock: p.is_in_stock,
          fragrance: p.fragrance || '', materials: p.materials || '', burn_time_hours: p.burn_time_hours ? String(p.burn_time_hours) : '',
          weight_grams: p.weight_grams ? String(p.weight_grams) : '', dimensions: p.dimensions || '',
        });
        setImages(p.images || []);
      }
    }).finally(() => setFetching(false));
  }, [id]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'products');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setImages(prev => [...prev, data.url]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('Name and price required'); return; }
    setLoading(true);
    try {
      const body = {
        ...form, slug: form.slug || slugify(form.name), price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null, stock_count: parseInt(form.stock_count),
        burn_time_hours: form.burn_time_hours ? parseInt(form.burn_time_hours) : null,
        weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
        category_id: form.category_id || null, images,
      };
      const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast.success('Product updated!'); router.push('/admin/products'); } else toast.error('Failed');
    } catch { toast.error('Error'); }
    setLoading(false);
  };

  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]";

  if (fetching) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-[#8B5E5E] hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="font-serif text-2xl text-white">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-[#1A1010] rounded-xl border border-white/5 p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Product Name *</label><input className={inputCls} value={form.name} onChange={e => u('name', e.target.value)} required /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">URL Slug</label><input className={inputCls} value={form.slug} onChange={e => u('slug', e.target.value)} /></div>
        </div>
        <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Short Description</label><input className={inputCls} value={form.short_description} onChange={e => u('short_description', e.target.value)} /></div>
        <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Full Description</label><textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={e => u('description', e.target.value)} /></div>
        <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Category</label>
          <select className={inputCls} value={form.category_id} onChange={e => u('category_id', e.target.value)}><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Price (₹) *</label><input type="number" className={inputCls} value={form.price} onChange={e => u('price', e.target.value)} required /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Sale Price</label><input type="number" className={inputCls} value={form.sale_price} onChange={e => u('sale_price', e.target.value)} /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Stock</label><input type="number" className={inputCls} value={form.stock_count} onChange={e => u('stock_count', e.target.value)} /></div>
        </div>
        <div>
          <label className="font-sans text-xs text-[#8B5E5E] mb-2 block">Product Images</label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-[#B76E79] transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin text-[#B76E79]" /> : <Upload size={16} className="text-[#8B5E5E]" />}
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Fragrance</label><input className={inputCls} value={form.fragrance} onChange={e => u('fragrance', e.target.value)} /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Materials</label><input className={inputCls} value={form.materials} onChange={e => u('materials', e.target.value)} /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Burn Time (hrs)</label><input type="number" className={inputCls} value={form.burn_time_hours} onChange={e => u('burn_time_hours', e.target.value)} /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Weight (g)</label><input type="number" className={inputCls} value={form.weight_grams} onChange={e => u('weight_grams', e.target.value)} /></div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 font-sans text-sm text-[#8B5E5E] cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => u('is_featured', e.target.checked)} className="accent-[#B76E79]" /> Featured</label>
          <label className="flex items-center gap-2 font-sans text-sm text-[#8B5E5E] cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => u('is_active', e.target.checked)} className="accent-[#B76E79]" /> Active</label>
          <label className="flex items-center gap-2 font-sans text-sm text-[#8B5E5E] cursor-pointer"><input type="checkbox" checked={form.is_in_stock} onChange={e => u('is_in_stock', e.target.checked)} className="accent-[#B76E79]" /> In Stock</label>
        </div>
        <button type="submit" disabled={loading} className="bg-[#B76E79] text-white px-6 py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update Product
        </button>
      </form>
    </div>
  );
}
