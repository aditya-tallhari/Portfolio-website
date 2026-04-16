'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-blue)] bg-clip-text text-transparent">
            {"> ADITYA "}
          </span>
          <span className="cursor-blink" />
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium max-w-2xl mx-auto mb-10"
        >
          Full Stack Developer | Computer Engineering Student
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-cyan)] text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,102,255,0.4)]">
            View Projects
          </button>
          <button className="px-8 py-3 border border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)] font-bold rounded-lg hover:bg-[var(--color-accent-cyan)] hover:text-white transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm">
            Contact Me
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
