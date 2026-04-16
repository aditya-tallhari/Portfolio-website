"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Robot = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      className={cn("relative group transition-transform hover:scale-105", className)}
    >
      <div className="bg-[#1a1a1a] border border-white/20 rounded-xl px-4 py-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
            <span className="text-[10px] font-mono font-bold text-white">BOT</span>
          </div>
          <div className="text-xs font-mono text-white/90">
            {children}
          </div>
        </div>
        {/* Robot "legs/connector" decorative line */}
        <div className="absolute -bottom-4 left-6 w-px h-4 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </motion.div>
  );
};
