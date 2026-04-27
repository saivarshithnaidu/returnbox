'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Share2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/supabase/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const wishlistIds = useWishlistStore(s => s.items);
  const removeItem = useWishlistStore(s => s.removeItem);
  const addCartItem = useCartStore(s => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => {
        const all = (data.products || []) as Product[];
        setProducts(all.filter(p => wishlistIds.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  const handleAddToCart = (product: Product) => {
    addCartItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price || undefined,
      quantity: 1,
      image: product.images?.[0] || '/lotus-candle.png',
      stock_count: product.stock_count,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/wishlist?items=${wishlistIds.join(',')}`;
    navigator.clipboard.writeText(url);
    toast.success('Wishlist link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-32 flex justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl text-[#3D1C1C] mb-2">My Wishlist</h1>
            <p className="font-sans text-[#8B5E5E]">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
          </div>
          {products.length > 0 && (
            <button onClick={handleShare} className="flex items-center gap-2 border-2 border-[#B76E79] text-[#B76E79] px-5 py-2.5 rounded-full font-sans text-sm font-medium hover:bg-[#B76E79] hover:text-white transition-all">
              <Share2 size={16} /> Share Wishlist
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="text-[#F4B8C1] mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-[#3D1C1C] mb-3">Your Wishlist is Empty</h2>
            <p className="font-sans text-[#8B5E5E] mb-8 max-w-md mx-auto">Save your favorite products by tapping the heart icon. They&apos;ll be waiting here for you!</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#B76E79] text-white px-8 py-3 rounded-full font-sans font-medium hover:bg-[#9a5a65] transition-colors">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {products.map(product => {
                const hasDiscount = product.sale_price && product.sale_price < product.price;
                const price = hasDiscount ? product.sale_price! : product.price;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-white rounded-2xl border border-[#F4B8C1]/20 p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
                  >
                    <Link href={`/products/${product.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <Image src={product.images?.[0] || '/lotus-candle.png'} alt={product.name} fill className="object-cover" sizes="96px" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.slug}`} className="font-serif text-lg text-[#3D1C1C] hover:text-[#B76E79] transition-colors block truncate">{product.name}</Link>
                      <p className="font-sans text-xs text-[#8B5E5E] line-clamp-1 mt-0.5">{product.short_description}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-sans font-bold text-[#3D1C1C]">{formatPrice(price)}</span>
                        {hasDiscount && <span className="font-sans text-sm text-[#8B5E5E] line-through">{formatPrice(product.price)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.is_in_stock}
                        className="flex items-center gap-1.5 bg-[#B76E79] text-white px-4 py-2.5 rounded-xl font-sans text-sm font-medium hover:bg-[#9a5a65] transition-colors disabled:opacity-40"
                      >
                        <ShoppingCart size={14} /> <span className="hidden sm:inline">Add to Cart</span>
                      </button>
                      <button
                        onClick={() => { removeItem(product.id); toast.success('Removed from wishlist'); }}
                        className="p-2.5 text-[#8B5E5E] hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
