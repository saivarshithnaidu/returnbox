'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Baby, Building2, PartyPopper, Sparkles, Calendar, Upload, Loader2, CheckCircle, Camera } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const OCCASIONS = [
  { name: 'Wedding Return Gifts', icon: Heart, price: 'From ₹150/piece', color: 'bg-pink-50 text-pink-600', image: '/lotus-candle.png' },
  { name: 'Baby Shower Favours', icon: Baby, price: 'From ₹100/piece', color: 'bg-blue-50 text-blue-600', image: '/sunflower-candle.png' },
  { name: 'Birthday Party Gifts', icon: PartyPopper, price: 'From ₹120/piece', color: 'bg-amber-50 text-amber-600', image: '/custom-hamper.png' },
  { name: 'Corporate Gifting', icon: Building2, price: 'From ₹200/piece', color: 'bg-emerald-50 text-emerald-600', image: '/lotus-candle.png' },
  { name: 'Festival Hampers', icon: Sparkles, price: 'From ₹180/piece', color: 'bg-purple-50 text-purple-600', image: '/sunflower-candle.png' },
];

const BUDGETS = ['Under ₹150', '₹150 - ₹300', '₹300 - ₹500', '₹500 - ₹1000', 'Above ₹1000'];

export default function BulkOrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    contact_name: '', whatsapp_number: '', email: '',
    occasion_type: '', event_date: '', quantity: 20,
    budget_range: '', preferred_products: [] as string[],
    color_preferences: '', personalization_notes: '', additional_notes: '',
  });

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {});
  }, []);

  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'bulk-orders');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) setReferenceImages(prev => [...prev, data.url]);
      } catch { }
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_name || !form.whatsapp_number || !form.occasion_type || form.quantity < 20) {
      toast.error('Please fill all required fields (min 20 pieces)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bulk-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, reference_images: referenceImages }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success('Enquiry submitted successfully!');
      }
    } catch { toast.error('Failed to submit'); }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle size={64} className="text-green-500 mb-6" />
        <h1 className="font-serif text-3xl text-[#3D1C1C] mb-3">Enquiry Received! 🎁</h1>
        <p className="font-sans text-[#8B5E5E] max-w-md mb-2">Thank you for your interest in our bulk order service.</p>
        <p className="font-sans text-[#B76E79] font-medium">Our team will contact you within 2 hours with a custom quote.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-28 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-16 py-16 bg-gradient-to-b from-[#3D1C1C] to-[#1A0F0F] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#B76E79] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F4B8C1] rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto relative z-10">
          <Gift size={48} className="mx-auto mb-4 text-[#F4B8C1]" />
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Planning a Wedding or Event?</h1>
          <p className="font-sans text-lg text-[#F4B8C1] max-w-xl mx-auto">
            We create custom return gift sets for weddings, baby showers, corporate events, and festivals. Minimum 20 pieces.
          </p>
        </motion.div>
      </section>

      {/* Occasion Cards */}
      <section className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl text-[#3D1C1C] text-center mb-10">Choose Your Occasion</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {OCCASIONS.map((occ, i) => {
            const Icon = occ.icon;
            const isSelected = form.occasion_type === occ.name;
            return (
              <motion.button
                key={occ.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => u('occasion_type', occ.name)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${isSelected ? 'border-[#B76E79] bg-[#B76E79]/5 shadow-lg' : 'border-[#F4B8C1]/20 bg-white hover:border-[#F4B8C1]/60'}`}
              >
                <div className={`w-12 h-12 rounded-xl ${occ.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} />
                </div>
                <p className="font-sans text-sm font-medium text-[#3D1C1C]">{occ.name}</p>
                <p className="font-sans text-xs text-[#8B5E5E] mt-1">{occ.price}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Bulk Order Form */}
      <section className="px-6 md:px-16 pb-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#F4B8C1]/15 shadow-sm">
          <h2 className="font-serif text-2xl text-[#3D1C1C] mb-6">Tell Us About Your Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Contact Name *" value={form.contact_name} onChange={e => u('contact_name', e.target.value)} required />
              <input className={inputCls} placeholder="WhatsApp Number *" type="tel" value={form.whatsapp_number} onChange={e => u('whatsapp_number', e.target.value)} required />
            </div>
            <input className={inputCls} placeholder="Email Address" type="email" value={form.email} onChange={e => u('email', e.target.value)} />
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Event Date</label>
                <input className={inputCls} type="date" value={form.event_date} onChange={e => u('event_date', e.target.value)} />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Quantity Needed (min 20)</label>
                <input className={inputCls} type="number" min={20} value={form.quantity} onChange={e => u('quantity', parseInt(e.target.value) || 20)} />
              </div>
            </div>

            <div>
              <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Budget Per Piece</label>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(b => (
                  <button key={b} type="button" onClick={() => u('budget_range', b)}
                    className={`px-4 py-2 rounded-full font-sans text-xs font-medium transition-all ${form.budget_range === b ? 'bg-[#B76E79] text-white' : 'bg-[#FFF8F0] text-[#8B5E5E] hover:bg-[#F4B8C1]/20'}`}
                  >{b}</button>
                ))}
              </div>
            </div>

            {products.length > 0 && (
              <div>
                <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Preferred Products (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {products.filter((p: any) => p.is_active).slice(0, 10).map((p: any) => {
                    const selected = form.preferred_products.includes(p.id);
                    return (
                      <button key={p.id} type="button"
                        onClick={() => u('preferred_products', selected ? form.preferred_products.filter((id: string) => id !== p.id) : [...form.preferred_products, p.id])}
                        className={`px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all ${selected ? 'bg-[#B76E79] text-white' : 'bg-[#FFF8F0] text-[#8B5E5E] hover:bg-[#F4B8C1]/20'}`}
                      >{p.name}</button>
                    );
                  })}
                </div>
              </div>
            )}

            <input className={inputCls} placeholder="Color Preferences (e.g. pastel pink, gold)" value={form.color_preferences || ''} onChange={e => u('color_preferences', e.target.value)} />
            <input className={inputCls} placeholder="Personalization (e.g. name, date on product)" value={form.personalization_notes || ''} onChange={e => u('personalization_notes', e.target.value)} />

            <div>
              <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Reference Images (optional)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {referenceImages.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#F4B8C1]/30">
                    <Image src={url} alt={`Ref ${i+1}`} fill className="object-cover" sizes="64px" />
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#F4B8C1]/50 cursor-pointer hover:bg-[#FFF8F0] transition-colors">
                {uploading ? <Loader2 size={16} className="animate-spin text-[#B76E79]" /> : <Camera size={16} className="text-[#B76E79]" />}
                <span className="font-sans text-sm text-[#8B5E5E]">{uploading ? 'Uploading...' : 'Upload reference images'}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Additional notes..." value={form.additional_notes || ''} onChange={e => u('additional_notes', e.target.value)} />

            <button type="submit" disabled={loading} className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-lg">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Gift size={18} />}
              Get Custom Quote
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
