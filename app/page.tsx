import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { FadeIn, FadeInItem, TypingText, RosePetals } from "@/components/animations";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

export default function Home() {
  const instaFeed = [
    "/our-story.png",
    "/lotus-candle.png",
    "/sunflower-candle.png",
    "/custom-hamper.png",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512909414166-7e8824f92692?q=80&w=400&auto=format&fit=crop"
  ];

  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  return (
    <>
      <div className="bg-[#B76E79] text-white text-center py-2 px-4 text-sm font-sans tracking-wide relative z-20">
        Free delivery on orders above Rs.499 — DM to order on Instagram
      </div>

      <Hero />
      
      <FeaturedProducts />

      {/* ABOUT SECTION PREVIEW */}
      <section className="py-24 px-6 md:px-16 bg-[#FFF8F0] relative overflow-hidden">
        <RosePetals />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2 relative">
            <FadeIn>
              <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-[#F4B8C1]/30 p-2 bg-white">
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image 
                    src="/our-story.png"
                    alt="Sana pouring candles"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start text-left">
            <FadeIn className="space-y-6">
              <TypingText text="Our Story" className="font-serif text-5xl text-[#3D1C1C]" />
              <p className="font-sans text-[#8B5E5E] text-lg leading-relaxed">
                "Every piece is poured with love. We believe the best gifts carry warmth — literally and emotionally. Return Box by Sana was born to make gifting feel personal again."
              </p>
              <div className="pt-4 pb-2 border-b border-[#F4B8C1]/50 inline-block">
                <span className="font-serif text-[#B76E79] italic text-2xl">— Sana, Founder</span>
              </div>
              <div className="pt-8">
                <Link href="/about" className="text-[#B76E79] hover:text-[#3D1C1C] transition-colors font-sans font-bold flex items-center gap-2 group">
                  Read our full journey 
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 md:px-16 bg-white border-y border-[#F4B8C1]/20">
        <div className="max-w-6xl mx-auto">
          <FadeIn staggerChildren={true} className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]">
                <HeartHandshake size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">100% Handmade</h3>
              <p className="font-sans text-[#8B5E5E]">Crafted deeply with personal attention, free from mass production machinery.</p>
            </FadeInItem>
            
            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]">
                <Sparkles size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">Custom Packages</h3>
              <p className="font-sans text-[#8B5E5E]">Tailor ingredients, aesthetics, and specialized messages specifically for your occasion.</p>
            </FadeInItem>

            <FadeInItem className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl hover:bg-[#FFF8F0] transition-colors duration-500">
              <div className="w-16 h-16 bg-[#F4B8C1]/20 rounded-full flex items-center justify-center text-[#B76E79]">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[#3D1C1C]">Premium Quality</h3>
              <p className="font-sans text-[#8B5E5E]">Ethically sourced waxes, bespoke fragrances, and high-tier packaging standards.</p>
            </FadeInItem>
          </FadeIn>
        </div>
      </section>

      {/* INSTAGRAM GRID */}
      <section className="py-24 px-6 md:px-16 bg-[#FFF8F0]">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-4">
             <div className="flex justify-center items-center gap-3 text-[#B76E79] mb-4">
                <InstagramIcon className="w-9 h-9" />
             </div>
             <h2 className="font-serif text-4xl text-[#3D1C1C]">Follow Our Journey</h2>
             <p className="font-sans text-[#8B5E5E] text-lg max-w-xl mx-auto">
               Join our community of gifting aesthetics. Tag us to be featured.
             </p>
          </FadeIn>

          <FadeIn staggerChildren={true} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instaFeed.map((img, i) => (
              <FadeInItem key={i} className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden group cursor-pointer border border-[#F4B8C1]/30">
                <Image 
                  src={img}
                  alt={`Instagram feed image ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 blur-[1px] group-hover:blur-none"
                />
                <div className="absolute inset-0 bg-[#B76E79]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <InstagramIcon className="text-white drop-shadow-md w-8 h-8" />
                </div>
              </FadeInItem>
            ))}
          </FadeIn>

          <div className="text-center pt-8">
            <a 
               href="https://instagram.com/returnboxbysana" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 border-2 border-[#B76E79] text-[#B76E79] px-8 py-3 rounded-full hover:bg-[#F4B8C1]/20 transition-all font-sans font-medium"
            >
               @returnboxbysana
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
