"use client";

import Image from "next/image";
import { FadeIn, RosePetals } from "@/components/animations";

export default function About() {
  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 overflow-hidden relative">
      <RosePetals />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-24">
        
        {/* HOW IT STARTED */}
        <div className="flex flex-col md:flex-row items-center gap-16">
           <FadeIn className="w-full md:w-1/2 relative space-y-4">
              <div className="relative aspect-[4/5] w-full rounded-tl-full rounded-br-full overflow-hidden border-[8px] border-[#F4B8C1] p-2 bg-white shadow-[0_20px_50px_rgba(244,184,193,0.3)]">
                 <div className="relative w-full h-full rounded-tl-full rounded-br-full overflow-hidden">
                    <Image 
                      src="/our-story.png"
                      alt="Sana pouring candles"
                      fill
                      className="object-cover"
                    />
                 </div>
              </div>
              <div className="text-center pt-2">
                 <h3 className="font-serif text-2xl text-[#3D1C1C]">Sana</h3>
                 <p className="font-sans text-[#B76E79] italic font-medium tracking-wide">The woman behind the love</p>
              </div>
           </FadeIn>

           <FadeIn className="w-full md:w-1/2 space-y-6">
              <span className="font-sans text-sm font-bold tracking-widest text-[#B76E79] uppercase">How It Started</span>
              <h2 className="font-serif text-4xl text-[#3D1C1C] leading-tight">Born from a desire to make gifting personal again.</h2>
              <div className="space-y-4 font-sans text-lg text-[#8B5E5E] leading-relaxed">
                 <p>
                   It started in a small kitchen with a singular belief: the best gifts carry warmth — literally and emotionally.
                 </p>
                 <p>
                   We noticed that modern gifting had become transactional. Mass-produced items in generic boxes lacked the soul of true giving. Sana wanted to create a brand where every single unboxing felt like receiving a hug from an old friend.
                 </p>
              </div>
           </FadeIn>
        </div>

        {/* WHAT WE STAND FOR */}
        <FadeIn className="space-y-12">
           <div className="text-center space-y-4">
              <span className="font-sans text-sm font-bold tracking-widest text-[#B76E79] uppercase">Our Core Beliefs</span>
              <h2 className="font-serif text-4xl text-[#3D1C1C]">What We Stand For</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-[#F4B8C1]/30 hover:shadow-[0_10px_30px_rgba(244,184,193,0.15)] transition-all">
                 <div className="w-12 h-12 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79] mb-6 text-xl font-bold font-serif">1</div>
                 <h3 className="font-serif text-2xl text-[#3D1C1C] mb-3">Handmade with Intention</h3>
                 <p className="font-sans text-[#8B5E5E] leading-relaxed text-sm">No heavy machinery. Every candle is hand-poured, every wick is hand-trimmed, and every package is hand-tied with a bow.</p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-[#F4B8C1]/30 hover:shadow-[0_10px_30px_rgba(244,184,193,0.15)] transition-all">
                 <div className="w-12 h-12 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79] mb-6 text-xl font-bold font-serif">2</div>
                 <h3 className="font-serif text-2xl text-[#3D1C1C] mb-3">Sustainable Joy</h3>
                 <p className="font-sans text-[#8B5E5E] leading-relaxed text-sm">We use eco-forward soy waxes, clean-burning wicks, and recyclable vessels. Gifting shouldn't cost the earth.</p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-[#F4B8C1]/30 hover:shadow-[0_10px_30px_rgba(244,184,193,0.15)] transition-all">
                 <div className="w-12 h-12 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79] mb-6 text-xl font-bold font-serif">3</div>
                 <h3 className="font-serif text-2xl text-[#3D1C1C] mb-3">Love-Filled</h3>
                 <p className="font-sans text-[#8B5E5E] leading-relaxed text-sm">We don't ship boxes; we ship emotions. Our goal is to make whoever opens our signature pink box smile immediately.</p>
              </div>
           </div>
        </FadeIn>

      </div>
    </div>
  );
}
