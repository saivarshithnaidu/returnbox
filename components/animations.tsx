"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  staggerChildren?: boolean;
}

export const FadeIn = ({ children, delay = 0, className = "", staggerChildren = false }: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        staggerChildren: staggerChildren ? 0.1 : undefined
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInItem = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const TypingText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <motion.h1 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export const RosePetals = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-[#F4B8C1]/30 rounded-full blur-[2px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};
