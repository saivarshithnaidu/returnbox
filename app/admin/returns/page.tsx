'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Loader2, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { customerWaLink } from '@/lib/whatsapp';

const STATUSES = ['new', 'reviewing', 'approved', 'resolved', 'rejected'];
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-400/10 text-yellow-400', reviewing: 'bg-blue-400/10 text-blue-400',
  approved: 'bg-green-400/10 text-green-400', resolved: 'bg-emerald-400/10 text-emerald-400', rejected: 'bg-red-400/10 text-red-400',
};

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { fetch('/api/admin/returns').then(r => r.json()).then(d => setRequests(d.requests || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/returns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    load();
  };

  const addNote = async (id: string) => {
    const note = prompt('Add action note:');
    if (!note) return;
    await fetch('/api/admin/returns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action_notes: note }) });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Return Requests</h1>
      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}
      <div className="space-y-3">
        {requests.map(r => (
          <div key={r.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-sans text-white font-medium">{r.customer_name} — {r.order_number}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{r.issue_type?.replace(/_/g, ' ')} · {r.preferred_resolution} · {timeAgo(r.created_at)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold ${STATUS_COLORS[r.status] || 'bg-white/5 text-[#8B5E5E]'}`}>{r.status}</span>
            </div>
            <p className="font-sans text-sm text-[#A0A0A0] mb-3">{r.description}</p>
            {r.photos?.length > 0 && (
              <div className="flex gap-2 mb-3">
                {r.photos.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                    <img src={url} alt={`Issue ${i+1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )}
            {r.action_notes && <p className="font-sans text-xs text-[#B76E79] mb-3 bg-[#B76E79]/5 px-3 py-2 rounded-lg">Note: {r.action_notes}</p>}
            <div className="flex gap-2 flex-wrap">
              <a href={customerWaLink(r.customer_phone)} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg font-sans text-xs hover:bg-green-500/20"><MessageCircle size={12} /> WhatsApp</a>
              <button onClick={() => addNote(r.id)} className="px-3 py-1.5 bg-white/5 text-[#A0A0A0] rounded-lg font-sans text-xs hover:bg-white/10">Add Note</button>
              <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="px-2 py-1 bg-white/5 text-[#A0A0A0] rounded-lg font-sans text-xs border border-white/10">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {!loading && requests.length === 0 && <p className="text-center py-10 font-sans text-[#8B5E5E]">No return requests</p>}
      </div>
    </div>
  );
}
