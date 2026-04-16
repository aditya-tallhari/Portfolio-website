'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const frontend = [
  { name: 'React', svg: '/tech/react.svg' },
  { name: 'Next.js', svg: '/tech/next.svg' },
  { name: 'TypeScript', svg: '/tech/typescript.svg' },
  { name: 'Tailwind', svg: '/tech/tailwind.svg' },
  { name: 'HTML5', svg: '/tech/html5.svg' },
  { name: 'CSS3', svg: '/tech/css3.svg' },
  { name: 'Redux', svg: '/tech/redux.svg' },
];

const backend = [
  { name: 'Node.js', svg: '/tech/nodejs.svg' },
  { name: 'Python', svg: '/tech/python.svg' },
  { name: 'PostgreSQL', svg: '/tech/PostgresSQL.svg' },
  { name: 'MongoDB', svg: '/tech/mongodb.svg' },
  { name: 'GraphQL', svg: '/tech/Graphql.svg' },
  { name: 'Redis', svg: '/tech/redis.svg' },
];

const tools = [
  { name: 'Git', svg: '/tech/git.svg' },
  { name: 'Docker', svg: '/tech/docker.svg' },
  { name: 'VS Code', svg: '/tech/vscode.svg' },
];

export const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from('.tech-column', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: 'expo.out',
      force3D: true, // Force GPU layer
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

  }, { scope: containerRef });

  const TechColumn = ({ title, items }: { title: string, items: typeof frontend }) => (
    <div className="tech-column flex-1 space-y-8 will-change-transform">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-40">{title}</h3>
      </div>
      
      <div className="flex flex-col gap-2">
        {items.map((tech) => (
          <div 
            key={tech.name} 
            className="group relative flex items-center gap-4 p-3 bg-[var(--text-primary)]/[0.02] border border-[var(--text-primary)]/[0.04] rounded-xl hover:bg-[var(--text-primary)]/[0.05] hover:border-[var(--accent-primary)]/20 transition-all duration-500 cursor-crosshair transform-gpu backface-hidden will-change-transform"
          >
            <div className="relative w-8 h-8 flex items-center justify-center filter grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none">
               <Image 
                 src={tech.svg} 
                 alt={tech.name} 
                 width={32}
                 height={32}
                 className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-700"
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 group-hover:opacity-100 transition-opacity duration-500">
               {tech.name}
            </span>
            
            <div className="absolute right-4 w-1 h-1 rounded-full bg-[var(--accent-primary)] opacity-0 group-hover:opacity-40 transition-all duration-700" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section 
      ref={containerRef} 
      id="tech"
      className="py-40 bg-[var(--bg-primary)] transition-colors duration-1000 overflow-hidden contain-paint"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
           <div className="space-y-4">

              <h2 className="text-6xl md:text-8xl font-playfair font-black tracking-tighter gold-gradient-text">
                 The Stack.
              </h2>
           </div>
          
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-4 items-start">
          <TechColumn title="Frontend" items={frontend} />
          <div className="hidden md:block w-px h-[350px] bg-[var(--text-primary)]/5 self-center" />
          <TechColumn title="Backend" items={backend} />
          <div className="hidden md:block w-px h-[350px] bg-[var(--text-primary)]/5 self-center" />
          <TechColumn title="Tooling" items={tools} />
        </div>

      </div>
    </section>
  );
};
