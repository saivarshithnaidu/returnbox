'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Coupon } from '@/lib/supabase/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minimum_order: '0', maximum_discount: '', usage_limit: '', description: '' });

  const fetch_ = () => { fetch('/api/admin/coupons').then(r => r.json()).then(d => setCoupons(d.coupons || [])); };
  useEffect(fetch_, []);

  const create = async () => {
    if (!form.code || !form.value) { toast.error('Code and value required'); return; }
    setLoading(true);
    await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, value: parseFloat(form.value), minimum_order: parseFloat(form.minimum_order) || 0, maximum_discount: form.maximum_discount ? parseFloat(form.maximum_discount) : null, usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null }) });
    toast.success('Created!');
    setForm({ code: '', type: 'percentage', value: '', minimum_order: '0', maximum_discount: '', usage_limit: '', description: '' });
    setShowForm(false);
    fetch_();
    setLoading(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch('/api/admin/coupons', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: active }) });
    fetch_();
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/coupons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    toast.success('Deleted');
    fetch_();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-white">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm font-medium flex items-center gap-2"><Plus size={14} /> New Coupon</button>
      </div>
      {showForm && (
        <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Code (e.g. WELCOME10)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
            <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input className={inputCls} type="number" placeholder="Value" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
            <input className={inputCls} type="number" placeholder="Min Order (₹)" value={form.minimum_order} onChange={e => setForm(f => ({ ...f, minimum_order: e.target.value }))} />
            <input className={inputCls} type="number" placeholder="Max Discount (₹)" value={form.maximum_discount} onChange={e => setForm(f => ({ ...f, maximum_discount: e.target.value }))} />
          </div>
          <input className={inputCls} placeholder="Usage limit (blank = unlimited)" value={form.usage_limit} onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))} />
          <button onClick={create} disabled={loading} className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm font-medium flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin" /> : null} Create Coupon
          </button>
        </div>
      )}
      <div className="space-y-2">
        {coupons.map(c => (
          <div key={c.id} className="bg-[#1A1010] rounded-lg border border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-white font-bold bg-[#0F0A0A] px-3 py-1 rounded">{c.code}</span>
              <span className="font-sans text-sm text-[#B76E79]">{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</span>
              <span className="font-sans text-xs text-[#8B5E5E]">Used: {c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ''}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Copied!'); }} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-white"><Copy size={14} /></button>
              <button onClick={() => toggle(c.id, !c.is_active)}>{c.is_active ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} className="text-[#8B5E5E]" />}</button>
              <button onClick={() => del(c.id)} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
