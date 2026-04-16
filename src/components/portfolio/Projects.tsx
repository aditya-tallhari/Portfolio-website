'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-4.51-2-7-2"/></svg>
);

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Nexwave',
    category: 'Full Stack / AI',
    desc: 'An intelligent platform for real-time collaboration with integrated AI brainstorming tools.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    link: '#',
    featured: true
  },
  {
    title: 'Vortex UI',
    category: 'Design System',
    desc: 'A high-performance component library built with accessibility and animation at its core.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  },
  {
    title: 'Ethereal',
    category: 'Web3 / NFT',
    desc: 'A minimalist marketplace for digital assets with a focus on immersive user experience.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    link: '#'
  }
];

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    projectRefs.current.forEach((card) => {
      if (!card) return;

      const img = card.querySelector('.project-image') as HTMLElement;

      if (img) {
        gsap.to(img, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
          rotateY: x / 30,
          rotateX: -y / 30,
          duration: 0.5,
          ease: 'power3.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    gsap.from('.project-reveal', {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

  }, { scope: containerRef });

  return (
    <section id="projects" ref={containerRef} className="py-32 px-6 md:px-20 bg-[var(--bg-primary)] perspective-[1500px] transition-colors duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden mb-32">
          <h2 className="project-reveal text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            Selected/<br/><span className="text-[var(--accent-primary)] opacity-20">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { projectRefs.current[i] = el; }}
              className={`project-reveal group relative preserve-3d cursor-none ${
                project.featured ? 'md:col-span-2' : ''
              }`}
            >
              {/* Main Card Shell */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[3rem] bg-[var(--card-bg)] border border-[var(--border-primary)] backdrop-blur-sm group-hover:border-[var(--accent-primary)] transition-all duration-700">
                
                {/* Parallax Image */}
                <div className="project-image-container absolute inset-0 overflow-hidden">
                  <div className="relative w-full h-[120%] -top-[10%]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="project-image object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {/* Overlay Gradient - Balanced Fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90" />
                </div>

                {/* Content Overlay */}
                <div className="project-text absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 pointer-events-none">
                  <div className="flex justify-between items-end">
                    <div className="space-y-4 pointer-events-auto">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-bold">{project.category}</p>
                      <h3 className="text-4xl md:text-6xl font-black tracking-tight group-hover:text-[var(--accent-primary)] transition-colors duration-500">{project.title}</h3>
                      <p className="max-w-md text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-jetbrains">
                        {project.desc}
                      </p>
                    </div>
                    <div className="flex gap-4 pointer-events-auto">
                      <button className="w-14 h-14 rounded-full border border-[var(--border-primary)] flex items-center justify-center bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-secondary)] transition-all duration-500 backdrop-blur-xl group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--accent-primary)]">
                        <GithubIcon size={20} />
                      </button>
                      <button className="w-14 h-14 rounded-full border border-[var(--border-primary)] flex items-center justify-center bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-secondary)] transition-all duration-500 backdrop-blur-xl group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--accent-primary)]">
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cyber Brackets */}
                <div className="absolute top-8 left-8 text-[10px] font-mono text-[var(--accent-primary)] opacity-20 uppercase tracking-widest hidden md:block">
                  [ 0{i + 1} // PRJ ]
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
