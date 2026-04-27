'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PRESETS = [
  { title: 'Diwali Sale', desc: 'Celebrate with Return Box! Special Diwali discounts on all products.' },
  { title: 'Christmas Special', desc: 'Gift warmth this Christmas. Exclusive holiday offers inside!' },
  { title: 'Valentine\'s Day', desc: 'Love is in the air. Special couples gift boxes available.' },
  { title: 'New Year Offer', desc: 'Start the year with something special. New year discounts!' },
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', discount_type: 'percentage', discount_value: '', applies_to: 'all', valid_from: '', valid_until: '', show_banner: true });

  const fetch_ = () => { fetch('/api/admin/offers').then(r => r.json()).then(d => setOffers(d.offers || [])); };
  useEffect(fetch_, []);

  const create = async () => {
    if (!form.title || !form.valid_from || !form.valid_until) { toast.error('Title and dates required'); return; }
    setLoading(true);
    await fetch('/api/admin/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, discount_value: form.discount_value ? parseFloat(form.discount_value) : null }) });
    toast.success('Created!'); setShowForm(false); fetch_(); setLoading(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch('/api/admin/offers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: active }) }); fetch_();
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/offers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); toast.success('Deleted'); fetch_();
  };

  const applyPreset = (p: typeof PRESETS[0]) => { setForm(f => ({ ...f, title: p.title, description: p.desc })); setShowForm(true); };
  const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-white">Seasonal Offers</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm font-medium flex items-center gap-2"><Plus size={14} /> New Offer</button>
      </div>
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={p.title} onClick={() => applyPreset(p)} className="px-3 py-1.5 rounded-full bg-[#1A1010] border border-white/10 font-sans text-xs text-[#8B5E5E] hover:text-white hover:border-[#B76E79] transition-colors">🎉 {p.title}</button>
        ))}
      </div>
      {showForm && (
        <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
          <input className={inputCls} placeholder="Offer Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-3 gap-3">
            <select className={inputCls} value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select>
            <input className={inputCls} type="number" placeholder="Value" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} />
            <select className={inputCls} value={form.applies_to} onChange={e => setForm(f => ({ ...f, applies_to: e.target.value }))}><option value="all">All Products</option><option value="category">Category</option></select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Valid From</label><input type="datetime-local" className={inputCls} value={form.valid_from} onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))} /></div>
            <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Valid Until</label><input type="datetime-local" className={inputCls} value={form.valid_until} onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))} /></div>
          </div>
          <button onClick={create} disabled={loading} className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 size={14} className="animate-spin" /> : null} Create Offer</button>
        </div>
      )}
      <div className="space-y-2">
        {offers.map(o => (
          <div key={o.id} className="bg-[#1A1010] rounded-lg border border-white/5 px-4 py-3 flex items-center justify-between">
            <div><p className="font-sans text-sm text-white font-medium">{o.title}</p><p className="font-sans text-xs text-[#8B5E5E]">{o.discount_value ? `${o.discount_value}${o.discount_type === 'percentage' ? '%' : '₹'} off` : 'No discount'} · Until {new Date(o.valid_until).toLocaleDateString()}</p></div>
            <div className="flex gap-1">
              <button onClick={() => toggle(o.id, !o.is_active)}>{o.is_active ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} className="text-[#8B5E5E]" />}</button>
              <button onClick={() => del(o.id)} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
