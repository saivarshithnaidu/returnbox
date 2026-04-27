'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import CouponInput from '@/components/ui/CouponInput';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, getDeliveryCharge, getDiscount, getTotal, coupon } = useCartStore();
  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const discount = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <ShoppingBag size={64} className="text-[#F4B8C1] mb-6" />
        <h1 className="font-serif text-3xl text-[#3D1C1C] mb-3">Your Cart is Empty</h1>
        <p className="font-sans text-[#8B5E5E] mb-8">Add some lovely items to get started!</p>
        <Link href="/products" className="bg-[#B76E79] text-white px-8 py-3.5 rounded-full font-sans font-semibold hover:bg-[#9a5a65] transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl text-[#3D1C1C] mb-8">Shopping Cart <span className="font-sans text-lg text-[#8B5E5E]">({getItemCount()} items)</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price;
              return (
                <div key={item.product_id} className="flex gap-4 bg-white rounded-2xl p-4 border border-[#F4B8C1]/15">
                  <Link href={`/products/${item.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}><h3 className="font-sans font-medium text-[#3D1C1C] hover:text-[#B76E79] transition-colors">{item.name}</h3></Link>
                    <p className="font-sans font-bold text-[#B76E79] mt-1">{formatPrice(price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-[#FFF8F0] rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="text-[#8B5E5E] hover:text-[#B76E79]"><Minus size={14} /></button>
                        <span className="font-sans text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="text-[#8B5E5E] hover:text-[#B76E79]"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.product_id)} className="text-[#8B5E5E]/40 hover:text-red-400 transition-colors ml-auto"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="font-sans font-bold text-[#3D1C1C] self-center">{formatPrice(price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#F4B8C1]/15 h-fit sticky top-28 space-y-4">
            <h2 className="font-serif text-xl text-[#3D1C1C]">Order Summary</h2>
            {subtotal < 499 && (
              <div className="bg-[#FFF8F0] rounded-lg p-3">
                <p className="font-sans text-xs text-[#8B5E5E]">Add {formatPrice(499 - subtotal)} more for <span className="font-bold text-[#B76E79]">FREE delivery</span></p>
                <div className="h-1.5 bg-[#F4B8C1]/30 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#B76E79] rounded-full transition-all" style={{ width: `${Math.min((subtotal / 499) * 100, 100)}%` }} /></div>
              </div>
            )}
            <CouponInput />
            <div className="space-y-2 text-sm font-sans border-t border-[#F4B8C1]/20 pt-4">
              <div className="flex justify-between text-[#8B5E5E]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-[#8B5E5E]"><span>Delivery</span><span>{delivery === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between text-[#B76E79]"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between font-bold text-[#3D1C1C] text-lg pt-2 border-t border-[#F4B8C1]/20"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Link href="/checkout" className="block w-full bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold text-center hover:bg-[#9a5a65] transition-colors">
              Proceed to Checkout <ArrowRight size={16} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
