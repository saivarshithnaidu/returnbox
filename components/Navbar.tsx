'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import CartDrawer from './ui/CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore(s => s.getItemCount());
  const wishlistCount = useWishlistStore(s => s.getCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Custom Orders', href: '/custom-orders' },
    { name: 'Bulk Orders', href: '/bulk-orders' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-[#F2A7B8]/20 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl md:text-3xl font-bold text-[#B76E79] flex items-center gap-2 group">
            Return Box <span className="group-hover:scale-110 transition-transform">🎀</span>
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <Link key={l.name} href={l.href} className="text-[#2D1515] font-sans text-sm hover:text-[#B76E79] transition-colors relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1px] after:bg-[#B76E79] hover:after:w-full after:transition-all">{l.name}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/track" className="hidden lg:flex text-[#2D1515] hover:text-[#B76E79] transition-colors font-sans text-sm">Track Order</Link>
            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-[#2D1515] hover:text-[#B76E79] transition-colors p-2" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B76E79] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-[#2D1515] hover:text-[#B76E79] transition-colors p-2" aria-label="Open cart">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B76E79] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{itemCount}</span>
              )}
            </button>
            <button className="lg:hidden text-[#2D1515] hover:text-[#B76E79] transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#F2A7B8]/20 lg:hidden">
              <div className="flex flex-col items-center py-6 space-y-4">
                {links.map(l => (
                  <Link key={l.name} href={l.href} onClick={() => setMobileOpen(false)} className="font-serif text-xl text-[#2D1515] hover:text-[#B76E79] transition-colors">{l.name}</Link>
                ))}
                <Link href="/track" onClick={() => setMobileOpen(false)} className="font-sans text-sm text-[#8B5E5E]">Track Order</Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="font-sans text-sm text-[#8B5E5E] flex items-center gap-1.5">
                  <Heart size={14} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link href="/find-your-scent" onClick={() => setMobileOpen(false)} className="font-sans text-sm text-[#B76E79] font-medium">✨ Find Your Scent</Link>
                <Link href="/products" onClick={() => setMobileOpen(false)} className="bg-[#B76E79] text-white px-8 py-3 rounded-full font-sans font-medium">Shop Now</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
