'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/components/layout/Navbar';
import { PageLoader } from '@/components/layout/PageLoader';
import { PortfolioBody } from '@/components/portfolio/PortfolioBody';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PortfolioPage() {
  const container = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const helloTextRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const profileDestRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = (tl: gsap.core.Timeline) => {
    // Entrance animations after loader
    if (helloTextRef.current) {
      tl.fromTo(helloTextRef.current,
        { y: 100, opacity: 0, skewY: 10 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.5, ease: 'power3.out' },
        '-=0.5'
      );
    }

    if (navRef.current) {
      tl.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        '-=1.2'
      );
    }
  };

  return (
    <div 
      ref={container} 
      className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)] transition-colors duration-700"
    >
      <PageLoader onComplete={handleLoaderComplete} />

      {/* Global Navigation - Using a container that adapts to theme */}
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50 opacity-0 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      <PortfolioHero 
        ref={heroRef} 
        helloTextRef={helloTextRef} 
        profileImageRef={profileImageRef}
      />

      {/* Sections */}
      <PortfolioBody 
        profileImageRef={profileImageRef}
        profileDestRef={profileDestRef}
      />
      

      {/* Footer info/spacer */}
      <footer className="py-20 border-t border-[var(--border-primary)] bg-[var(--card-bg)] backdrop-blur-sm transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[var(--text-primary)]">
          <div className="text-[10px] font-mono tracking-widest opacity-40 uppercase">
            © 2026 Aditya Tallhari — Crafted with precision
          </div>
          <div className="flex gap-8">
            {['Back to Top', 'Source Code'].map(item => (
              <button key={item} onClick={() => item === 'Back to Top' && window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[10px] font-mono tracking-widest opacity-40 hover:opacity-100 uppercase transition-all">
                [{item}]
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
