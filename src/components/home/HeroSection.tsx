'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[var(--bg-primary)]">
      {/* Decorative Grid Background Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--text-primary)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Modern Live Status Chip */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[var(--text-primary)]/[0.03] border border-[var(--border-primary)] rounded-full text-[10px] font-bold tracking-widest text-[var(--accent-primary)] font-jetbrains mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span>STATUS: ONLINE</span>
        </motion.div>

        {/* Head Title with clean typography */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight leading-none text-[var(--text-primary)]"
        >
          <span>&gt; </span>
          <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--text-primary)] bg-clip-text text-transparent">
            ADITYA
          </span>
          <span className="inline-block w-[8px] h-[0.85em] bg-[var(--accent-primary)] ml-2 align-middle animate-blink" />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-[var(--text-secondary)] font-jetbrains max-w-2xl mx-auto mb-10 opacity-80"
        >
          Full Stack Developer <span className="text-[var(--accent-primary)]">||</span> Computer Engineering Student
        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="px-8 py-3.5 bg-[var(--text-primary)] hover:bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md">
            View Projects
          </button>
          <button className="px-8 py-3.5 border border-[var(--border-primary)] hover:border-[var(--text-primary)] text-[var(--text-primary)] font-bold rounded-xl hover:bg-[var(--text-primary)]/[0.02] transition-all duration-300 transform active:scale-95 uppercase tracking-wider text-[11px] font-jetbrains">
            Contact Me
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
