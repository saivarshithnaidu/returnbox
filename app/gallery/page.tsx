"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn, RosePetals } from "@/components/animations";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Candles", "Hampers", "Events"];

  const photos = [
    { id: 1, category: "Candles", img: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop" },
    { id: 2, category: "Events", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" },
    { id: 3, category: "Hampers", img: "https://images.unsplash.com/photo-1544776193-352d25ef81bf?q=80&w=800&auto=format&fit=crop" },
    { id: 4, category: "Candles", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop" },
    { id: 5, category: "Events", img: "https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=800&auto=format&fit=crop" },
    { id: 6, category: "Hampers", img: "https://images.unsplash.com/photo-1549467645-0ad3ceee7b52?q=80&w=800&auto=format&fit=crop" },
    { id: 7, category: "Candles", img: "https://images.unsplash.com/photo-1556228578-8d89b6140337?q=80&w=800&auto=format&fit=crop" },
    { id: 8, category: "Events", img: "https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=800&auto=format&fit=crop" },
    { id: 9, category: "Candles", img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop" },
    { id: 10, category: "Hampers", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" },
    { id: 11, category: "Events", img: "https://images.unsplash.com/photo-1542038383-cecc45dc1f85?q=80&w=800&auto=format&fit=crop" },
    { id: 12, category: "Candles", img: "https://images.unsplash.com/photo-1582046200234-f8753eab2df7?q=80&w=800&auto=format&fit=crop" },
  ];

  const filteredPhotos = activeTab === "All" ? photos : photos.filter(p => p.category === activeTab);

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 overflow-hidden relative">
      <RosePetals />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center space-y-6 mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-[#3D1C1C]">Gallery</h1>
          <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">
            A visual documentation of the warmth we create.
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

        {/* Native CSS Multi-Column Masonry Grid */}
        <FadeIn className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
             <div 
               key={photo.id}
               className="break-inside-avoid relative rounded-3xl overflow-hidden group border border-transparent hover:border-[#B76E79]/50 transition-all duration-300"
             >
               {/* 
                 For purely CSS masonry with Next/Image, we render without aspect ratios 
                 by maintaining an intrinsic or relative wrapper that isn't absolutely filling an unknown container.
                 Because external images don't expose width/height natively, we use a trick: 
                 Set relative, let Next/Image fill it, but give the container an arbitrary styling based on ID or use intrinsic sizes if known.
                 For this demo we will alternate arbitrary padding-bottoms to simulate masonry.
               */}
               <div 
                  className="w-full relative" 
                  style={{ paddingBottom: `${(photo.id % 3) * 20 + 80}%` }}
               >
                 <Image 
                   src={photo.img} 
                   alt={`Gallery Photo ${photo.id}`}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
             </div>
          ))}
        </FadeIn>

      </div>
    </div>
  );
}
