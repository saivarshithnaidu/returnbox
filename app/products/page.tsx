"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn, FadeInItem, RosePetals } from "@/components/animations";

export default function Products() {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Candles", "Return Gifts", "Custom Hampers", "Favours", "Seasonal"];

  const products = [
    { id: 1, name: "Rose Quartz Collection", category: "Candles", price: "Rs. 499 onwards", img: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Wedding Favor Set", category: "Return Gifts", price: "Rs. 1,299 onwards", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Luxury Hamper Box", category: "Custom Hampers", price: "Rs. 2,499 onwards", img: "https://images.unsplash.com/photo-1544776193-352d25ef81bf?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Vanilla Bean Jar", category: "Candles", price: "Rs. 599 onwards", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Festive Joy Spark", category: "Seasonal", price: "Rs. 899 onwards", img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Baby Shower Miniatures", category: "Favours", price: "Rs. 399 onwards", img: "https://images.unsplash.com/photo-1582046200234-f8753eab2df7?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Midnight Jasmine", category: "Candles", price: "Rs. 599 onwards", img: "https://images.unsplash.com/photo-1556228578-8d89b6140337?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Corporate Gift Set", category: "Return Gifts", price: "Rs. 1,899 onwards", img: "https://images.unsplash.com/photo-1549467645-0ad3ceee7b52?q=80&w=800&auto=format&fit=crop" },
  ];

  const filteredProducts = activeTab === "All" ? products : products.filter(p => p.category === activeTab);

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 overflow-hidden relative">
      <RosePetals />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center space-y-6 mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-[#3D1C1C]">Our Collection</h1>
          <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">
            Browse through our handcrafted masterpieces. Perfect for gifting, keeping, and celebrating.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full font-sans text-sm transition-all border ${
                  activeTab === cat 
                    ? "bg-[#B76E79] text-white border-[#B76E79]" 
                    : "bg-white/50 text-[#8B5E5E] border-[#F4B8C1]/30 hover:bg-[#F4B8C1] hover:text-white hover:border-[#F4B8C1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Product Grid */}
        <FadeIn staggerChildren={true} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-all">
          {filteredProducts.map(product => (
            <FadeInItem key={product.id} className="bg-white rounded-[2rem] p-4 border border-[#F4B8C1]/30 hover:border-[#F4B8C1] hover:shadow-[0_10px_30px_rgba(244,184,193,0.2)] transition-all group flex flex-col h-full">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5">
                <Image 
                  src={product.img} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#B76E79] z-10 uppercase tracking-wider">
                  {product.category}
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <h3 className="font-serif text-xl text-[#3D1C1C] mb-2">{product.name}</h3>
                <p className="font-sans text-[#B76E79] font-medium mb-6 mt-auto">
                  {product.price}
                </p>
                
                <a 
                  href={`https://wa.me/1234567890?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full border border-[#B76E79] text-[#B76E79] text-center font-sans font-medium hover:bg-[#B76E79] hover:text-white transition-all"
                >
                  Order on WhatsApp
                </a>
              </div>
            </FadeInItem>
          ))}
        </FadeIn>
      </div>
    </div>
  );
}
