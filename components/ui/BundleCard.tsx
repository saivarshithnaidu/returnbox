'use client';

import Image from 'next/image';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import type { Bundle, Product } from '@/lib/supabase/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface BundleCardProps {
  bundle: Bundle;
  allProducts: Product[];
}

export default function BundleCard({ bundle, allProducts }: BundleCardProps) {
  const addItem = useCartStore(s => s.addItem);

  const bundleProducts = bundle.products
    .map(bp => {
      const product = allProducts.find(p => p.id === bp.product_id);
      return product ? { ...product, bundleQty: bp.quantity } : null;
    })
    .filter(Boolean) as (Product & { bundleQty: number })[];

  const savingsPercent = bundle.original_price > 0
    ? Math.round((1 - bundle.bundle_price / bundle.original_price) * 100)
    : 0;

  const handleAddBundle = () => {
    bundleProducts.forEach(p => {
      addItem({
        product_id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        sale_price: p.sale_price || undefined,
        quantity: p.bundleQty,
        image: p.images?.[0] || '/lotus-candle.png',
        stock_count: p.stock_count,
      });
    });
    toast.success(`${bundle.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl border border-[#F4B8C1]/20 hover:border-[#F4B8C1]/60 hover:shadow-[0_8px_30px_rgba(183,110,121,0.12)] transition-all duration-300 overflow-hidden"
    >
      {/* Bundle Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#F4B8C1]/10">
        {bundle.image_url ? (
          <Image src={bundle.image_url} alt={bundle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
            {bundleProducts.slice(0, 3).map((p, i) => (
              <div key={p.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#F4B8C1]/30 bg-white" style={{ transform: `rotate(${(i - 1) * 5}deg)` }}>
                <Image src={p.images?.[0] || '/lotus-candle.png'} alt={p.name} fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}
        {/* Savings badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#B76E79] to-[#D4849D] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10 shadow-lg">
          <Sparkles size={12} />
          {bundle.savings_text || `Save ${savingsPercent}%`}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-serif text-lg text-[#3D1C1C] group-hover:text-[#B76E79] transition-colors">{bundle.name}</h3>
        {bundle.description && (
          <p className="font-sans text-xs text-[#8B5E5E] line-clamp-2">{bundle.description}</p>
        )}

        {/* Products list */}
        <div className="space-y-1">
          {bundleProducts.map(p => (
            <div key={p.id} className="flex items-center gap-2 font-sans text-xs text-[#8B5E5E]">
              <div className="w-1 h-1 bg-[#B76E79] rounded-full" />
              <span>{p.bundleQty}× {p.name}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="font-sans font-bold text-xl text-[#3D1C1C]">{formatPrice(bundle.bundle_price)}</span>
          <span className="font-sans text-sm text-[#8B5E5E] line-through">{formatPrice(bundle.original_price)}</span>
        </div>

        <button
          onClick={handleAddBundle}
          className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add Bundle to Cart
        </button>
      </div>
    </motion.div>
  );
}
