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

  const handleLoaderComplete = () => {
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" }});

    // Entrance animations after loader
    if (navRef.current) {
      heroTl.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    }

    const scope = heroRef.current;
    if (scope) {
      // Animate profile container
      heroTl.fromTo(scope.querySelector('.hero-profile-container'), 
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5 },
        '-=0.8'
      );

      // Animate text stack elements one after another
      heroTl.fromTo(scope.querySelectorAll('.hero-animate-el'),
        { opacity: 0, y: 40, skewY: 2 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.15 },
        "-=1.2"
      );

      // Animate stats cards staggered
      heroTl.fromTo(scope.querySelectorAll('.hero-stat-card'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
        "-=0.8"
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
