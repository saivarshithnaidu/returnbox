'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, AlertCircle, Users, TrendingUp, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, timeAgo } from '@/lib/utils';
import { getUpcomingFestivals } from '@/lib/festivals';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const upcomingFestivals = getUpcomingFestivals(30);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setData).catch(() => {});
    fetch('/api/admin/orders?limit=5').then(r => r.json()).then(d => setRecentOrders(d.orders || [])).catch(() => {});
    fetch('/api/ai/inventory-forecast', { method: 'POST' }).then(r => r.json()).then(d => setForecasts(d.forecasts || [])).catch(() => {});
  }, []);

  const stats = [
    { label: "Today's Orders", value: data?.todayOrders || 0, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: "Today's Revenue", value: formatPrice(data?.todayRevenue || 0), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Pending Orders', value: data?.pendingOrders || 0, icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', alert: (data?.pendingOrders || 0) > 0 },
    { label: 'Leads This Week', value: data?.weekLeads || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-white">Dashboard</h1>

      {/* Festival Reminders */}
      {upcomingFestivals.length > 0 && (
        <div className="space-y-2">
          {upcomingFestivals.map(f => (
            <div key={f.name} className="bg-gradient-to-r from-[#B76E79]/10 to-[#B76E79]/5 border border-[#B76E79]/20 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-sans text-white font-medium">{f.name} is in {f.daysUntil} days!</p>
                  <p className="font-sans text-xs text-[#F4B8C1]">Create your {f.name} offer now</p>
                </div>
              </div>
              <Link href={`/admin/offers?festival=${encodeURIComponent(f.name)}&discount=${f.suggestedDiscount}`} className="flex items-center gap-1 bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-xs font-medium hover:bg-[#9a5a65] transition-colors">
                <Calendar size={12} /> Create Offer
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[#1A1010] rounded-xl p-5 border border-white/5 relative overflow-hidden">
            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}><s.icon size={20} /></div>
            <p className="font-sans text-2xl font-bold text-white">{s.value}</p>
            <p className="font-sans text-xs text-[#8B5E5E] mt-1">{s.label}</p>
            {s.alert && <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#1A1010] rounded-xl border border-white/5 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans text-white font-medium">Recent Orders</h2>
            <Link href="/admin/orders" className="font-sans text-xs text-[#B76E79] hover:text-white transition-colors">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="font-sans text-sm text-[#8B5E5E] text-center py-8">No orders yet</p>
            ) : recentOrders.map((o: any) => (
              <Link key={o.id} href="/admin/orders" className="flex items-center justify-between bg-[#0F0A0A] rounded-lg p-3 hover:bg-white/5 transition-colors">
                <div>
                  <p className="font-sans text-sm text-white font-medium">{o.order_number}</p>
                  <p className="font-sans text-xs text-[#8B5E5E]">{o.customer_name} · {timeAgo(o.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-[#B76E79] font-bold">{formatPrice(o.total)}</p>
                  <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full ${o.order_status === 'new' ? 'bg-yellow-400/10 text-yellow-400' : o.order_status === 'confirmed' ? 'bg-blue-400/10 text-blue-400' : o.order_status === 'delivered' ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-[#8B5E5E]'}`}>{o.order_status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Low Stock */}
          <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <h2 className="font-sans text-white font-medium mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-orange-400" /> Low Stock Alerts</h2>
            {!data?.lowStock?.length ? <p className="font-sans text-sm text-[#8B5E5E]">All products well stocked</p> : (
              <div className="space-y-2">
                {data.lowStock.map((p: any) => (
                  <div key={p.id} className="flex justify-between font-sans text-sm">
                    <span className="text-white truncate">{p.name}</span>
                    <span className="text-red-400 font-bold">{p.stock_count} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visits */}
          <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <h2 className="font-sans text-white font-medium mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-400" /> Visits</h2>
            <div className="space-y-2 font-sans text-sm">
              <div className="flex justify-between"><span className="text-[#8B5E5E]">Today</span><span className="text-white font-medium">{data?.todayVisits || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#8B5E5E]">This Week</span><span className="text-white font-medium">{data?.weekVisits || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#8B5E5E]">This Month</span><span className="text-white font-medium">{data?.monthVisits || 0}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Production Planner */}
      {forecasts.length > 0 && (
        <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
          <h2 className="font-sans text-white font-medium mb-4 flex items-center gap-2"><Sparkles size={16} className="text-[#B76E79]" /> AI Production Planner 🤖</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {forecasts.map((f: any, i: number) => {
              const colors = f.urgency === 'critical' ? 'border-red-500/30 bg-red-500/5' : f.urgency === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-green-500/30 bg-green-500/5';
              const textColor = f.urgency === 'critical' ? 'text-red-400' : f.urgency === 'warning' ? 'text-yellow-400' : 'text-green-400';
              return (
                <div key={i} className={`rounded-xl border p-4 ${colors}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-sans text-white font-medium text-sm">{f.product_name}</p>
                    <span className={`font-sans text-[10px] font-bold uppercase ${textColor}`}>{f.urgency}</span>
                  </div>
                  <p className="font-sans text-xs text-[#A0A0A0]">Stock: {f.current_stock} · {f.days_until_stockout} days left</p>
                  {f.festival_impact && <p className="font-sans text-xs text-[#B76E79] mt-1">{f.festival_impact}</p>}
                  <p className={`font-sans text-xs font-medium mt-2 ${textColor}`}>{f.reason}</p>
                  {f.units_to_produce > 0 && <p className="font-sans text-xs text-white mt-1">→ Produce {f.units_to_produce} units</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
