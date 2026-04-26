'use client';

import React, { forwardRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa6";
import { motion, useMotionValue as motionValue, useSpring, useTransform } from "framer-motion";
import { recordVisitor, fetchPublicStats, PublicStats } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioHeroProps {
  helloTextRef: React.RefObject<HTMLHeadingElement | null>;
  profileImageRef?: React.RefObject<HTMLDivElement | null>;
}

export const PortfolioHero = forwardRef<HTMLDivElement, PortfolioHeroProps>(
      ({ helloTextRef, profileImageRef }, ref) => {
    const [stats, setStats] = React.useState<PublicStats | null>(null);

    // ── Visitor Recording & Stats Fetching ──
    React.useEffect(() => {
      const init = async () => {
        try {
          // Record visitor if not already recorded this session
          const hasVisited = sessionStorage.getItem('v');
          if (!hasVisited) {
            await recordVisitor();
            sessionStorage.setItem('v', '1');
          }
          // Fetch stats
          const data = await fetchPublicStats();
          setStats(data);
        } catch (err) {
          console.error("Failed to initialize hero stats:", err);
        }
      };
      init();
    }, []);

    // ── Rubber Band / Stretchy Line Logic ──
    const dragX = motionValue(0);
    
    // High-oscillation spring for "more bounce"
    const springX = useSpring(dragX, {
      stiffness: 800,
      damping: 10,
      mass: 0.2
    });
    
    const handleMouseMove = (e: React.MouseEvent) => {
      // Only apply hover pluck if not currently dragging
      const { clientX, currentTarget } = e;
      const { left, width } = currentTarget.getBoundingClientRect();
      const centerX = left + width / 2;
      const deltaX = clientX - centerX;
      
      // Subtly deflection on hover (max 30px)
      const pull = Math.max(Math.min(deltaX, 30), -30);
      dragX.set(pull);
    };

    const handleMouseLeave = () => {
      dragX.set(0);
    };
    
    // Transform spring value into a quadratic bezier path M [start] Q [control] [end]
    // The control point (Q) moves with the spring, creating the curve
    const stringPath = useTransform(springX, (x) => `M 0 0 Q ${x} 80 0 160`);

    useGSAP(() => {
      if (!ref || typeof ref === 'function') return;

      // Smooth entrance for elements
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }});
      
      tl.fromTo('.hero-profile-container', 
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1.5, delay: 0.2 }
      )
      .fromTo('.hero-text-content',
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 1.5 },
        "-=1.2"
      );

      // Scroll parallax
      if (ref && typeof ref !== 'function' && ref.current) {
        gsap.to('.hero-profile-container', {
          y: -40,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

    }, { scope: ref as React.RefObject<HTMLDivElement> });

    return (
      <section
        ref={ref}
        className="relative min-h-screen w-full flex flex-col items-center justify-center pt-35 pb-16 overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-1000"
      >
        {/* ── Left Side: Socials Sidebar (Reverted) ── */}
        <div className="absolute left-6 md:left-10 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 z-20 hidden md:flex">
          <div className="relative group py-10 px-6 -mx-6 h-[160px] flex items-center justify-center">
            {/* The SVG Line */}
            <svg 
              width="80" 
              height="160" 
              viewBox="-40 0 80 160" 
              fill="none" 
              className="text-[var(--accent-primary)] overflow-visible absolute pointer-events-none"
            >
              <motion.path 
                d={stringPath} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              <circle cx="0" cy="2" r="2.5" fill="currentColor" />
              <circle cx="0" cy="158" r="2.5" fill="currentColor" />
            </svg>

            {/* Hidden Drag Handle (The interactive part) */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDrag={(e, info) => dragX.set(info.offset.x)}
              onDragEnd={() => dragX.set(0)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ x: dragX }}
              className="w-12 h-24 cursor-grab active:cursor-grabbing z-30 flex items-center justify-center"
            >
              {/* Optional: subtle handle visual or just leave it transparent for "magic" pull */}
              <div className="w-1 h-8 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-20 rounded-full" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-8">
            <a href="https://www.linkedin.com/in/aditya-tallhari" target='blank' className="text-[var(--text-secondary)] opacity-100 hover:text-[var(--accent-primary)] transition-all hover:scale-125"><CiLinkedin size={26} /></a>
            <a href="https://www.instagram.com/aditya_tallare_" target='blank' className="text-[var(--text-secondary)] opacity-100 hover:text-[var(--accent-primary)] transition-all hover:scale-125"><FaInstagram size={24} /></a>
            <a href="https://github.com/aditya-tallhari" target='blank' className="text-[var(--text-secondary)] opacity-100 hover:text-[var(--accent-primary)] transition-all hover:scale-125"><FaGithub size={24} /></a>
          </div>
        </div>

        {/* ── Right Side: Visual Badge (Reverted) ── */}
        <div className="absolute right-6 md:right-10 lg:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-14 z-20 hidden md:flex">
           <div className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.6em] text-[10px] font-bold text-[var(--accent-primary)] opacity-20 pointer-events-none">
              Sophisticated / Timeless / Gold-Standard
           </div>
        </div>

        {/* Main Managed Content Area */}
        <div className="relative z-10 w-full max-w-[1400px] px-8 md:px-16 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Left: Profile Section (Circular with Rotating Ring) */}
            <div className="hero-profile-container relative w-72 h-72 md:w-[32vw] md:h-[32vw] max-w-[480px] max-h-[480px] flex-shrink-0 flex items-center justify-center">
               {/* Simplified Minimalist Tech Ring */}
               <div className="absolute inset-x-[-15%] inset-y-[-15%] pointer-events-none select-none z-0">
                 <svg 
                   viewBox="0 0 500 500" 
                   className="w-full h-full opacity-30 animate-[spin_30s_linear_infinite]"
                 >
                   <g stroke="var(--accent-primary)" fill="none">
                      <circle cx="250" cy="250" r="210" strokeWidth="0.5" opacity="0.3" />
                      <circle cx="250" cy="250" r="190" strokeWidth="0.5" opacity="0.3" />
                      <circle 
                        cx="250" 
                        cy="250" 
                        r="235" 
                        strokeWidth="1.5" 
                        strokeDasharray="120 400" 
                        strokeLinecap="round" 
                        opacity="0.6" 
                      />
                   </g>
                 </svg>
               </div>
               
               {/* Circular Clipping Container */}
               <div ref={profileImageRef} className="relative w-[85%] h-[85%] rounded-full overflow-hidden flex items-center justify-center border border-[var(--accent-primary)]/10 bg-black/5">
                 <Image
                   src="/profile.svg"
                   alt="Aditya Profile"
                   fill
                   sizes="(max-width: 768px) 70vw, (max-width: 1200px) 40vw, 30vw"
                   className="object-contain object-bottom transition-all duration-700 scale-110 translate-y-4"
                   priority
                 />
               </div>
            </div>

            {/* Right: Content Stack (New Layout) */}
            <div className="hero-text-content flex flex-col flex-1 text-left">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-jetbrains text-[10px] font-bold px-3 py-1 border border-[var(--text-primary)]/40 opacity-60">
                  &lt; Hello World /&gt;
                </span>
                <div className="w-12 h-px bg-[var(--text-primary)]/30" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 font-jetbrains">
                  Full-Stack Developer
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-[5vw] lg:text-[4.8vw] font-playfair font-black tracking-tighter leading-tight mb-6">
                Hey, I'm <span className="">Aditya</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-[4px] h-[0.9em] bg-[var(--accent-primary)] ml-2 align-middle"
                />
              </h1>

              <p className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed font-jetbrains opacity-80">
                Full-stack developer with a passion for building high-performance web applications. 
                I specialize in crafting polished User Interfaces with React, Next.js, and modern backends.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link 
                  href="#contact" 
                  className="px-10 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3"
                >
                  Lets Connect <ArrowDownRight size={18} />
                </Link>
                <Link 
                  href="/resume.pdf" 
                  target="_blank"
                  className="px-10 py-4 border border-[var(--text-primary)]/30 text-[var(--text-primary)] text-xs font-black uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all flex items-center gap-3"
                >
                  Download resume
                </Link>
              </div>
            </div>

          </div>
        </div>

        <div className="w-full max-w-[1400px] px-8 md:px-16 lg:px-24 mt-30">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-[var(--text-primary)]/10 pt-6 gap-8">
            {[
              { 
                num: stats ? `${stats.views.toLocaleString()}+` : '0+', 
                label: 'Portfolio Views' 
              },
              { 
                num: stats ? `${stats.experience}+` : '0+', 
                label: 'Years of Experience' 
              },
              { 
                num: stats ? `${stats.projects}+` : '0+', 
                label: 'Projects Shipped' 
              },
              { 
                num: stats ? `${stats.clients}+` : '0+', 
                label: 'Happy Clients' 
              }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start border-r border-[var(--text-primary)]/5 last:border-r-0">
                <span className="text-3xl md:text-4xl font-playfair font-black mb-1">{stat.num}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 font-jetbrains">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll Call to Action (Reverted) ── */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 hover:opacity-100 transition-all cursor-pointer group z-20">
           <div className="w-px h-12 bg-[var(--accent-primary)] opacity-50 group-hover:h-16 transition-all duration-500" />
           <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[var(--accent-primary)]">scroll.exe</span>
        </div> */}
      </section>
    );
  }
);

PortfolioHero.displayName = 'PortfolioHero';
