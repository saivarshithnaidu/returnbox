'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import CouponInput from './CouponInput';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, getDeliveryCharge, getDiscount, getTotal, coupon } = useCartStore();
  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const discount = getDiscount();
  const total = getTotal();
  const freeDeliveryProgress = Math.min((subtotal / 499) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[90] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#F4B8C1]/20">
              <h2 className="font-serif text-xl text-[#3D1C1C] flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#B76E79]" /> Your Cart
                <span className="bg-[#B76E79] text-white text-xs px-2 py-0.5 rounded-full font-sans">{getItemCount()}</span>
              </h2>
              <button onClick={onClose} className="text-[#8B5E5E] hover:text-[#3D1C1C] transition-colors"><X size={22} /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag size={48} className="text-[#F4B8C1] mb-4" />
                <h3 className="font-serif text-xl text-[#3D1C1C] mb-2">Your cart is empty</h3>
                <p className="font-sans text-sm text-[#8B5E5E] mb-6">Add some lovely items to get started!</p>
                <Link href="/products" onClick={onClose} className="bg-[#B76E79] text-white px-6 py-3 rounded-full font-sans font-medium hover:bg-[#9a5a65] transition-colors">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                {/* Free delivery progress */}
                {subtotal < 499 && (
                  <div className="px-5 py-3 bg-[#FFF8F0]">
                    <p className="font-sans text-xs text-[#8B5E5E] mb-1.5">Add {formatPrice(499 - subtotal)} more for <span className="font-bold text-[#B76E79]">FREE delivery</span></p>
                    <div className="h-1.5 bg-[#F4B8C1]/30 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B76E79] rounded-full transition-all duration-500" style={{ width: `${freeDeliveryProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map(item => {
                    const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price;
                    return (
                      <div key={item.product_id} className="flex gap-3 bg-[#FFF8F0] rounded-xl p-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans text-sm font-medium text-[#3D1C1C] truncate">{item.name}</h4>
                          <p className="font-sans text-sm font-bold text-[#B76E79]">{formatPrice(price)}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white border border-[#F4B8C1]/30 flex items-center justify-center text-[#8B5E5E] hover:bg-[#F4B8C1] hover:text-white transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="font-sans text-sm font-medium text-[#3D1C1C] w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white border border-[#F4B8C1]/30 flex items-center justify-center text-[#8B5E5E] hover:bg-[#F4B8C1] hover:text-white transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.product_id)} className="text-[#8B5E5E]/40 hover:text-red-400 transition-colors self-start">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-[#F4B8C1]/20 p-5 space-y-3 bg-white">
                  <CouponInput />
                  <div className="space-y-1.5 text-sm font-sans">
                    <div className="flex justify-between text-[#8B5E5E]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between text-[#8B5E5E]"><span>Delivery</span><span>{delivery === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(delivery)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-[#B76E79]"><span>Discount {coupon ? `(${coupon.code})` : ''}</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between font-bold text-[#3D1C1C] text-base pt-2 border-t border-[#F4B8C1]/20"><span>Total</span><span>{formatPrice(total)}</span></div>
                  </div>
                  <Link href="/checkout" onClick={onClose}
                    className="w-full bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 shadow-md">
                    Checkout <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
