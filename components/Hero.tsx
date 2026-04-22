"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, TypingText, RosePetals } from "./animations";

export default function Hero() {
  return (
    <section className="bg-[#F4B8C1] py-20 px-6 md:px-16 overflow-hidden relative">
      {/* Background CSS Flicker flame effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFF8F0]/30 rounded-full blur-[100px] animate-flicker pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B76E79]/20 rounded-full blur-[120px] animate-flicker pointer-events-none animation-delay-2000" />
      
      <RosePetals />

      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-8 md:gap-10 pt-16 md:pt-28 pb-10 relative z-10">
        
        <FadeIn className="space-y-6 flex flex-col items-center w-full max-w-4xl">
          <TypingText 
            text="We Wrap Love"
            className="font-serif text-6xl md:text-[80px] leading-tight text-[#3D1C1C] font-bold drop-shadow-sm" 
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="font-sans text-[#3D1C1C]/80 text-xl md:text-2xl max-w-2xl leading-relaxed mt-4"
          >
            Handcrafted candles and return gifts, made with heart
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-5 pt-8"
          >
             <Link 
               href="/products" 
               className="bg-[#3D1C1C] text-white px-10 py-4- rounded-full hover:bg-[#FFF8F0] hover:text-[#3D1C1C] transition-all font-sans text-lg font-bold shadow-md hover:shadow-lg"
               style={{ padding: '1rem 2.5rem' }}
             >
               Shop Now
             </Link>
             <Link 
               href="/custom-orders" 
               className="bg-white/40 text-[#3D1C1C] backdrop-blur-sm border border-[#3D1C1C]/20 px-10 py-4 rounded-full hover:bg-white/60 transition-all font-sans text-lg font-bold shadow-sm hover:shadow-md"
             >
               Order Custom
             </Link>
          </motion.div>
        </FadeIn>

      </div>
    </section>
  );
}
