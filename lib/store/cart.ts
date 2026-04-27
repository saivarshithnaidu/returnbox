'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Coupon } from '@/lib/supabase/types';

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getDeliveryCharge: (minFreeDelivery?: number, deliveryCharge?: number) => number;
  getDiscount: () => number;
  getTotal: (minFreeDelivery?: number, deliveryCharge?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.product_id === item.product_id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product_id === item.product_id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock_count) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter(i => i.product_id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) return { items: state.items.filter(i => i.product_id !== productId) };
          return {
            items: state.items.map(i =>
              i.product_id === productId ? { ...i, quantity: Math.min(quantity, i.stock_count) } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getDeliveryCharge: (minFreeDelivery = 499, deliveryCharge = 60) => {
        const subtotal = get().getSubtotal();
        return subtotal >= minFreeDelivery ? 0 : deliveryCharge;
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (subtotal < coupon.minimum_order) return 0;
        let discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
        if (coupon.maximum_discount && discount > coupon.maximum_discount) discount = coupon.maximum_discount;
        return Math.round(discount);
      },

      getTotal: (minFreeDelivery = 499, deliveryCharge = 60) => {
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryCharge(minFreeDelivery, deliveryCharge);
        const discount = get().getDiscount();
        return Math.max(0, subtotal + delivery - discount);
      },
    }),
    { name: 'returnbox-cart' }
  )
);
