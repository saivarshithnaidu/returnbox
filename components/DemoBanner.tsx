"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#3D1C1C] text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-sans z-40 relative">
      <div className="flex-1 flex items-center justify-center gap-2">
        <Info size={16} className="text-[#F4B8C1]" />
        <span>
          This is a demo site by GrowX Labs. We can build this for your brand in 7 days.
        </span>
        <a 
          href="https://growxlabs.tech" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 font-bold text-[#F4B8C1] hover:text-[#FFF8F0] underline decoration-[#F4B8C1]/50 underline-offset-4 transition-colors hidden sm:inline"
        >
          [Get Your Website]
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-white/60 hover:text-white transition-colors ml-4 shrink-0"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
