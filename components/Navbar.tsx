"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scroll to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/#products" },
    { name: "Custom Orders", href: "/#custom-orders" },
    { name: "Gallery", href: "/#gallery" },
    { name: "About", href: "/about" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-[#F2A7B8]/20 py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-serif text-2xl md:text-3xl font-bold text-[#B76E79] flex items-center gap-2 group">
          Return Box <span className="group-hover:scale-110 transition-transform">🎀</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-[#2D1515] font-sans hover:text-[#B76E79] transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1px] after:bg-[#B76E79] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden lg:block">
           <Link 
             href="/#order" 
             className="bg-[#B76E79] text-white px-8 py-3 rounded-full hover:bg-[#9a5a65] transition-all font-sans"
           >
             Order Now
           </Link>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <button 
          className="lg:hidden text-[#2D1515] hover:text-[#B76E79] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-[#FFF8F3]/95 backdrop-blur-xl border-b border-[#F2A7B8]/20 lg:hidden"
          >
            <div className="flex flex-col items-center py-8 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl text-[#2D1515] hover:text-[#B76E79] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 w-full px-12">
                 <Link 
                   href="/#order"
                   onClick={() => setMobileOpen(false)}
                   className="block text-center bg-[#B76E79] text-white w-full px-8 py-4 rounded-full hover:bg-[#9a5a65] transition-all font-sans text-lg"
                 >
                   Order Now
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
