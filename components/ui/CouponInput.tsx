'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Tag, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { coupon, applyCoupon, removeCoupon, getSubtotal } = useCartStore();

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-[#FFF8F0] rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-[#B76E79]" />
          <span className="font-sans text-xs font-medium text-[#3D1C1C]">{coupon.code}</span>
          <span className="font-sans text-xs text-[#B76E79]">applied</span>
        </div>
        <button onClick={removeCoupon} className="text-[#8B5E5E] hover:text-red-400"><X size={14} /></button>
      </div>
    );
  }

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal: getSubtotal() }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(data.coupon);
        toast.success(`Coupon applied! You save ${data.coupon.type === 'percentage' ? data.coupon.value + '%' : '₹' + data.coupon.value}`);
        setCode('');
      } else {
        toast.error(data.error || 'Invalid coupon');
      }
    } catch {
      toast.error('Failed to validate coupon');
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Coupon code"
        className="flex-1 px-3 py-2 rounded-lg border border-[#F4B8C1]/30 bg-[#FFF8F0]/50 font-sans text-xs text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-1 focus:ring-[#F4B8C1]"
        onKeyDown={e => e.key === 'Enter' && handleApply()} />
      <button onClick={handleApply} disabled={loading || !code.trim()}
        className="px-3 py-2 bg-[#3D1C1C] text-white rounded-lg font-sans text-xs font-medium hover:bg-[#B76E79] transition-colors disabled:opacity-40 flex items-center gap-1">
        {loading ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
      </button>
    </div>
  );
}
