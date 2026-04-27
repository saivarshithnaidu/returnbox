'use client';
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Smartphone, Monitor } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/analytics').then(r => r.json()).then(setData).catch(() => {}); }, []);

  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full" /></div>;

  const maxRevenue = Math.max(...(data.revenueByDay?.map((d: any) => d.revenue) || [1]));

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-white">Analytics</h1>

      {/* Visit Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Today', value: data.todayVisits }, { label: 'This Week', value: data.weekVisits }, { label: 'This Month', value: data.monthVisits }].map(s => (
          <div key={s.label} className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <p className="font-sans text-2xl font-bold text-white">{s.value}</p>
            <p className="font-sans text-xs text-[#8B5E5E]">{s.label} Visits</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
        <h2 className="font-sans text-white font-medium mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-[#B76E79]" /> Revenue (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40">
          {data.revenueByDay?.map((d: any) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-sans text-[10px] text-[#8B5E5E]">{d.revenue > 0 ? formatPrice(d.revenue) : ''}</span>
              <div className="w-full bg-[#B76E79]/20 rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#B76E79] to-[#F4B8C1]" />
              </div>
              <span className="font-sans text-[10px] text-[#8B5E5E]">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
          <h2 className="font-sans text-white font-medium mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-[#B76E79]" />
              <div className="flex-1"><div className="h-2 bg-[#0F0A0A] rounded-full overflow-hidden"><div className="h-full bg-[#B76E79] rounded-full" style={{ width: `${data.deviceBreakdown?.mobile / ((data.deviceBreakdown?.mobile || 0) + (data.deviceBreakdown?.desktop || 0) || 1) * 100}%` }} /></div></div>
              <span className="font-sans text-sm text-white">{data.deviceBreakdown?.mobile || 0} mobile</span>
            </div>
            <div className="flex items-center gap-3">
              <Monitor size={16} className="text-blue-400" />
              <div className="flex-1"><div className="h-2 bg-[#0F0A0A] rounded-full overflow-hidden"><div className="h-full bg-blue-400 rounded-full" style={{ width: `${data.deviceBreakdown?.desktop / ((data.deviceBreakdown?.mobile || 0) + (data.deviceBreakdown?.desktop || 0) || 1) * 100}%` }} /></div></div>
              <span className="font-sans text-sm text-white">{data.deviceBreakdown?.desktop || 0} desktop</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
          <h2 className="font-sans text-white font-medium mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-400" /> Top Products</h2>
          {data.topProducts?.length > 0 ? (
            <div className="space-y-2">
              {data.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex justify-between font-sans text-sm">
                  <span className="text-white">{i + 1}. {p.name}</span>
                  <span className="text-[#8B5E5E]">{p.order_count} orders</span>
                </div>
              ))}
            </div>
          ) : <p className="font-sans text-sm text-[#8B5E5E]">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
