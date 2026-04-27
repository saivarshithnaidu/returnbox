'use client';
import { useState, useEffect } from 'react';
import { formatPrice, timeAgo } from '@/lib/utils';
import { customerWaLink } from '@/lib/whatsapp';
import { Phone, MessageCircle, Search, ChevronDown, Bell, BellOff, Volume2, VolumeX, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order } from '@/lib/supabase/types';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = { new: 'bg-yellow-400/10 text-yellow-400', confirmed: 'bg-blue-400/10 text-blue-400', processing: 'bg-purple-400/10 text-purple-400', shipped: 'bg-cyan-400/10 text-cyan-400', delivered: 'bg-green-400/10 text-green-400', cancelled: 'bg-red-400/10 text-red-400' };
const PAYMENT_COLORS: Record<string, string> = { pending: 'bg-yellow-400/10 text-yellow-400', pending_verification: 'bg-orange-400/10 text-orange-400', paid: 'bg-green-400/10 text-green-400', failed: 'bg-red-400/10 text-red-400' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [notifications, setNotifications] = useState(false);

  const fetchOrders = (silent = false) => {
    if (!silent) setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    params.set('limit', '50');
    fetch(`/api/admin/orders?${params}`).then(r => r.json()).then(d => {
      const newOrders = d.orders || [];
      if (silent && newOrders.length > lastOrderCount && notifications) {
        new Audio('/notification.mp3').play().catch(() => {});
        toast.success('New order received!', { icon: '🛒' });
      }
      setOrders(newOrders);
      setLastOrderCount(newOrders.length);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);
  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [lastOrderCount, notifications, search, statusFilter]);

  const updateOrder = async (id: string, update: Partial<Order>) => {
    const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...update }) });
    if (res.ok) { toast.success('Updated!'); fetchOrders(); } else toast.error('Failed');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Orders</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E5E]" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchOrders()} placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#1A1010] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]" />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg bg-[#1A1010] border border-white/10 text-white font-sans text-sm focus:outline-none min-w-[120px]">
            <option value="">All Status</option>
            {['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={() => setNotifications(!notifications)} className={`p-2.5 rounded-lg border transition-colors ${notifications ? 'bg-[#B76E79]/10 border-[#B76E79]/30 text-[#B76E79]' : 'bg-[#1A1010] border-white/10 text-[#8B5E5E]'}`} title="Toggle Notifications">
            {notifications ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-sans text-sm text-white font-bold">{o.order_number}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{timeAgo(o.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-[#B76E79] font-bold">{formatPrice(o.total)}</p>
                <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full ${PAYMENT_COLORS[o.payment_status] || ''}`}>{o.payment_status}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-sans text-xs text-[#B76E79] font-bold">{o.customer_name[0]}</div>
              <div>
                <p className="font-sans text-sm text-white">{o.customer_name}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{o.customer_phone}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <select value={o.order_status} onChange={e => updateOrder(o.id, { order_status: e.target.value as any })}
                className={`font-sans text-xs px-2 py-1.5 rounded-lg bg-[#0F0A0A] border border-white/10 focus:outline-none ${STATUS_COLORS[o.order_status] || 'text-white'}`}>
                {['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="bg-[#1A1010]">{s}</option>)}
              </select>
              <div className="flex gap-2">
                <a href={`tel:${o.customer_phone}`} className="p-2 rounded-lg bg-white/5 text-[#8B5E5E]"><Phone size={16} /></a>
                <a href={customerWaLink(o.customer_phone)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-[#8B5E5E]"><MessageCircle size={16} /></a>
                <Link href={`/admin/orders/${o.id}`} className="p-2 rounded-lg bg-[#B76E79]/10 text-[#B76E79]"><Eye size={16} /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[#1A1010] rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">
            {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Time', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-sans text-xs text-[#8B5E5E] font-medium uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-sans text-sm text-white font-medium">{o.order_number}</td>
                <td className="px-4 py-3"><p className="font-sans text-sm text-white">{o.customer_name}</p><p className="font-sans text-xs text-[#8B5E5E]">{o.customer_phone}</p></td>
                <td className="px-4 py-3 font-sans text-sm text-[#8B5E5E]">{o.items.length}</td>
                <td className="px-4 py-3 font-sans text-sm text-[#B76E79] font-bold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><span className={`font-sans text-[10px] px-2 py-0.5 rounded-full ${PAYMENT_COLORS[o.payment_status] || ''}`}>{o.payment_status}</span></td>
                <td className="px-4 py-3">
                  <select value={o.order_status} onChange={e => updateOrder(o.id, { order_status: e.target.value as any })}
                    className={`font-sans text-xs px-2 py-1 rounded-lg bg-transparent border border-white/10 cursor-pointer focus:outline-none ${STATUS_COLORS[o.order_status] || 'text-white'}`}>
                    {['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="bg-[#1A1010]">{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 font-sans text-xs text-[#8B5E5E]">{timeAgo(o.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <a href={`tel:${o.customer_phone}`} className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B5E5E] hover:text-green-400 transition-colors"><Phone size={14} /></a>
                    <a href={customerWaLink(o.customer_phone)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B5E5E] hover:text-green-400 transition-colors"><MessageCircle size={14} /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && <p className="text-center py-10 font-sans text-sm text-[#8B5E5E]">No orders found</p>}
      </div>
    </div>
  );
}
