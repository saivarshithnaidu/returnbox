import Hero from '@/components/Hero';
import { FadeIn, FadeInItem, TypingText, RosePetals } from '@/components/animations';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import ProductCard from '@/components/ui/ProductCard';
import type { Product, Category } from '@/lib/supabase/types';

// Fetch featured products and categories for homepage
async function getFeaturedData() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/products`, { next: { revalidate: 60 } }).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/categories`, { next: { revalidate: 60 } }).catch(() => null),
    ]);
    const products = productsRes ? (await productsRes.json()).products?.filter((p: Product) => p.is_featured && p.is_active)?.slice(0, 6) || [] : [];
    const categories = categoriesRes ? (await categoriesRes.json()).categories?.filter((c: Category) => c.is_active)?.slice(0, 4) || [] : [];
    return { products, categories };
  } catch {
    return { products: [], categories: [] };
  }
}

// Fallback static products for when DB isn't connected
const fallbackProducts: Product[] = [
  { id: '1', name: 'Lotus Candle', slug: 'lotus-candle', description: 'Delicate hand-poured lotus shape.', short_description: 'Soft floral scent representing purity.', category_id: null, price: 499, sale_price: null, images: ['/lotus-candle.png'], stock_count: 10, is_in_stock: true, is_featured: true, is_active: true, weight_grams: 200, burn_time_hours: 8, fragrance: 'Floral', dimensions: null, materials: 'Soy Wax', tags: ['candle'], view_count: 0, order_count: 0, created_at: '', updated_at: '' },
  { id: '2', name: 'Sunflower Candle', slug: 'sunflower-candle', description: 'Bright, cheerful sunflower design.', short_description: 'Uplifting citrus and vanilla notes.', category_id: null, price: 599, sale_price: 499, images: ['/sunflower-candle.png'], stock_count: 15, is_in_stock: true, is_featured: true, is_active: true, weight_grams: 250, burn_time_hours: 10, fragrance: 'Citrus', dimensions: null, materials: 'Soy Wax', tags: ['candle'], view_count: 0, order_count: 0, created_at: '', updated_at: '' },
  { id: '3', name: 'Custom Hamper', slug: 'custom-hamper', description: 'Bespoke curated hamper.', short_description: 'Candles, chocolates & personalized notes.', category_id: null, price: 1299, sale_price: null, images: ['/custom-hamper.png'], stock_count: 5, is_in_stock: true, is_featured: true, is_active: true, weight_grams: 500, burn_time_hours: null, fragrance: null, dimensions: null, materials: null, tags: ['hamper'], view_count: 0, order_count: 0, created_at: '', updated_at: '' },
];

export default async function Home() {
  const { products, categories } = await getFeaturedData().catch(() => ({ products: [], categories: [] }));
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  const instaFeed = [
    { src: '/our-story.png' }, { src: '/lotus-candle.png' }, { src: '/sunflower-candle.png' },
    { src: '/custom-hamper.png' }, { src: '/candle-story.png' }, { src: '/insta-6.png' },
  ];

  return (
    <>
      <Hero />

      {/* FEATURED PRODUCTS */}
      <section id="products" className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-4">
            <span className="text-sm font-bold text-[#B76E79] uppercase tracking-widest block font-sans">Our Collection</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2D1515]">Made with Heart</h2>
            <p className="text-[#8B5E5E] font-sans text-lg max-w-xl mx-auto">Every piece handcrafted to carry warmth and love</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center">
            <Link href="/products" className="inline-flex items-center gap-2 border-2 border-[#B76E79] text-[#B76E79] px-8 py-3 rounded-full hover:bg-[#B76E79] hover:text-white transition-all font-sans font-medium">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 px-6 md:px-16 bg-[#FFF8F0] relative overflow-hidden">
        <RosePetals />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2 relative">
            <FadeIn>
              <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-[#F4B8C1]/30 p-2 bg-white">
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image src="/sana-portrait.png" alt="Sana pouring candles" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start text-left">
            <FadeIn className="space-y-6">
              <TypingText text="Our Story" className="font-serif text-5xl text-[#3D1C1C]" />
              <p className="font-sans text-[#8B5E5E] text-lg leading-relaxed">&quot;Every piece is poured with love. We believe the best gifts carry warmth — literally and emotionally. Return Box by Sana was born to make gifting feel personal again.&quot;</p>
              <div className="pt-4 pb-2 border-b border-[#F4B8C1]/50 inline-block">
                <span className="font-serif text-[#B76E79] italic text-2xl">— Sana, Founder</span>
              </div>
              <Link href="/about" className="text-[#B76E79] hover:text-[#3D1C1C] transition-colors font-sans font-bold flex items-center gap-2 group mt-4">
                Read our full journey <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 md:px-16 bg-white border-y border-[#F4B8C1]/20">
        <div className="max-w-6xl mx-auto">
          <FadeIn staggerChildren={true} className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]"><HeartHandshake size={32} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">100% Handmade</h3>
              <p className="font-sans text-[#8B5E5E]">Crafted deeply with personal attention, free from mass production.</p>
            </FadeInItem>
            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]"><Sparkles size={32} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">Custom Packages</h3>
              <p className="font-sans text-[#8B5E5E]">Tailor everything specifically for your special occasion.</p>
            </FadeInItem>
            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]"><ShieldCheck size={32} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">Premium Quality</h3>
              <p className="font-sans text-[#8B5E5E]">Ethically sourced waxes, bespoke fragrances, and high-tier packaging.</p>
            </FadeInItem>
          </FadeIn>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-24 px-6 md:px-16 bg-[#FFF8F0]">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-4">
            <h2 className="font-serif text-4xl text-[#3D1C1C]">Follow Our Journey</h2>
            <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">Join our community. Tag us to be featured.</p>
          </FadeIn>
          <FadeIn staggerChildren={true} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instaFeed.map((item, i) => (
              <FadeInItem key={i} className="relative aspect-square w-full rounded-2xl overflow-hidden group cursor-pointer border border-[#F4B8C1]/30 bg-white">
                <Image src={item.src} alt={`Instagram ${i + 1}`} fill quality={90} sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,16vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </FadeInItem>
            ))}
          </FadeIn>
          <div className="text-center pt-4">
            <a href="https://instagram.com/returnboxbysana" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[#B76E79] text-[#B76E79] px-8 py-3 rounded-full hover:bg-[#F4B8C1]/20 transition-all font-sans font-medium">@returnboxbysana</a>
          </div>
        </div>
      </section>
    </>
  );
}
