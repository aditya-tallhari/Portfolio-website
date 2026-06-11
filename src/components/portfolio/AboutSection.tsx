'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  profileDestRef?: React.RefObject<HTMLDivElement | null>;
}

export const AboutSection = ({ profileDestRef }: AboutSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Large ABOUT Entrance (Now uses variable opacity)
    gsap.from('.about-bg-text', {
      opacity: 0,
      x: -100,
      duration: 2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    // 2. Headline Stagger
    gsap.from('.headline-part', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 85%',
      }
    });

    // 3. Wide Card Slide
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 90%',
      }
    });

    // 4. Phone Mockup
    gsap.from(phoneRef.current, {
      x: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: phoneRef.current,
        start: 'top 80%',
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pt-12 pb-24 px-6 sm:px-8 md:px-16 overflow-hidden transition-colors duration-1000"
    >
      {/* ── Background Typography ── */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 z-0">
        <h2 className="about-bg-text text-[25vw] font-black tracking-tighter opacity-[0.05] select-none pointer-events-none uppercase font-playfair transition-opacity duration-500">
          About
        </h2>
      </div>
 
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-20 items-center">
          
          {/* ── Left Column: Condensed Narrative ── */}
          <div className="flex flex-col space-y-8 md:space-y-12">
            <div ref={headlineRef} className="space-y-3 md:space-y-4">
               <h3 className="headline-part text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-[var(--accent-primary)] opacity-60">
                  Mission / Identity
               </h3>
               <h2 className="headline-part text-5xl sm:text-6xl md:text-8xl font-playfair font-black tracking-tighter leading-tight">
                  About Me.
               </h2>
            </div>
 
            {/* Condensed Bio Card (Borderless, dynamic layout) */}
            <div 
              ref={cardRef}
              className="relative z-10 font-jetbrains w-full lg:max-w-2xl transition-all duration-500 pl-6 border-l-2 border-[var(--accent-primary)] space-y-6 md:space-y-8 py-2"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-primary)] opacity-90 leading-relaxed">
                I thrive on the intersection of <span className="text-[var(--accent-primary)] font-bold">Design</span> & 
                <span className="text-[var(--accent-primary)] font-bold"> Engineering</span>. 
                My goal is to create products that are as functional as they are beautiful.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[var(--text-primary)] opacity-60 leading-relaxed">
                With expertise in Next.js and high-end motion design, I transform complex technical 
                requirements into seamless user journeys. My approach is defined by precision, 
                performance, and an uncompromising commitment to aesthetic excellence.
              </p>
            </div>
          </div>
 
          {/* ── Right Column: Expanded Identity Card (Shadcn-Style Developer Card) ── */}
          <div ref={phoneRef} className="flex justify-center lg:justify-end mt-8 lg:mt-0 z-20">
            <div className="relative w-[280px] h-[480px] sm:w-[380px] sm:h-[620px] bg-[var(--bg-secondary)]/30 backdrop-blur-md rounded-3xl border border-[var(--border-primary)] shadow-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02] flex flex-col">
              
              {/* Profile Area - Top of Card */}
              <div className="relative w-full h-[60%] flex items-center justify-center p-6 sm:p-8 pb-2 sm:pb-3">
                <div ref={profileDestRef} className="relative w-full h-full overflow-hidden flex items-center justify-center">
                   <Image 
                     src="/profile.svg" 
                     alt="Aditya" 
                     fill 
                     sizes="(max-width: 768px) 100vw, 400px"
                     className="object-contain object-bottom grayscale hover:grayscale-0 transition-all duration-1000 opacity-0"
                   />
                </div>
              </div>
 
              {/* Identity Detail - Bottom of Card */}
              <div className="p-6 sm:p-8 pt-3 sm:pt-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-[var(--text-primary)] uppercase font-sans">
                    Aditya Tallhari
                  </h3>
                  <p className="text-[9px] text-[var(--text-secondary)] tracking-widest font-jetbrains mt-0.5 uppercase">
                    // CREATIVE DEVELOPER
                  </p>
                </div>
 
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-[var(--text-primary)]/[0.04] px-2.5 py-1 rounded-full border border-[var(--border-primary)] self-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-[var(--text-primary)] uppercase tracking-wider font-jetbrains">Operational</span>
                    </div>
                    <div className="bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-primary)]/20 self-start">
                      <span className="text-[8px] font-bold text-[var(--accent-primary)] uppercase tracking-wider font-jetbrains text-nowrap">Full-Stack Architecture</span>
                    </div>
                  </div>
 
                  <div className="border-t border-[var(--border-primary)] pt-3">
                    <div className="grid grid-cols-2 gap-4 font-jetbrains text-[9px] text-[var(--text-secondary)] uppercase">
                      <div>
                        <span className="block opacity-40 text-[7px] tracking-widest">Specialty</span>
                        <span className="font-bold text-[var(--text-primary)]">Scalable Development</span>
                      </div>
                      <div>
                        <span className="block opacity-40 text-[7px] tracking-widest">Focus</span>
                        <span className="font-bold text-[var(--text-primary)]">Frontend & Backend Arch </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
};
