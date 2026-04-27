'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const imgs = images.length > 0 ? images : ['/lotus-candle.png'];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8F0] border border-[#F4B8C1]/20 group">
        <Image src={imgs[active]} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 100vw,50vw" priority />
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === active ? 'border-[#B76E79]' : 'border-transparent hover:border-[#F4B8C1]'}`}>
              <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
