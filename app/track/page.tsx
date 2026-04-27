'use client';
import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, Package, AlertCircle } from 'lucide-react';
import OrderTimeline from '@/components/ui/OrderTimeline';
import ReturnRequestForm from '@/components/ui/ReturnRequestForm';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/lib/supabase/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('order') || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeReturnOrder, setActiveReturnOrder] = useState<Order | null>(null);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const isPhone = /^\d+$/.test(q.trim());
      const param = isPhone ? `phone=${q.trim()}` : `order_number=${q.trim()}`;
      const res = await fetch(`/api/orders?${param}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { setOrders([]); }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setQuery(orderParam);
      handleSearch(orderParam);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-[#3D1C1C] mb-3">Track Your Order</h1>
          <p className="font-sans text-[#8B5E5E]">Enter your order number or phone number</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="flex gap-3 mb-10">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Order number or phone number"
            className="flex-1 px-5 py-3.5 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]" />
          <button type="submit" disabled={loading} className="bg-[#B76E79] text-white px-6 py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Track
          </button>
        </form>

        {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={32} /></div>}

        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-10">
            <Package size={48} className="text-[#F4B8C1] mx-auto mb-4" />
            <p className="font-serif text-xl text-[#3D1C1C]">No orders found</p>
            <p className="font-sans text-sm text-[#8B5E5E]">Check your order number and try again</p>
          </div>
        )}

        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-6 border border-[#F4B8C1]/15 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-sans text-xs text-[#8B5E5E]">Order Number</p>
                <p className="font-serif text-xl text-[#3D1C1C] font-bold">{order.order_number}</p>
                <p className="font-sans text-xs text-[#8B5E5E] mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <span className="font-sans font-bold text-[#B76E79] text-lg">{formatPrice(order.total)}</span>
            </div>
            <OrderTimeline status={order.order_status} updatedAt={order.updated_at} />
            <div className="mt-6 pt-4 border-t border-[#F4B8C1]/20">
              <p className="font-sans text-xs text-[#8B5E5E] mb-2">Items</p>
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between font-sans text-sm text-[#3D1C1C] py-1">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveReturnOrder(order)}
                className="flex items-center gap-2 text-[#8B5E5E] hover:text-[#B76E79] font-sans text-xs font-medium transition-colors"
              >
                <AlertCircle size={14} /> Report an Issue / Return
              </button>
            </div>
          </div>
        ))}

        {activeReturnOrder && (
          <ReturnRequestForm
            orderId={activeReturnOrder.id}
            orderNumber={activeReturnOrder.order_number}
            customerName={activeReturnOrder.customer_name}
            customerPhone={activeReturnOrder.customer_phone}
            onClose={() => setActiveReturnOrder(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8F0] pt-32 flex justify-center"><Loader2 className="animate-spin text-[#B76E79]" size={32} /></div>}>
      <TrackContent />
    </Suspense>
  );
}
