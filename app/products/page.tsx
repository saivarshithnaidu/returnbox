'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { FadeIn, RosePetals } from '@/components/animations';
import type { Product, Category } from '@/lib/supabase/types';
import { Loader2, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts((p.products || []).filter((x: Product) => x.is_active));
      setCategories((c.categories || []).filter((x: Category) => x.is_active));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category_id === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'bestseller') return b.order_count - a.order_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 relative">
      <RosePetals />
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#3D1C1C]">Our Collection</h1>
          <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">Browse handcrafted masterpieces. Perfect for gifting, keeping, and celebrating.</p>
        </FadeIn>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCategory('all')} className={`px-5 py-2 rounded-full font-sans text-sm border transition-all ${activeCategory === 'all' ? 'bg-[#B76E79] text-white border-[#B76E79]' : 'bg-white/50 text-[#8B5E5E] border-[#F4B8C1]/30 hover:bg-[#F4B8C1] hover:text-white'}`}>All</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-5 py-2 rounded-full font-sans text-sm border transition-all ${activeCategory === c.id ? 'bg-[#B76E79] text-white border-[#B76E79]' : 'bg-white/50 text-[#8B5E5E] border-[#F4B8C1]/30 hover:bg-[#F4B8C1] hover:text-white'}`}>{c.name}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 rounded-full bg-white border border-[#F4B8C1]/30 font-sans text-sm text-[#3D1C1C] focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]">
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="bestseller">Bestsellers</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#B76E79]" size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-[#3D1C1C] mb-2">No products found</p>
            <p className="font-sans text-[#8B5E5E]">Try a different category or check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
