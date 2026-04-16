"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  children: React.ReactNode;
  id?: string;
  text: string;
  className?: string;
}

export default function SectionHeading({ children, id, text, className }: SectionHeadingProps) {
  return (
    <section id={id} className={cn("relative py-24", className)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10 mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-16">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-4"
          >
            {`// ${text.toUpperCase()}`}
          </motion.h2>
          <div className="w-12 h-px bg-indigo-500/50" />
        </div>
        
        {children}
      </div>
    </section>
  );
}
