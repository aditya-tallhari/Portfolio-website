"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => {
  return (
    <div className={cn("w-full h-full bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10", className)}>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <div className="ml-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          zsh — contact
        </div>
      </div>
      <div className="p-6 overflow-y-auto space-y-4">
        {children}
      </div>
    </div>
  );
};

interface TypingAnimationProps {
  children: string;
  duration?: number;
  startOnView?: boolean;
}

export const TypingAnimation = ({ children, duration = 26, startOnView = true }: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + children[index]);
      index++;
      if (index === children.length) {
        clearInterval(interval);
        setComplete(true);
      }
    }, duration);
    return () => clearInterval(interval);
  }, [children, duration]);

  return (
    <span className="font-mono">
      {displayedText}
      {!complete && <span className="animate-pulse bg-emerald-400 ml-1">_</span>}
    </span>
  );
};

export const AnimatedSpan = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
