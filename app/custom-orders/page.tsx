"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn, FadeInItem, RosePetals } from "@/components/animations";

export default function CustomOrders() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occasion: "",
    quantity: "25-50",
    date: "",
    instructions: ""
  });

  const occasionsGallery = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", // Wedding
    "https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=800&auto=format&fit=crop", // Birthday
    "https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=800&auto=format&fit=crop", // Corporate
    "https://images.unsplash.com/photo-1542038383-cecc45dc1f85?q=80&w=800&auto=format&fit=crop", // Baby Shower
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop", // Festival
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", // Anniversary
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I want a custom order!
Name: ${formData.name}
Phone: ${formData.phone}
Occasion: ${formData.occasion}
Quantity: ${formData.quantity}
Needed By: ${formData.date}
Details: ${formData.instructions}`;
    
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#FFF8F0] min-h-screen pt-32 pb-24 px-6 md:px-16 overflow-hidden relative">
      <RosePetals />
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-24">
        {/* Header Block */}
        <FadeIn className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl text-[#3D1C1C]">Something Made Just For You</h1>
          <p className="font-sans text-[#8B5E5E] text-lg leading-relaxed">
            Custom bulk orders for weddings, birthdays, corporate events, and baby showers. We bring your aesthetic vision to life carefully and individually.
          </p>
        </FadeIn>

        {/* Form and Info Section */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          <FadeIn className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(244,184,193,0.15)] border border-[#F4B8C1]/30">
            <h2 className="font-serif text-3xl text-[#3D1C1C] mb-8">Start Your Order</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Your Name" className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#3D1C1C]" onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="tel" placeholder="Phone Number" className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#3D1C1C]" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <input required type="text" placeholder="Occasion Type (e.g., Summer Wedding)" className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#3D1C1C]" onChange={e => setFormData({...formData, occasion: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#8B5E5E]" onChange={e => setFormData({...formData, quantity: e.target.value})} aria-label="Quantity">
                   <option value="25-50">25 - 50 pieces</option>
                   <option value="50-100">50 - 100 pieces</option>
                   <option value="100-250">100 - 250 pieces</option>
                   <option value="250+">250+ pieces</option>
                </select>
                <input required type="date" className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#8B5E5E]" onChange={e => setFormData({...formData, date: e.target.value})} aria-label="Needed by date"/>
              </div>

              <textarea required rows={4} placeholder="Any special instructions or theme colors?" className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0]/50 border border-[#F4B8C1]/30 focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-sans text-sm text-[#3D1C1C]" onChange={e => setFormData({...formData, instructions: e.target.value})}></textarea>
              
              <button type="submit" className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-bold font-sans hover:bg-[#3D1C1C] transition-colors shadow-md hover:shadow-xl">
                Send to WhatsApp
              </button>
            </form>
          </FadeIn>

          <FadeIn className="space-y-12 h-full flex flex-col justify-center">
             <div className="space-y-4">
               <h3 className="font-serif text-2xl text-[#3D1C1C]">Process & Details</h3>
               <div className="w-12 h-1 bg-[#F4B8C1] rounded-full"></div>
             </div>

             <div className="space-y-8">
               <div className="flex gap-4">
                 <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-[#B76E79] text-xl font-bold shadow-sm border border-[#F4B8C1]/30">1</div>
                 <div>
                   <h4 className="font-bold text-[#3D1C1C] font-sans mb-1">Consultation</h4>
                   <p className="text-[#8B5E5E] font-sans text-sm">We'll discuss your theme, fragrances, and packaging down to the ribbon color via WhatsApp.</p>
                 </div>
               </div>
               
               <div className="flex gap-4">
                 <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-[#B76E79] text-xl font-bold shadow-sm border border-[#F4B8C1]/30">2</div>
                 <div>
                   <h4 className="font-bold text-[#3D1C1C] font-sans mb-1">Minimum Order & Timeline</h4>
                   <p className="text-[#8B5E5E] font-sans text-sm">Custom orders start at 25 pieces. Typical turnaround time is 5-7 working days depending on materials.</p>
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-[#B76E79] text-xl font-bold shadow-sm border border-[#F4B8C1]/30">3</div>
                 <div>
                   <h4 className="font-bold text-[#3D1C1C] font-sans mb-1">Delivery</h4>
                   <p className="text-[#8B5E5E] font-sans text-sm">Carefully bubble-wrapped, boxed, and securely shipped anywhere in India.</p>
                 </div>
               </div>
             </div>
          </FadeIn>
        </div>

        {/* Occasions Gallery */}
        <div className="space-y-8 pt-16 border-t border-[#F4B8C1]/30">
          <FadeIn className="text-center">
             <h2 className="font-serif text-4xl text-[#3D1C1C]">Past Occasions</h2>
          </FadeIn>
          <FadeIn staggerChildren={true} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {occasionsGallery.map((img, i) => (
               <FadeInItem key={i} className="relative aspect-square w-full rounded-3xl overflow-hidden group">
                  <Image 
                    src={img} 
                    alt={`Occasion ${i + 1}`} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white font-serif italic text-lg tracking-wide">Aesthetic Moments</span>
                  </div>
               </FadeInItem>
            ))}
          </FadeIn>
        </div>

      </div>
    </div>
  );
}
