'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/layout/PageLoader';
import { PortfolioBody } from '@/components/portfolio/PortfolioBody';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import dynamic from 'next/dynamic';

// Lazy load the chat component to avoid initial bundle size impact
const AIChatbot = dynamic(() => import('@/components/portfolio/AIChatbot').then(m => m.AIChatbot), { 
  ssr: false 
});

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

      <div className="portfolio-content">
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
        
        <Footer />
      </div>

      <AIChatbot />
    </div>
  );
}
