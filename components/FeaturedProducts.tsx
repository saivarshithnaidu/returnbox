"use client";

import { FadeIn } from "./animations";
import Image from "next/image";

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Lotus Candle",
      desc: "Delicate hand-poured lotus shape representing purity and enlightenment. Soft floral scent.",
      img: "/lotus-candle.png"
    },
    {
      id: 2,
      name: "Sunflower Candle",
      desc: "Bright, cheerful sunflower design with uplifting citrus and vanilla fragrance notes.",
      img: "/sunflower-candle.png"
    },
    {
      id: 3,
      name: "Custom Hamper",
      desc: "Bespoke curated hamper featuring candles, artisanal chocolates, and personalized notes.",
      img: "/custom-hamper.png"
    }
  ];

  return (
    <section id="products" className="py-20 px-6 md:px-16 bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Section Header */}
        <FadeIn className="text-center space-y-4">
           <span className="text-sm font-bold text-[#B76E79] uppercase tracking-widest block font-sans">
             Our Collection
           </span>
           <h2 className="font-serif text-4xl md:text-5xl text-[#2D1515]">
             Made with Heart
           </h2>
           <p className="text-[#8B5E5E] font-sans text-lg max-w-xl mx-auto">
             Every piece handcrafted to carry warmth and love
           </p>
        </FadeIn>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.1} className="bg-[#FDE8EE] rounded-2xl flex flex-col min-h-[420px] hover:shadow-sm transition-shadow group">
              <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl shrink-0">
                <Image 
                  src={product.img} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-serif text-3xl mb-4 text-[#2D1515]">{product.name}</h3>
                <p className="font-sans text-[#2D1515] opacity-80 leading-[1.7] mb-8 flex-1">
                  {product.desc}
                </p>
                <a 
                  href={`https://wa.me/1234567890?text=Hi%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto bg-[#B76E79] text-white px-8 py-3 rounded-full hover:bg-[#9a5a65] transition-all flex items-center justify-center font-sans font-medium w-full text-center"
                >
                   Order via WhatsApp
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
