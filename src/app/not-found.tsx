"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex flex-col justify-center items-center font-jetbrains selection:bg-[var(--accent-primary)] selection:text-white">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] font-playfair lowercase tracking-tighter mb-4">
          404: not found
        </h1>
        <p className="text-[var(--text-secondary)] text-[10px] tracking-[0.3em] uppercase mb-12 opacity-50">
          The requested system path does not exist
        </p>
      </div>

      <Link 
        href="/" 
        className="px-6 py-2 border border-[var(--text-primary)]/10 hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase"
      >
        Back to System
      </Link>
    </div>
  );
}


