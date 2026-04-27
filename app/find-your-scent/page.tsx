'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RotateCcw, ShoppingCart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const STEPS = [
  {
    question: "How do you want to feel?",
    options: [
      { label: 'Calm and Peaceful', emoji: '🌿', value: 'calm' },
      { label: 'Romantic and Warm', emoji: '🌹', value: 'romantic' },
      { label: 'Fresh and Energetic', emoji: '🌊', value: 'fresh' },
      { label: 'Cozy and Nostalgic', emoji: '🍂', value: 'cozy' },
      { label: 'Spiritual and Focused', emoji: '🪔', value: 'spiritual' },
    ],
  },
  {
    question: "Which memory feels most comforting?",
    options: [
      { label: 'Rain on a quiet afternoon', emoji: '🌧️', value: 'rain' },
      { label: "Grandmother's kitchen", emoji: '🍳', value: 'kitchen' },
      { label: 'Temple flowers at dawn', emoji: '🌺', value: 'temple' },
      { label: 'Ocean breeze at sunset', emoji: '🌅', value: 'ocean' },
      { label: 'Forest after rainfall', emoji: '🌲', value: 'forest' },
    ],
  },
  {
    question: "Where will this candle live?",
    options: [
      { label: 'Bedroom for sleep', emoji: '🛏️', value: 'bedroom' },
      { label: 'Living room for guests', emoji: '🛋️', value: 'living' },
      { label: 'Meditation space', emoji: '🧘', value: 'meditation' },
      { label: 'Office desk', emoji: '💼', value: 'office' },
      { label: 'As a gift for someone special', emoji: '🎁', value: 'gift' },
    ],
  },
];

interface MatchResult {
  product_name: string;
  match_reason: string;
  match_percentage: number;
  secondary_reason: string;
  product?: any;
  secondary_product?: any;
}

export default function FindYourScentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const addItem = useCartStore(s => s.addItem);

  const handleSelect = async (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < 2) {
      setStep(step + 1);
    } else {
      // Final step — get AI match
      setLoading(true);
      try {
        const res = await fetch('/api/ai/fragrance-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood: newAnswers[0], memory: newAnswers[1], space: newAnswers[2] }),
        });
        const data = await res.json();
        setResult(data);
      } catch {
        // Fallback result
        setResult({
          product_name: 'Lotus Candle',
          match_reason: 'The gentle floral notes of lotus bring a sense of serenity, perfectly matching your desire for peace.',
          match_percentage: 92,
          secondary_reason: 'An alternative that brings warmth and comfort.',
        });
      }
      setLoading(false);
      setStep(3);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAddToCart = (product: any) => {
    if (!product) return;
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price || undefined,
      quantity: 1,
      image: product.images?.[0] || '/lotus-candle.png',
      stock_count: product.stock_count,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#F4E8E0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#B76E79]/10 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} className="text-[#B76E79]" />
            <span className="font-sans text-sm font-medium text-[#B76E79]">Scent Quiz</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#3D1C1C] mb-3">Find Your Perfect Scent</h1>
          <p className="font-sans text-[#8B5E5E] text-lg">Answer 3 quick questions and we&apos;ll match you with your ideal candle</p>
        </motion.div>

        {/* Progress bar */}
        {step < 3 && (
          <div className="flex gap-2 mb-10">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-[#F4B8C1]/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#B76E79] to-[#D4849D] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-[#B76E79]/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-[#B76E79]/10 rounded-full flex items-center justify-center">
                <Sparkles size={32} className="text-[#B76E79] animate-pulse" />
              </div>
            </div>
            <p className="font-serif text-xl text-[#3D1C1C] mb-2">Finding your perfect match...</p>
            <p className="font-sans text-sm text-[#8B5E5E]">Our scent AI is analyzing your preferences</p>
          </motion.div>
        )}

        {/* Quiz steps */}
        <AnimatePresence mode="wait">
          {!loading && step < 3 && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-sans text-xs text-[#B76E79] font-bold uppercase tracking-widest mb-3">Step {step + 1} of 3</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#3D1C1C] mb-8">{STEPS[step].question}</h2>
              <div className="space-y-3">
                {STEPS[step].options.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#F4B8C1]/20 hover:border-[#B76E79] hover:shadow-[0_4px_20px_rgba(183,110,121,0.1)] transition-all group text-left"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
                    <span className="font-sans text-[#3D1C1C] font-medium flex-1">{opt.label}</span>
                    <ChevronRight size={18} className="text-[#D4A0A8] group-hover:text-[#B76E79] group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!loading && step === 3 && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl text-[#3D1C1C] mb-4">Your Perfect Scent Match</h2>

              {/* Match percentage circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#F4B8C1" strokeWidth="4" opacity="0.3" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - (result.match_percentage || 90) / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B76E79" />
                      <stop offset="100%" stopColor="#D4849D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-sans text-2xl font-bold text-[#3D1C1C]">{result.match_percentage || 90}%</span>
                </div>
              </div>
            </div>

            {/* Primary match */}
            <div className="bg-white rounded-2xl p-6 border border-[#F4B8C1]/20 shadow-lg">
              {result.product && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4">
                  <Image src={result.product.images?.[0] || '/lotus-candle.png'} alt={result.product.name} fill className="object-cover" sizes="600px" />
                </div>
              )}
              <h3 className="font-serif text-2xl text-[#3D1C1C] mb-2">{result.product?.name || result.product_name}</h3>
              <p className="font-sans text-[#8B5E5E] italic mb-4">{result.match_reason}</p>
              {result.product && (
                <div className="flex items-center gap-4">
                  <span className="font-sans font-bold text-xl text-[#3D1C1C]">{formatPrice(result.product.sale_price || result.product.price)}</span>
                  <button onClick={() => handleAddToCart(result.product)} className="flex-1 bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Secondary match */}
            {result.secondary_product && (
              <div className="bg-white/70 rounded-2xl p-5 border border-[#F4B8C1]/15">
                <p className="font-sans text-xs text-[#8B5E5E] uppercase tracking-widest font-bold mb-3">Also a great match</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={result.secondary_product.images?.[0] || '/lotus-candle.png'} alt={result.secondary_product.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-[#3D1C1C]">{result.secondary_product.name}</h4>
                    <p className="font-sans text-xs text-[#8B5E5E]">{result.secondary_reason}</p>
                  </div>
                  <button onClick={() => handleAddToCart(result.secondary_product)} className="p-2 bg-[#FFF8F0] text-[#B76E79] rounded-xl hover:bg-[#B76E79] hover:text-white transition-all">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button onClick={resetQuiz} className="flex items-center gap-2 border-2 border-[#B76E79] text-[#B76E79] px-6 py-3 rounded-full font-sans text-sm font-medium hover:bg-[#B76E79] hover:text-white transition-all">
                <RotateCcw size={14} /> Retake Quiz
              </button>
              <Link href="/products" className="flex items-center gap-2 bg-[#3D1C1C] text-white px-6 py-3 rounded-full font-sans text-sm font-medium hover:bg-[#2D1515] transition-colors">
                Browse All Products
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
