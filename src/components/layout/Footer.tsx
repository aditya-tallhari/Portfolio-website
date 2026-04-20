'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaTwitter, FaWhatsapp } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from('.footer-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

  return (
    <footer 
      ref={containerRef}
      className="relative w-full border-t border-[var(--border-primary)] bg-[var(--bg-primary)] pt-24 pb-12 overflow-hidden transition-colors duration-700"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          
          {/* Left Side: CTA */}
          <div className="footer-item flex-1 max-w-xl">
            <h2 className="text-5xl md:text-6xl font-playfair font-black tracking-tighter leading-tight mb-8">
              Have an idea? <br />
              <span className="text-[var(--accent-primary)]">Let's Connect.</span>
            </h2>
            
            <a 
              href="mailto:contact@aditya.dev" 
              className="group inline-flex items-center gap-4 text-xl font-jetbrains font-bold hover:text-[var(--accent-primary)] transition-all"
            >
              contact@aditya.dev
              <div className="w-12 h-12 rounded-full border border-[var(--text-primary)]/20 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] group-hover:text-white transition-all">
                <ArrowUpRight size={20} />
              </div>
            </a>
          </div>

          {/* Right Side: Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Index */}
            <div className="footer-item flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 font-jetbrains">Index</span>
              <ul className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
                {['About', 'Projects', 'Experience', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-[var(--accent-primary)] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div className="footer-item flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 font-jetbrains">Socials</span>
              <ul className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
                {[
                  { name: 'Github', icon: FaGithub, href: '#' },
                  { name: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
                  { name: 'Twitter', icon: FaTwitter, href: '#' },
                  { name: 'Whatsapp', icon: FaWhatsapp, href: '#' }
                ].map((social) => (
                  <li key={social.name}>
                    <a href={social.href} className="flex items-center gap-2 hover:text-[var(--accent-primary)] transition-colors group">
                      <social.icon size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status */}
            <div className="footer-item flex flex-col gap-6 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 font-jetbrains">Presence</span>
              <p className="text-sm font-bold uppercase tracking-widest leading-relaxed opacity-60">
                Remote / <br />
                Global Execution
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-item flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[var(--text-primary)]/10 gap-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 font-jetbrains">
              © 2026 Aditya Tallhari
            </span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-[var(--accent-primary)] opacity-30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 font-jetbrains">
              Built with precision.
            </span>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:text-[var(--accent-primary)] transition-all"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full border border-[var(--text-primary)]/10 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] group-hover:text-white transition-all">
              <ArrowUpRight size={14} className="-rotate-45" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};


