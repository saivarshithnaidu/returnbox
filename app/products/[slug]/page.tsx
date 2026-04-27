'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/ui/ImageGallery';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(data => {
      const all = (data.products || []) as Product[];
      const found = all.find(p => p.slug === slug);
      setProduct(found || null);
      if (found) {
        setRelated(all.filter(p => p.id !== found.id && p.is_active && (p.category_id === found.category_id || p.is_featured)).slice(0, 4));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-32"><Loader2 className="animate-spin text-[#B76E79]" size={32} /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center pt-32"><p className="font-serif text-2xl text-[#3D1C1C] mb-4">Product not found</p><Link href="/products" className="text-[#B76E79] font-sans hover:underline">← Back to products</Link></div>;

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const price = hasDiscount ? product.sale_price! : product.price;

  const handleAdd = () => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, price: product.price, sale_price: product.sale_price || undefined, quantity: qty, image: product.images?.[0] || '/lotus-candle.png', stock_count: product.stock_count });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-28 pb-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-[#8B5E5E] hover:text-[#B76E79] font-sans text-sm mb-8 transition-colors"><ArrowLeft size={16} /> Back to products</Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <ImageGallery images={product.images} />

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {product.category && <span className="text-xs font-bold text-[#B76E79] uppercase tracking-widest font-sans">{product.category.name}</span>}
            <h1 className="font-serif text-3xl md:text-4xl text-[#3D1C1C]">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-2xl font-bold text-[#3D1C1C]">{formatPrice(price)}</span>
              {hasDiscount && <span className="font-sans text-lg text-[#8B5E5E] line-through">{formatPrice(product.price)}</span>}
              {hasDiscount && <span className="bg-[#B76E79] text-white text-xs font-bold px-2 py-0.5 rounded-full">-{Math.round((1 - product.sale_price! / product.price) * 100)}%</span>}
            </div>
            <p className="font-sans text-[#8B5E5E] leading-relaxed">{product.short_description || product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.is_in_stock ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="font-sans text-sm text-[#8B5E5E]">{product.is_in_stock ? `In Stock (${product.stock_count} available)` : 'Out of Stock'}</span>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-[#F4B8C1]/30 px-3 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[#8B5E5E] hover:text-[#B76E79]"><Minus size={16} /></button>
                <span className="font-sans font-medium text-[#3D1C1C] w-8 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock_count, qty + 1))} className="text-[#8B5E5E] hover:text-[#B76E79]"><Plus size={16} /></button>
              </div>
              <button onClick={handleAdd} disabled={!product.is_in_stock} className="flex-1 bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
            <Link href="/checkout" onClick={handleAdd} className="block w-full bg-[#3D1C1C] text-white py-3.5 rounded-xl font-sans font-semibold text-center hover:bg-[#2D1515] transition-colors">Buy Now</Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F4B8C1]/20">
              <div className="flex flex-col items-center text-center gap-1"><Truck size={18} className="text-[#B76E79]" /><span className="font-sans text-[10px] text-[#8B5E5E]">Free Delivery 499+</span></div>
              <div className="flex flex-col items-center text-center gap-1"><Shield size={18} className="text-[#B76E79]" /><span className="font-sans text-[10px] text-[#8B5E5E]">Secure Payment</span></div>
              <div className="flex flex-col items-center text-center gap-1"><RotateCcw size={18} className="text-[#B76E79]" /><span className="font-sans text-[10px] text-[#8B5E5E]">Easy Returns</span></div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 border-b border-[#F4B8C1]/20 mb-6">
            {['description', 'details', 'shipping'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`pb-3 font-sans text-sm font-medium capitalize transition-colors border-b-2 ${tab === t ? 'border-[#B76E79] text-[#B76E79]' : 'border-transparent text-[#8B5E5E] hover:text-[#3D1C1C]'}`}>{t}</button>
            ))}
          </div>
          <div className="font-sans text-[#8B5E5E] leading-relaxed max-w-3xl">
            {tab === 'description' && <p>{product.description || 'Handcrafted with love and care.'}</p>}
            {tab === 'details' && (
              <div className="space-y-2">
                {product.fragrance && <p><strong>Fragrance:</strong> {product.fragrance}</p>}
                {product.materials && <p><strong>Materials:</strong> {product.materials}</p>}
                {product.burn_time_hours && <p><strong>Burn Time:</strong> {product.burn_time_hours} hours</p>}
                {product.weight_grams && <p><strong>Weight:</strong> {product.weight_grams}g</p>}
                {product.dimensions && <p><strong>Dimensions:</strong> {product.dimensions}</p>}
              </div>
            )}
            {tab === 'shipping' && <div><p>📦 Free delivery on orders above ₹499</p><p>🚚 Standard delivery: 3-5 business days</p><p>📍 We ship across India</p></div>}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl text-[#3D1C1C] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
