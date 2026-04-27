"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'}?text=Hi Sana, I have a question about Return Box!`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 bg-[#F4B8C1] text-white p-4 rounded-full shadow-xl hover:scale-110 hover:bg-[#B76E79] transition-all flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B76E79] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B76E79]"></span>
      </span>
    </motion.a>
  );
}
