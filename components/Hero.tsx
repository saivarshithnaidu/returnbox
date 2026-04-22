"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, TypingText, RosePetals } from "./animations";

export default function Hero() {
  return (
    <section className="relative py-20 px-6 md:px-16 overflow-hidden min-h-[85vh] flex items-center justify-center">
      {/* 🧱 Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png"
          alt="Luxury Handmade Candles Background"
          fill
          className="object-cover opacity-25 blur-[2px] transition-transform duration-[10s] hover:scale-110"
          priority
        />
        {/* Subtle Gradient Overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDE8EE]/90 via-[#F4B8C1]/60 to-[#FFF8F3]/95" />
      </div>

      {/* Background CSS Flicker flame effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/40 rounded-full blur-[100px] animate-flicker pointer-events-none z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B76E79]/20 rounded-full blur-[120px] animate-flicker pointer-events-none animation-delay-2000 z-[1]" />
      
      <div className="relative z-10 w-full">
        <RosePetals />

        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-8 md:gap-10 pt-16 md:pt-28 pb-10 relative">
          
          <FadeIn className="space-y-6 flex flex-col items-center w-full max-w-4xl">
            <TypingText
              text="We Wrap Love"
              className="font-serif text-6xl md:text-[80px] leading-tight text-[#3D1C1C] font-bold drop-shadow-md"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="font-sans text-[#3D1C1C] text-xl md:text-2xl max-w-2xl leading-relaxed mt-4 drop-shadow-sm font-medium"
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
                className="bg-[#3D1C1C] text-white px-10 py-4 rounded-full hover:bg-[#B76E79] transition-all font-sans text-lg font-bold shadow-xl hover:shadow-2xl active:scale-95"
                style={{ padding: '1rem 2.5rem' }}
              >
                Shop Now
              </Link>
              <Link
                href="/custom-orders"
                className="bg-white/60 text-[#3D1C1C] backdrop-blur-md border border-[#3D1C1C]/10 px-10 py-4 rounded-full hover:bg-white/90 transition-all font-sans text-lg font-bold shadow-lg hover:shadow-xl active:scale-95"
              >
                Order Custom
              </Link>
            </motion.div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
