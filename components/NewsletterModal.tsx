"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after 10 seconds if not previously closed
    if (!localStorage.getItem("newsletterClosed")) {
      const timer = setTimeout(() => setIsOpen(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterClosed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl text-center overflow-hidden border border-[#F4B8C1]/30"
          >
            {/* Background petal decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B8C1] rounded-bl-full opacity-10 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#B76E79] rounded-tr-full opacity-10 mix-blend-multiply" />

            <button 
              onClick={close}
              className="absolute top-4 right-4 text-[#8B5E5E] hover:text-[#3D1C1C] transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mx-auto w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B76E79] mb-6">
              <Gift size={32} />
            </div>

            <h2 className="font-serif text-3xl text-[#3D1C1C] mb-3">Welcome to Return Box</h2>
            <p className="font-sans text-[#8B5E5E] mb-8 leading-relaxed">
              Get <span className="font-bold text-[#B76E79]">10% off</span> your first order — leave your WhatsApp number and we'll send you a secret discount code.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); close(); }} className="space-y-4">
              <input
                type="tel"
                placeholder="WhatsApp Number"
                required
                className="w-full px-5 py-4 rounded-xl border border-[#F4B8C1]/30 bg-[#FFF8F0]/50 placeholder:text-[#8B5E5E]/60 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] transition-all font-sans text-[#3D1C1C]"
              />
              <button
                type="submit"
                className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-sans font-medium hover:bg-[#3D1C1C] transition-colors shadow-sm"
              >
                Claim My Discount
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
