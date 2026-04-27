'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/ui/ImageGallery';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import ReviewForm from '@/components/ui/ReviewForm';
import BundleCard from '@/components/ui/BundleCard';
import type { Product, Review, Bundle } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(data => {
      const all = (data.products || []) as Product[];
      setAllProducts(all);
      const found = all.find(p => p.slug === slug);
      setProduct(found || null);
      if (found) {
        setRelated(all.filter(p => p.id !== found.id && p.is_active && (p.category_id === found.category_id || p.is_featured)).slice(0, 4));
        
        // Fetch reviews
        fetch(`/api/reviews?product_id=${found.id}`).then(r => r.json()).then(d => {
          const revs = d.reviews || [];
          setReviews(revs);
          if (revs.length > 0) {
            const sum = revs.reduce((acc: number, r: Review) => acc + r.rating, 0);
            setAvgRating(parseFloat((sum / revs.length).toFixed(1)));
          }
        });

        // Fetch bundles
        fetch('/api/bundles').then(r => r.json()).then(d => {
          const allBundles = d.bundles || [];
          setBundles(allBundles.filter((b: Bundle) => b.products.some(bp => bp.product_id === found.id)));
        });
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

            {/* Rating Summary */}
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size={16} />
              <span className="font-sans text-xs text-[#8B5E5E]">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
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

            <button
              onClick={() => {
                const widget = document.querySelector('[aria-label="Gift Help ✨"]') as HTMLButtonElement;
                if (widget) widget.click();
              }}
              className="w-full flex items-center justify-center gap-2 border-2 border-[#B76E79]/20 text-[#B76E79] py-3 rounded-xl font-sans text-sm font-medium hover:bg-[#B76E79]/5 transition-colors"
            >
              <Sparkles size={16} /> Ask Gift Genius about this
            </button>

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
          <div className="flex gap-6 border-b border-[#F4B8C1]/20 mb-6 overflow-x-auto scrollbar-hide">
            {['description', 'details', 'reviews', 'shipping'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`pb-3 font-sans text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${tab === t ? 'border-[#B76E79] text-[#B76E79]' : 'border-transparent text-[#8B5E5E] hover:text-[#3D1C1C]'}`}>{t}</button>
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
            {tab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#F4B8C1]/20">
                  <div>
                    <p className="font-serif text-3xl text-[#3D1C1C] mb-1">{avgRating}</p>
                    <StarRating rating={avgRating} size={20} />
                    <p className="font-sans text-xs text-[#8B5E5E] mt-2">Based on {reviews.length} reviews</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center justify-center gap-2 bg-[#B76E79] text-white px-6 py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors"
                  >
                    <MessageSquare size={18} /> Write a Review
                  </button>
                </div>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="font-sans text-[#8B5E5E] italic">No reviews yet. Be the first to review this product!</p>
                  ) : reviews.map(rev => (
                    <div key={rev.id} className="border-b border-[#F4B8C1]/10 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-sans font-bold text-[#3D1C1C]">{rev.customer_name}</p>
                        <span className="font-sans text-[10px] text-[#8B5E5E]">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={rev.rating} size={14} />
                      {rev.review_text && <p className="font-sans text-sm text-[#5a3a3a] mt-3 leading-relaxed">{rev.review_text}</p>}
                      {rev.review_image_url && (
                        <div className="relative w-24 h-24 mt-4 rounded-xl overflow-hidden border border-[#F4B8C1]/20">
                          <Image src={rev.review_image_url} alt="Review" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bundles */}
        {bundles.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79]">
                <Sparkles size={20} />
              </div>
              <h2 className="font-serif text-2xl text-[#3D1C1C]">Frequently Bought Together</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map(b => <BundleCard key={b.id} bundle={b} allProducts={allProducts} />)}
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            productId={product.id}
            productName={product.name}
            onClose={() => setShowReviewForm(false)}
            onSubmitted={() => {
              setShowReviewForm(false);
              // Refresh reviews
              fetch(`/api/reviews?product_id=${product.id}`).then(r => r.json()).then(d => {
                setReviews(d.reviews || []);
              });
            }}
          />
        )}

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
