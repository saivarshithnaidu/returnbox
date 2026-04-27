'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    const captured = localStorage.getItem('lead_captured');
    if (captured) {
      const capturedDate = new Date(captured);
      const daysSince = (Date.now() - capturedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('lead_captured', new Date().toISOString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('🎉 Your 10% discount code: WELCOME10', { duration: 6000 });
        localStorage.setItem('lead_captured', new Date().toISOString());
        setIsOpen(false);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl overflow-hidden border border-[#F4B8C1]/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B8C1] rounded-bl-full opacity-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#B76E79] rounded-tr-full opacity-10" />

            <button onClick={close} className="absolute top-4 right-4 text-[#8B5E5E] hover:text-[#3D1C1C] transition-colors z-10">
              <X size={22} />
            </button>

            <div className="text-center mb-6 relative z-10">
              <div className="mx-auto w-14 h-14 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#B76E79] mb-4">
                <Gift size={28} />
              </div>
              <h2 className="font-serif text-2xl text-[#3D1C1C] mb-2">Get 10% Off Your First Order</h2>
              <p className="font-sans text-sm text-[#8B5E5E] leading-relaxed">
                Join 500+ happy customers. Enter your details to unlock your discount code instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-[#FFF8F0]/50 placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] font-sans text-[#3D1C1C] text-sm" />
              <input type="tel" placeholder="WhatsApp Number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-[#FFF8F0]/50 placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] font-sans text-[#3D1C1C] text-sm" />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-[#FFF8F0]/50 placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] font-sans text-[#3D1C1C] text-sm" />
              <button type="submit" disabled={loading}
                className="w-full bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                Get My 10% Off →
              </button>
            </form>

            <button onClick={close} className="block mx-auto mt-4 text-xs text-[#8B5E5E]/60 hover:text-[#8B5E5E] transition-colors font-sans">
              No thanks, I&apos;ll pay full price
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
