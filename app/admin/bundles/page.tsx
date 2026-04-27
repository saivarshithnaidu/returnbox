'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Edit } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', bundle_price: '', original_price: '', savings_text: '', selected: [] as { product_id: string; quantity: number }[] });

  const load = () => {
    Promise.all([
      fetch('/api/admin/bundles').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
    ]).then(([b, p]) => { setBundles(b.bundles || []); setProducts((p.products || []).filter((pr: any) => pr.is_active)); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async () => {
    if (!form.name || !form.bundle_price || form.selected.length === 0) { toast.error('Fill name, price, and select products'); return; }
    setCreating(true);
    await fetch('/api/admin/bundles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, description: form.description, bundle_price: parseFloat(form.bundle_price), original_price: parseFloat(form.original_price) || 0, savings_text: form.savings_text, products: form.selected, is_active: true }),
    });
    setForm({ name: '', description: '', bundle_price: '', original_price: '', savings_text: '', selected: [] });
    load();
    setCreating(false);
    toast.success('Bundle created!');
  };

  const toggleProduct = (id: string) => {
    const existing = form.selected.find(s => s.product_id === id);
    if (existing) setForm(f => ({ ...f, selected: f.selected.filter(s => s.product_id !== id) }));
    else setForm(f => ({ ...f, selected: [...f.selected, { product_id: id, quantity: 1 }] }));
  };

  const deleteBundle = async (id: string) => {
    if (!confirm('Delete bundle?')) return;
    await fetch(`/api/admin/bundles?id=${id}`, { method: 'DELETE' });
    load();
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#0F0A0A] border border-white/10 font-sans text-sm text-white placeholder:text-[#8B5E5E]/60 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30";

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Product Bundles</h1>

      {/* Create form */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-4">
        <h2 className="font-sans text-white font-medium">Create New Bundle</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Bundle Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className={inputCls} placeholder="Savings Text (e.g. Save ₹200!)" value={form.savings_text} onChange={e => setForm(f => ({ ...f, savings_text: e.target.value }))} />
        </div>
        <input className={inputCls} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Original Price (₹)" type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} />
          <input className={inputCls} placeholder="Bundle Price (₹) *" type="number" value={form.bundle_price} onChange={e => setForm(f => ({ ...f, bundle_price: e.target.value }))} />
        </div>
        <div>
          <p className="font-sans text-xs text-[#8B5E5E] mb-2">Select Products:</p>
          <div className="flex flex-wrap gap-2">
            {products.map(p => {
              const selected = form.selected.some(s => s.product_id === p.id);
              return <button key={p.id} onClick={() => toggleProduct(p.id)} className={`px-3 py-1.5 rounded-full font-sans text-xs transition-all ${selected ? 'bg-[#B76E79] text-white' : 'bg-white/5 text-[#A0A0A0] hover:bg-white/10'}`}>{p.name}</button>;
            })}
          </div>
        </div>
        <button onClick={handleCreate} disabled={creating} className="bg-[#B76E79] text-white px-6 py-2.5 rounded-xl font-sans text-sm font-medium hover:bg-[#9a5a65] transition-colors flex items-center gap-2 disabled:opacity-50">
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Bundle
        </button>
      </div>

      {/* Existing bundles */}
      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}
      <div className="space-y-3">
        {bundles.map(b => (
          <div key={b.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5 flex items-center justify-between">
            <div>
              <p className="font-sans text-white font-medium">{b.name}</p>
              <p className="font-sans text-xs text-[#8B5E5E]">{(b.products || []).length} products · {formatPrice(b.bundle_price)} (was {formatPrice(b.original_price)})</p>
              {b.savings_text && <span className="font-sans text-xs text-[#B76E79] font-bold">{b.savings_text}</span>}
            </div>
            <button onClick={() => deleteBundle(b.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
