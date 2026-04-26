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
      className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16 pb-32 px-8 md:px-16 overflow-hidden transition-colors duration-1000"
    >
      {/* ── Background Typography ── */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 z-0">
        <h2 className="about-bg-text text-[25vw] font-black tracking-tighter opacity-[0.05] select-none pointer-events-none uppercase font-playfair transition-opacity duration-500">
          About
        </h2>
      </div>
 
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          
          {/* ── Left Column: Condensed Narrative ── */}
          <div className="flex flex-col space-y-12">
            <div ref={headlineRef} className="space-y-4">
               <h3 className="headline-part text-[10px] uppercase tracking-[0.6em] font-black text-[var(--accent-primary)] opacity-60">
                  Mission / Identity
               </h3>
               <h2 className="headline-part text-6xl md:text-8xl font-playfair font-black tracking-tighter leading-tight">
                  About Me.
               </h2>
            </div>
 
            {/* Condensed Bio Card */}
            <div 
              ref={cardRef}
              className="bg-[var(--text-primary)]/[0.04] backdrop-blur-3xl border border-[var(--border-primary)] rounded-3xl p-10 md:p-14 w-full lg:max-w-2xl shadow-xl relative z-10 font-jetbrains transition-all duration-500"
            >
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-[var(--text-primary)] opacity-90 leading-relaxed">
                  I thrive on the intersection of <span className="text-[var(--accent-primary)] font-bold">Design</span> & 
                  <span className="text-[var(--accent-primary)] font-bold"> Engineering</span>. 
                  My goal is to create products that are as functional as they are beautiful.
                </p>
                <p className="text-base md:text-lg text-[var(--text-primary)] opacity-60 leading-relaxed">
                  With expertise in Next.js and high-end motion design, I transform complex technical 
                  requirements into seamless user journeys. My approach is defined by precision, 
                  performance, and an uncompromising commitment to aesthetic excellence.
                </p>
              </div>
            </div>
          </div>
 
          {/* ── Right Column: Expanded Identity Card ── */}
          <div ref={phoneRef} className="flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-[300px] h-[510px] sm:w-[400px] sm:h-[680px] bg-[var(--bg-primary)] rounded-[2.5rem] sm:rounded-[3.5rem] border border-[var(--border-primary)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 scale-[0.85] sm:scale-100 origin-center lg:origin-right">
              
              {/* Profile Area (Expanded) */}
              <div className="relative w-full h-[60%] sm:h-[65%] bg-[var(--bg-primary)] brightness-[0.95]">
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1.2px, transparent 1.2px)', backgroundSize: '10px 10px' }}
                />
                <div ref={profileDestRef} className="absolute inset-6 sm:inset-8 rounded-2xl sm:rounded-3xl flex items-center justify-center bg-[var(--text-primary)]/10 overflow-hidden shadow-inner">
                   <Image 
                     src="/profile.svg" 
                     alt="Aditya" 
                     fill 
                     sizes="(max-width: 768px) 100vw, 400px"
                     className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 opacity-0"
                   />
                </div>
              </div>
 
              {/* Identity Detail (Expanded) */}
              <div className="absolute bottom-0 inset-x-0 h-[40%] sm:h-[35%] bg-[var(--text-primary)] p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-[var(--bg-primary)] uppercase">Aditya Tallhari</h3>
                </div>
 
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)] px-4 py-2 rounded-full self-start shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">Operational</span>
                  </div>
                  <div className="bg-[var(--bg-primary)]/10 px-4 py-2 rounded-full border border-[var(--bg-primary)]/10 self-start">
                    <span className="text-[9px] sm:text-[10px] font-black text-[var(--bg-primary)] opacity-50 uppercase tracking-wider text-nowrap">Full-Stack Architecture</span>
                  </div>
                </div>
              </div>
 
              {/* Bezel (Scaled) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-7 bg-[var(--bg-primary)] rounded-b-xl sm:rounded-b-2xl border-x border-b border-[var(--border-primary)] z-20" />
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
};
