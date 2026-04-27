'use client';
import { useState, useEffect } from 'react';
import { Phone, MessageCircle, CheckCircle, Download } from 'lucide-react';
import { customerWaLink } from '@/lib/whatsapp';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Lead } from '@/lib/supabase/types';

const STATUS_COLORS: Record<string, string> = { new: 'bg-yellow-400/10 text-yellow-400', contacted: 'bg-blue-400/10 text-blue-400', converted: 'bg-green-400/10 text-green-400', dead: 'bg-red-400/10 text-red-400' };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState('');

  const fetch_ = () => { fetch('/api/admin/leads').then(r => r.json()).then(d => setLeads(d.leads || [])); };
  useEffect(fetch_, []);

  const updateLead = async (id: string, update: Partial<Lead>) => {
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...update }) });
    toast.success('Updated');
    fetch_();
  };

  const exportCSV = () => {
    const csv = ['Name,Phone,Email,Status,Date'].concat(leads.map(l => `${l.name},${l.phone},${l.email},${l.status},${new Date(l.created_at).toLocaleDateString()}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leads.csv'; a.click();
  };

  const filtered = filter ? leads.filter(l => l.status === filter) : leads;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-white">Leads ({leads.length})</h1>
        <button onClick={exportCSV} className="bg-[#1A1010] text-white px-4 py-2 rounded-lg font-sans text-sm border border-white/10 hover:bg-white/5 flex items-center gap-2"><Download size={14} /> Export CSV</button>
      </div>
      <div className="flex gap-2">
        {['', 'new', 'contacted', 'converted', 'dead'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg font-sans text-xs transition-colors ${filter === s ? 'bg-[#B76E79] text-white' : 'bg-[#1A1010] text-[#8B5E5E] border border-white/10'}`}>{s || 'All'}</button>
        ))}
      </div>
      <div className="bg-[#1A1010] rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">
            {['Name', 'Phone', 'Email', 'Status', 'Time', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-sans text-xs text-[#8B5E5E] uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-sans text-sm text-white">{l.name}</td>
                <td className="px-4 py-3 font-sans text-sm text-[#8B5E5E]">{l.phone}</td>
                <td className="px-4 py-3 font-sans text-sm text-[#8B5E5E]">{l.email}</td>
                <td className="px-4 py-3">
                  <select value={l.status} onChange={e => updateLead(l.id, { status: e.target.value as any })}
                    className={`font-sans text-xs px-2 py-1 rounded-lg bg-transparent border border-white/10 cursor-pointer ${STATUS_COLORS[l.status] || 'text-white'}`}>
                    {['new', 'contacted', 'converted', 'dead'].map(s => <option key={s} value={s} className="bg-[#1A1010]">{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 font-sans text-xs text-[#8B5E5E]">{timeAgo(l.created_at)}</td>
                <td className="px-4 py-3 flex gap-1">
                  <a href={`tel:${l.phone}`} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-green-400"><Phone size={14} /></a>
                  <a href={customerWaLink(l.phone)} target="_blank" className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-green-400"><MessageCircle size={14} /></a>
                  <button onClick={() => updateLead(l.id, { status: 'contacted' })} className="p-1.5 rounded hover:bg-white/5 text-[#8B5E5E] hover:text-blue-400"><CheckCircle size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
