'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Globe, Mail } from 'lucide-react';
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaTwitter, 
  FaWhatsapp, 
  FaInstagram,
  FaDiscord
} from 'react-icons/fa';
import { SiLeetcode, SiCodeforces } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useGSAP(() => {
    if (!footerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    tl.fromTo('.footer-reveal-item', 
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );

    gsap.to('.footer-bg-text', {
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
      x: -150,
      opacity: 0.1,
    });

  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef}
      className="relative w-full min-h-screen bg-[var(--bg-primary)] flex flex-col justify-between overflow-hidden border-t border-[var(--border-primary)]"
    >
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="footer-bg-text absolute top-1/2 left-1/2 -translate-y-1/2 text-[30vw] font-jetbrains font-black opacity-[0.02] dark:opacity-[0.015] whitespace-nowrap leading-none tracking-tighter">
          ADITYA TALLHARI
        </div>
        
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%">
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#footer-grid)" />
          </svg>
        </div>
      </div>

      {/* ── TOP SECTION: BIG CTA ── */}
      <div className="relative z-10 w-full pt-48 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="footer-reveal-item mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[var(--accent-primary)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[var(--accent-primary)] font-jetbrains">Project Initialization</span>
            </div>
            
            <h2 className="text-6xl md:text-[8rem] font-playfair font-black tracking-tighter leading-[0.85] uppercase mb-8">
              Ready to <br />
              <span className="text-[var(--accent-primary)]">Scale?</span>
            </h2>

            <div className="flex flex-wrap items-center gap-8 md:gap-16">
              <a 
                href="mailto:contact@aditya.dev" 
                className="group flex flex-col gap-2 relative transition-all duration-300"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 font-jetbrains group-hover:text-[var(--accent-primary)] group-hover:opacity-100 transition-all">Drop an transmission</span>
                <div className="flex items-center gap-6">
                  <span className="text-2xl md:text-4xl font-jetbrains font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                    contact@aditya.dev
                  </span>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[var(--text-primary)]/10 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION: NAVIGATION ── */}
      <div className="relative z-10 w-full py-10 px-8 md:px-16 lg:px-24 pb-0 pt-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
          <div className="footer-reveal-item space-y-8">
             <div className="text-2xl font-playfair font-black tracking-widest border-b-2 border-[var(--accent-primary)] w-fit pb-1">AT.</div>
             <p className="text-sm text-[var(--text-primary)] opacity-40 leading-relaxed font-jetbrains max-w-[280px]">
                Engineering high-performance digital experiences through sophisticated design and optimized codebases.
             </p>
          </div>

          <div className="footer-reveal-item space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-20 font-jetbrains">Navigation</span>
            <ul className="grid grid-cols-1 gap-4">
               {['About', 'Projects', 'Experience', 'CP', 'Contact'].map(item => (
                 <li key={item}>
                   <Link href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 flex items-center gap-2 group/nav">
                      <span className="w-0 group-hover/nav:w-4 h-[1px] bg-[var(--accent-primary)] transition-all duration-300" />
                      {item}
                   </Link>
                 </li>
               ))}
            </ul>
          </div>

          <div className="footer-reveal-item space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-20 font-jetbrains">Connected</span>
            <ul className="grid grid-cols-1 gap-5">
               {[
                 { name: 'Github', icon: FaGithub, href: 'https://github.com/adityatallhari' },
                 { name: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
                 { name: 'Twitter', icon: FaTwitter, href: '#' },
                 { name: 'Whatsapp', icon: FaWhatsapp, href: '#' }
               ].map(social => (
                 <li key={social.name}>
                   <a href={social.href} className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 flex items-center gap-4 group/soc">
                      <social.icon size={18} className="opacity-20 group-hover/soc:opacity-100 group-hover/soc:text-[var(--accent-primary)] transition-all duration-300" />
                      {social.name}
                   </a>
                 </li>
               ))}
            </ul>
          </div>

          <div className="footer-reveal-item space-y-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-20 font-jetbrains">Presence</span>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-[var(--accent-primary)]" />
                <span className="text-sm font-bold tracking-widest text-[var(--text-primary)] uppercase">Remote / Global</span>
              </div>

              <p className="text-[10px] font-jetbrains font-bold uppercase leading-relaxed tracking-widest opacity-30 max-w-[200px]">
                Available for worldwide synchronization and deployment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: UTILS ── */}
      <div className="relative z-10 w-full py-10 px-8 md:px-16 lg:px-24 border-t border-[var(--text-primary)]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 font-jetbrains">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black opacity-20 uppercase tracking-[0.2em]">Crafted By</span>
              <span className="text-[11px] font-bold tracking-widest uppercase">Aditya Tallhari © 2026</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black opacity-20 uppercase tracking-[0.2em]">Build Protocol</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--accent-primary)]">Next.js // GSAP</span>
            </div>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full border border-[var(--text-primary)]/10 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] group-hover:text-white transition-all transform group-hover:-translate-y-2">
              <ArrowUpRight size={18} className="-rotate-45" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--accent-primary)] transition-all">Back to apex</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
