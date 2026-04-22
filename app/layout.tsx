import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import NewsletterModal from '@/components/NewsletterModal';
import DemoBanner from '@/components/DemoBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Return Box by Sana | We Wrap Love',
  description: 'Premium handmade candles and return gifts brand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FFF8F0] text-[#3D1C1C] min-h-screen flex flex-col leading-[1.7]`}>
        
        {/* Global Wrappers */}
        <DemoBanner />
        <Navbar />
        <NewsletterModal />
        <FloatingWhatsApp />
        
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-[#1A0F0F] to-[#0D0A0A] border-t border-white/5 pt-16 pb-8 px-6 md:px-16 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
            
            {/* 1. BRAND BLOCK */}
            <div className="flex flex-col max-w-[280px] space-y-4">
               <Link href="/" className="font-serif text-3xl font-bold text-white tracking-wide">
                 Return Box
               </Link>
               <p className="font-sans text-sm text-[#F4B8C1]">
                 Luxury Candles for Modern Living
               </p>
               <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed">
                 Handcrafted scented candles designed to bring warmth, calm, and elegance into your everyday spaces.
               </p>
            </div>

            {/* 2. NAVIGATION */}
            <div className="flex flex-col space-y-3">
               <h4 className="font-sans text-white text-sm font-semibold tracking-wider uppercase mb-3">Explore</h4>
               {["Home", "Products", "Custom Orders", "Gallery", "About", "Contact"].map(link => (
                  <Link 
                     key={link} 
                     href={link === "Home" ? "/" : `/${link.toLowerCase().replace(' ', '-')}`} 
                     className="font-sans text-[#A0A0A0] text-sm hover:text-[#F4B8C1] hover:underline underline-offset-4 transition-colors"
                  >
                     {link}
                  </Link>
               ))}
            </div>

            {/* 3. CONTACT + SOCIAL */}
            <div className="flex flex-col space-y-4">
               <h4 className="font-sans text-white text-sm font-semibold tracking-wider uppercase mb-1">Connect</h4>
               <a href="mailto:hello@returnbox.growxlabs.tech" className="font-sans text-sm text-[#A0A0A0] hover:text-[#F4B8C1] transition-colors">
                  hello@returnbox.growxlabs.tech
               </a>
               <p className="font-sans text-sm text-[#A0A0A0]">
                  Guntur, Andhra Pradesh
               </p>
               <a 
                 href="https://wa.me/1234567890" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-block bg-[#B76E79] text-white text-xs px-5 py-2 rounded-full hover:bg-[#F4B8C1] hover:shadow-[0_0_15px_rgba(244,184,193,0.3)] transition-all font-medium mt-2 w-max"
               >
                 Chat on WhatsApp
               </a>
               
               <div className="flex items-center gap-3 mt-4">
                  <a href="https://instagram.com/returnboxbysana" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 hover:scale-105 transition-all text-[#A0A0A0] hover:text-[#F4B8C1]">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                       <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                     </svg>
                  </a>
               </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-xs text-[#A0A0A0]">
                © 2026 Return Box by Sana
             </div>
             <div className="text-xs text-[#A0A0A0]">
                Built with care by GrowX Labs
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
