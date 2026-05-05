'use client';

import React, { useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import  Hackathons from '@/components/portfolio/Hackathons';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Medal, Star } from 'lucide-react';
import { BackgroundNoise } from '@/components/layout/BackgroundEffects';
import { PageLoader } from '@/components/layout/PageLoader';
import gsap from 'gsap';

export default function WinningsPage() {
  const navRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = (tl: gsap.core.Timeline) => {
    if (navRef.current) {
      tl.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.5'
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <PageLoader onComplete={handleLoaderComplete} />
      <BackgroundNoise />
      
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50 opacity-0 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      <main className="pt-32">
        {/* Hero Section for the dedicated page */}
        <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="p-6 rounded-full bg-[var(--accent-primary)]/[0.1] border border-[var(--accent-primary)]/20 mb-8"
            >
              <Trophy size={48} className="text-[var(--accent-primary)]" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-playfair font-black uppercase tracking-tighter leading-none mb-6"
            >
              Hall of <br />
              <span className="text-[var(--accent-primary)]">Fame</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl text-lg text-[var(--text-primary)]/60 font-jetbrains uppercase tracking-widest"
            >
              A chronological archive of technical excellence, global participations, and competitive triumphs.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
            {[
              { label: "Winner", count: "04", icon: <Trophy /> },
              { label: "Finalist", count: "08", icon: <Award /> },
              { label: "Global", count: "12+", icon: <Zap /> },
              { label: "Special", count: "03", icon: <Star /> }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] flex flex-col items-center gap-4 group hover:border-[var(--accent-primary)]/40 transition-colors"
              >
                <div className="text-[var(--accent-primary)] opacity-40 group-hover:opacity-100 transition-opacity">
                  {stat.icon}
                </div>
                <div className="text-4xl font-playfair font-black">{stat.count}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reuse the Hackathons section component */}
        <Hackathons />
      </main>

      <Footer />
    </div>
  );
}
