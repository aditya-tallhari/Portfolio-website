'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Code, Layout, Sparkles, FolderKanban } from 'lucide-react';
import gsap from 'gsap';
import { FaGithub } from "react-icons/fa";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProjects, Project as ApiProject } from '@/lib/api';
import { Skeleton } from '../ui/skeleton';

gsap.registerPlugin(ScrollTrigger);

// Fixed accent color as requested
const ACCENT_COLOR = '#FF4500';

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [projectsList, setProjectsList] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjectsList(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  useGSAP(() => {
    if (isLoading || projectsList.length === 0) return;

    const ctx = gsap.context(() => {
      // ── Header Animation ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: "play none none none",
        }
      });

      headerTl.from('.title-word-left', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out'
      }, '-=0.3');
      
      headerTl.from('.title-word-right', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out'
      }, '-=0.8');

      // ── Horizontal Pinning Logic ──
      const getScrollAmount = () => {
        if (!gridRef.current) return 0;
        return gridRef.current.scrollWidth - window.innerWidth;
      };

      const scrollTween = gsap.to(gridRef.current, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      // ── Project Interactions ──
      const sections = gsap.utils.toArray('.project-card');
      sections.forEach((card: any) => {
        card.addEventListener('mousemove', (e: any) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          gsap.to(card.querySelector('.card-image-wrap'), {
            x: (x - centerX) * 0.02,
            y: (y - centerY) * 0.02,
            duration: 0.5
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card.querySelector('.card-image-wrap'), { x: 0, y: 0, duration: 0.8 });
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, [isLoading, projectsList]);

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden min-h-screen flex flex-col pt-12 pb-20 transition-colors duration-500"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-glow)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full px-8 md:px-16 lg:px-24 relative z-10 mb-8">
        {/* Header Section */}
        <header ref={headerRef}>
          <h2 className="pt-20 text-5xl md:text-[6rem] font-black tracking-tighter uppercase leading-[0.85] font-playfair mb-3">
            <span className="title-word-left block">Selected /</span>
            <span className="title-word-right block gold-gradient-text text-7xl pt-2">Projects</span>
          </h2>
        </header>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative flex-1 flex items-center">
        <div ref={gridRef} className="flex pl-8 md:pl-16 lg:pl-24 pr-8 md:pr-16 lg:pr-24 w-fit h-fit gap-0">
          {isLoading ? (
            // Skeleton Loader for Horizontal Area
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative h-[550px] md:h-[620px] w-[380px] md:w-[540px] flex flex-col p-8 md:p-12 border border-[var(--border-primary)] mr-0">
                <div className="flex justify-between items-start mb-8">
                  <Skeleton className="w-16 h-16 rounded-full bg-[var(--text-primary)] opacity-10" />
                  <Skeleton className="w-12 h-8 bg-[var(--text-primary)] opacity-10" />
                </div>
                <Skeleton className="w-full h-48 md:h-64 rounded-2xl bg-[var(--text-primary)] opacity-10 mb-8" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="w-3/4 h-10 bg-[var(--text-primary)] opacity-20" />
                  <Skeleton className="w-full h-24 bg-[var(--text-primary)] opacity-10" />
                </div>
              </div>
            ))
          ) : (
            projectsList?.map((project, i) => {
              const accentColor = ACCENT_COLOR;
              const techArray = Array.isArray(project.techStack) ? project.techStack : [];
              
              return (
                <div 
                  key={project._id || i}
                  className="project-card group relative h-[550px] md:h-[620px] w-[380px] md:w-[540px] flex flex-col bg-transparent border border-[var(--border-primary)] hover:border-[var(--accent-primary)] p-8 md:p-12 transition-all duration-700 overflow-hidden"
                  style={{ '--accent-primary': accentColor } as React.CSSProperties}
                >
                  {/* Card Header: Icon & Number */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white group-hover:border-[var(--accent-primary)] transition-all duration-500">
                        <FolderKanban size={24} strokeWidth={1} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl md:text-4xl font-light text-[var(--text-primary)] opacity-20 font-playfair italic">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {project.isFeatured && (
                        <div className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                          <Sparkles size={10} className="text-[var(--accent-primary)]" />
                          <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Image Block */}
                  <div className="relative w-full h-[180px] md:h-[240px] mb-8 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <div className="card-image-wrap relative w-full h-full">
                      <Image 
                        src={project.imageUrl || project.image || 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=1200'}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover grayscale brightness-90 dark:brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-transparent group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4 md:mb-6 leading-[1.1] font-playfair">
                      {project.title}
                    </h3>
                    
                    <div className="w-full h-px bg-[var(--border-primary)] opacity-60 mb-6" />

                    <p className="text-xs md:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-4">
                      {project.links?.github && (
                        <a 
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
                        >
                          <FaGithub size={18} />
                        </a>
                      )}
                      {project.links?.live && (
                        <a 
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {techArray.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-40 font-jetbrains">
                          {t}{idx < techArray.slice(0, 3).length - 1 ? " •" : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subtle Highlight (Hover Only) */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-hover:bg-[var(--accent-primary)] transition-all duration-700 pointer-events-none" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
