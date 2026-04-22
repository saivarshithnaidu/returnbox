"use client";

import { FadeIn } from "@/components/animations";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Bespoke Bridal Trunks",
      desc: "Custom-made velvet trousseau trunks tailored to the bride's theme. Includes individual embroidered pouches, ring boxes, and elegant organization for the big day.",
      img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Corporate Gifting",
      desc: "Elevate your corporate relationships with premium hampers. Includes branded ribbons, artisan chocolates, and custom printed luxury cards inside.",
      img: "https://images.unsplash.com/photo-1544776193-352d25ef81bf?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Anniversary Rose Decks",
      desc: "Our signature artificial rose arrangements. Hand-placed roses in a clear acrylic or suede box spanning anywhere from 12 to 100 roses.",
      img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Baby Arrival Hampers",
      desc: "Soft pastel-themed curation for newborns, incorporating cozy textures, delicate packaging, and safe, premium baby essentials.",
      img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-[#FFF8F3]">
        <div className="max-w-6xl mx-auto space-y-24">
          <FadeIn className="text-center max-w-3xl mx-auto pt-10">
            <h1 className="font-serif text-5xl md:text-7xl mb-8">
              Our <span className="text-[#B76E79]">Services</span>
            </h1>
            <p className="text-lg text-[#8B5E5E]">
              From trousseau packing to premium corporate hampers, discover how we can elevate your gifting experience.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.1} className="bg-[#FDE8EE] rounded-2xl flex flex-col min-h-[420px] hover:shadow-sm transition-shadow overflow-hidden group">
                <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl shrink-0">
                  <Image
                    src={service.img}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl mb-3">{service.name}</h3>
                  <p className="text-[#2D1515] opacity-80 leading-[1.7] mb-8 flex-1">
                    {service.desc}
                  </p>
                  <a
                    href={`https://wa.me/1234567890?text=I'm interested in the ${service.name} service`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto bg-[#B76E79] text-white px-8 py-3 rounded-full hover:bg-[#9a5a65] transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <MessageCircle size={18} /> Inquire Flow
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
