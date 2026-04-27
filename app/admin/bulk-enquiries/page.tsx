'use client';
import { useState, useEffect } from 'react';
import { Phone, MessageCircle, DollarSign, Loader2 } from 'lucide-react';
import { formatPrice, timeAgo } from '@/lib/utils';
import { customerWaLink } from '@/lib/whatsapp';

const STATUSES = ['new', 'contacted', 'quoted', 'converted', 'closed'];

export default function AdminBulkEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { fetch('/api/admin/bulk-enquiries').then(r => r.json()).then(d => setEnquiries(d.enquiries || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/bulk-enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    load();
  };

  const addQuote = async (id: string) => {
    const amt = prompt('Enter quote amount (₹):');
    if (!amt) return;
    await fetch('/api/admin/bulk-enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, quote_amount: parseFloat(amt) }) });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Bulk Enquiries</h1>
      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}
      <div className="space-y-3">
        {enquiries.map(e => (
          <div key={e.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-sans text-white font-medium">{e.contact_name}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{e.occasion_type} · {e.quantity} pieces · {timeAgo(e.created_at)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold ${e.status === 'new' ? 'bg-yellow-400/10 text-yellow-400' : e.status === 'converted' ? 'bg-green-400/10 text-green-400' : 'bg-blue-400/10 text-blue-400'}`}>{e.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 font-sans text-xs text-[#A0A0A0]">
              <div>Budget: {e.budget_range || 'Not specified'}</div>
              <div>Event: {e.event_date ? new Date(e.event_date).toLocaleDateString() : 'TBD'}</div>
              {e.color_preferences && <div>Colors: {e.color_preferences}</div>}
              {e.quote_amount && <div className="text-[#B76E79] font-bold">Quote: {formatPrice(e.quote_amount)}</div>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href={customerWaLink(e.whatsapp_number)} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg font-sans text-xs hover:bg-green-500/20"><MessageCircle size={12} /> WhatsApp</a>
              <a href={`tel:${e.whatsapp_number}`} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg font-sans text-xs hover:bg-blue-500/20"><Phone size={12} /> Call</a>
              <button onClick={() => addQuote(e.id)} className="flex items-center gap-1 px-3 py-1.5 bg-[#B76E79]/10 text-[#B76E79] rounded-lg font-sans text-xs hover:bg-[#B76E79]/20"><DollarSign size={12} /> Add Quote</button>
              <select value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)} className="px-2 py-1 bg-white/5 text-[#A0A0A0] rounded-lg font-sans text-xs border border-white/10">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {!loading && enquiries.length === 0 && <p className="text-center py-10 font-sans text-[#8B5E5E]">No bulk enquiries yet</p>}
      </div>
    </div>
  );
}
