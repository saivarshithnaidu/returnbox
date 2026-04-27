'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, AlertCircle, Users, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, timeAgo } from '@/lib/utils';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setData).catch(() => {});
    fetch('/api/admin/orders?limit=5').then(r => r.json()).then(d => setRecentOrders(d.orders || [])).catch(() => {});
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
              <Link key={o.id} href={`/admin/orders`} className="flex items-center justify-between bg-[#0F0A0A] rounded-lg p-3 hover:bg-white/5 transition-colors">
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

        {/* Low Stock + Quick Stats */}
        <div className="space-y-6">
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
    </div>
  );
}
