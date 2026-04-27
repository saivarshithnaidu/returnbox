'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Loader2, DollarSign } from 'lucide-react';
import { formatPrice, timeAgo } from '@/lib/utils';

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/abandoned-carts').then(r => r.json()).then(d => setCarts(d.carts || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const weekCarts = carts.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 86400000));
  const recovered = weekCarts.filter(c => c.recovered);
  const recoveryRate = weekCarts.length > 0 ? Math.round((recovered.length / weekCarts.length) * 100) : 0;
  const revenueRecovered = recovered.reduce((sum: number, c: any) => sum + (c.total || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Abandoned Carts</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A1010] rounded-xl p-5 border border-white/5">
          <div className="bg-orange-400/10 text-orange-400 w-10 h-10 rounded-lg flex items-center justify-center mb-3"><ShoppingCart size={20} /></div>
          <p className="font-sans text-2xl font-bold text-white">{weekCarts.length}</p>
          <p className="font-sans text-xs text-[#8B5E5E]">This Week</p>
        </div>
        <div className="bg-[#1A1010] rounded-xl p-5 border border-white/5">
          <div className="bg-green-400/10 text-green-400 w-10 h-10 rounded-lg flex items-center justify-center mb-3"><TrendingUp size={20} /></div>
          <p className="font-sans text-2xl font-bold text-white">{recoveryRate}%</p>
          <p className="font-sans text-xs text-[#8B5E5E]">Recovery Rate</p>
        </div>
        <div className="bg-[#1A1010] rounded-xl p-5 border border-white/5">
          <div className="bg-blue-400/10 text-blue-400 w-10 h-10 rounded-lg flex items-center justify-center mb-3"><DollarSign size={20} /></div>
          <p className="font-sans text-2xl font-bold text-white">{formatPrice(revenueRecovered)}</p>
          <p className="font-sans text-xs text-[#8B5E5E]">Revenue Recovered</p>
        </div>
      </div>

      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}

      <div className="space-y-3">
        {carts.map(c => (
          <div key={c.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-sans text-white font-medium">{c.customer_name || 'Anonymous'}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{c.customer_phone || c.customer_email} · {timeAgo(c.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-[#B76E79] font-bold">{formatPrice(c.total)}</p>
                <div className="flex gap-1 mt-1">
                  {c.recovery_sent && <span className="px-2 py-0.5 rounded-full font-sans text-[10px] bg-blue-400/10 text-blue-400">Sent</span>}
                  {c.recovered && <span className="px-2 py-0.5 rounded-full font-sans text-[10px] bg-green-400/10 text-green-400">Recovered</span>}
                </div>
              </div>
            </div>
            <div className="font-sans text-xs text-[#A0A0A0]">
              {(c.cart_items || []).map((item: any, i: number) => (
                <span key={i}>{i > 0 && ', '}{item.name} ×{item.quantity}</span>
              ))}
            </div>
          </div>
        ))}
        {!loading && carts.length === 0 && <p className="text-center py-10 font-sans text-[#8B5E5E]">No abandoned carts</p>}
      </div>
    </div>
  );
}
