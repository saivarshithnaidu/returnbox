"use client";

import { FadeIn, RosePetals } from "@/components/animations";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 overflow-hidden relative flex items-center justify-center">
      <RosePetals />
      
      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        <FadeIn className="bg-white rounded-[3rem] p-8 md:p-16 border border-[#F4B8C1]/30 shadow-[0_20px_60px_rgba(244,184,193,0.15)] flex flex-col md:flex-row gap-16 md:gap-24 relative overflow-hidden">
           {/* Decorative background blob inside the card */}
           <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#F4B8C1] rounded-full opacity-10 mix-blend-multiply pointer-events-none" />

           {/* Left: Info */}
           <div className="w-full md:w-1/2 space-y-10 relative z-10">
              <div className="space-y-4">
                 <span className="font-sans text-sm font-bold tracking-widest text-[#B76E79] uppercase">Get In Touch</span>
                 <h1 className="font-serif text-5xl text-[#3D1C1C] leading-tight">We'd love to hear from you.</h1>
                 <p className="font-sans text-[#8B5E5E] text-lg">Whether it's a completely custom bulk order, a collaboration, or just a quick question about our fragrances.</p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition-all shadow-sm">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h4 className="font-sans font-bold text-[#3D1C1C]">Location</h4>
                       <p className="font-sans text-[#8B5E5E]">Guntur, Andhra Pradesh</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition-all shadow-sm">
                       <Clock size={24} />
                    </div>
                    <div>
                       <h4 className="font-sans font-bold text-[#3D1C1C]">Response Time</h4>
                       <p className="font-sans text-[#B76E79] font-medium">We reply within 2 hours</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition-all shadow-sm">
                       <Mail size={24} />
                    </div>
                    <div>
                       <h4 className="font-sans font-bold text-[#3D1C1C]">Email</h4>
                       <a href="mailto:hello@returnboxbysana.com" className="font-sans text-[#8B5E5E] hover:text-[#B76E79] transition-colors">hello@returnboxbysana.com</a>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Actions */}
           <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 relative z-10">
              <a 
                href="https://wa.me/1234567890?text=Hi,%20I%20have%20an%20inquiry!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#B76E79] text-white p-6 rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-[#3D1C1C] transition-all group shadow-md hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                 <MessageCircle size={40} className="text-[#F4B8C1] group-hover:text-[#F4B8C1]" />
                 <div>
                    <h3 className="font-serif text-2xl font-bold mb-1">Chat on WhatsApp</h3>
                    <p className="font-sans text-white/80 text-sm">The fastest way to place orders & customize</p>
                 </div>
              </a>

              <a 
                href="https://instagram.com/returnboxbysana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border-2 border-[#F4B8C1]/50 text-[#3D1C1C] p-6 rounded-3xl flex flex-col items-center text-center gap-4 hover:border-[#B76E79] hover:bg-[#FFF8F0] transition-all group duration-300"
              >
                 <InstagramIcon className="text-[#B76E79] w-10 h-10" />
                 <div>
                    <h3 className="font-serif text-2xl font-bold mb-1">DM on Instagram</h3>
                    <p className="font-sans text-[#8B5E5E] text-sm">@returnboxbysana</p>
                 </div>
              </a>
           </div>

        </FadeIn>

      </div>
    </div>
  );
}
