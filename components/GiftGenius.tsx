'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, RotateCcw, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: any[];
}

export default function GiftGenius() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    const saved = sessionStorage.getItem('gift-genius-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0) sessionStorage.setItem('gift-genius-messages', JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/gift-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Sorry, I couldn\'t process that. Please try again!', products: data.products }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting. Please try again in a moment!' }]);
    }
    setLoading(false);
  };

  const resetChat = () => { setMessages([]); sessionStorage.removeItem('gift-genius-messages'); };

  const handleAddToCart = (product: any) => {
    addItem({ product_id: product.id, name: product.name, slug: product.slug, price: product.price, sale_price: product.sale_price || undefined, quantity: 1, image: product.images?.[0] || '/lotus-candle.png', stock_count: product.stock_count });
    toast.success(`${product.name} added to cart!`);
  };

  const initialMsg = "Hi! I'm your personal gift assistant. Tell me about the occasion, the person you're gifting, and your budget — I'll find the perfect match from our handmade collection! 🕯️";

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-[#B76E79] to-[#D4849D] text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 font-sans text-sm font-medium"
          >
            <Sparkles size={18} /> Gift Help ✨
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-[#F4B8C1]/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B76E79] to-[#D4849D] text-white p-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg flex items-center gap-2">Gift Genius 🎁</h3>
                <p className="font-sans text-xs text-white/80">I&apos;ll find the perfect gift</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Start over"><RotateCcw size={14} /></button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Initial message */}
              {messages.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-[#B76E79]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Sparkles size={14} className="text-[#B76E79]" /></div>
                  <div className="bg-[#FFF8F0] rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                    <p className="font-sans text-sm text-[#3D1C1C]">{initialMsg}</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-[#B76E79]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Sparkles size={14} className="text-[#B76E79]" /></div>
                  )}
                  <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] ${msg.role === 'user' ? 'bg-[#B76E79] text-white rounded-tr-sm' : 'bg-[#FFF8F0] text-[#3D1C1C] rounded-tl-sm'}`}>
                    <p className="font-sans text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Product cards */}
              {messages.filter(m => m.products?.length).slice(-1).map((msg, mi) => (
                msg.products?.map((p: any) => (
                  <div key={`${mi}-${p.id}`} className="ml-9 bg-white rounded-xl border border-[#F4B8C1]/20 p-3 flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#FFF8F0]">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs font-medium text-[#3D1C1C] truncate">{p.name}</p>
                      <p className="font-sans text-xs text-[#B76E79] font-bold">{formatPrice(p.sale_price || p.price)}</p>
                    </div>
                    <button onClick={() => handleAddToCart(p)} className="p-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#9a5a65] transition-colors shrink-0"><ShoppingCart size={12} /></button>
                  </div>
                ))
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-[#B76E79]/10 rounded-full flex items-center justify-center shrink-0"><Sparkles size={14} className="text-[#B76E79]" /></div>
                  <div className="bg-[#FFF8F0] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1"><div className="w-2 h-2 bg-[#B76E79]/40 rounded-full animate-bounce" /><div className="w-2 h-2 bg-[#B76E79]/40 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-2 h-2 bg-[#B76E79]/40 rounded-full animate-bounce [animation-delay:0.3s]" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#F4B8C1]/20 shrink-0">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the occasion..." className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFF8F0] border border-[#F4B8C1]/20 font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]" />
                <button type="submit" disabled={loading || !input.trim()} className="p-2.5 bg-[#B76E79] text-white rounded-xl hover:bg-[#9a5a65] transition-colors disabled:opacity-40"><Send size={16} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
