'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const toggleWishlist = useWishlistStore(s => s.toggleItem);
  const isWishlisted = useWishlistStore(s => s.isInWishlist(product.id));
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.sale_price! / product.price) * 100) : 0;
  const primaryImage = product.images?.[0] || '/lotus-candle.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock) return;
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price || undefined,
      quantity: 1,
      image: primaryImage,
      stock_count: product.stock_count,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl border border-[#F4B8C1]/20 hover:border-[#F4B8C1]/60 hover:shadow-[0_8px_30px_rgba(183,110,121,0.12)] transition-all duration-300 flex flex-col h-full overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden">
        <Image src={primaryImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#B76E79] text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">-{discountPercent}%</span>
        )}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-white text-[#3D1C1C] font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 right-12 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-[#B76E79] z-10">{product.category.name}</span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={`transition-all duration-200 ${isWishlisted ? 'fill-[#B76E79] text-[#B76E79] scale-110' : 'fill-transparent text-[#8B5E5E] hover:text-[#B76E79]'}`}
          />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[#3D1C1C] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Eye size={14} /> Quick View
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg text-[#3D1C1C] mb-1 group-hover:text-[#B76E79] transition-colors">{product.name}</h3>
        </Link>
        {product.short_description && (
          <p className="font-sans text-xs text-[#8B5E5E] mb-3 line-clamp-2">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-bold text-[#3D1C1C] text-lg">{formatPrice(displayPrice)}</span>
            {hasDiscount && <span className="font-sans text-sm text-[#8B5E5E] line-through">{formatPrice(product.price)}</span>}
          </div>
          <button onClick={handleAddToCart} disabled={!product.is_in_stock}
            className="p-2.5 bg-[#FFF8F0] text-[#B76E79] rounded-full hover:bg-[#B76E79] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Add to cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
