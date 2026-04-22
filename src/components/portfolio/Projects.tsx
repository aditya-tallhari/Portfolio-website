'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, Code, Layout, Sparkles, FolderKanban } from 'lucide-react';
import gsap from 'gsap';
import { FaGithub } from "react-icons/fa";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProjects, Project as ApiProject } from '@/lib/api';
import { Skeleton } from '../ui/skeleton';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger);

// Fixed accent color as requested
const ACCENT_COLOR = '#FF4500';

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [projectsList, setProjectsList] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjectsList(data);
      } catch (error) {
        console.warn("Error loading projects. Using offline fallback.", error instanceof Error ? error.message : "");
        setProjectsList([
          {
            _id: "offline-1",
            title: "Offline Backend",
            slug: "offline-backend",
            description: "The backend server is currently unreachable. Viewing local fallback cache.",
            content: "The API backend is offline.",
            techStack: ["Next.js", "Offline", "Cache"],
            isFeatured: true,
            order: 1,
            links: {
              github: "https://github.com",
              live: "https://aditya-tallhari-portfolio.vercel.app"
            }
          } as ApiProject
        ]);
      } finally {
        setIsLoading(false);
        // Ensure ScrollTrigger refreshes after state update and DOM render
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };
    loadProjects();
  }, []);

  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (projectsList.length > 0) {
      if (imagesLoaded >= projectsList.length) {
        setAllImagesLoaded(true);
      }
      
      // Safety timeout - force show after 3s if images take too long
      const safetyTimer = setTimeout(() => {
        setAllImagesLoaded(true);
      }, 3000);
      
      return () => clearTimeout(safetyTimer);
    }
  }, [imagesLoaded, projectsList]);

  // Robust ScrollTrigger refresh strategy
  useEffect(() => {
    if (!allImagesLoaded) return;

    // Refresh multiple times to ensure layout stability
    const timers = [
      setTimeout(() => ScrollTrigger.refresh(), 100),
      setTimeout(() => ScrollTrigger.refresh(), 500),
      setTimeout(() => ScrollTrigger.refresh(), 1500)
    ];

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', refresh);
    };
  }, [allImagesLoaded]);

  useGSAP(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {

      // ── Header Animation ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: "play none none none",
        }
      });

      headerTl.to('.title-word-left', {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out'
      });

      headerTl.to('.title-word-right', {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out'
      }, '<0.2');

      // ── Horizontal Pinning Logic (Desktop Only) ──
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const getScrollAmount = () => {
          if (!gridRef.current) return 0;
          // Calculate exact amount to show the last card fully
          return gridRef.current.scrollWidth - window.innerWidth + (window.innerWidth * 0.1); 
        };

        gsap.to(gridRef.current, {
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
      });

      // ── Mobile Animation (Vertical Stack) ──
      mm.add("(max-width: 767px)", () => {
        gsap.from(".project-card", {
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          }
        });
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
      className=" relative z-40 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-10 pb-10 min-h-screen flex flex-col"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-glow)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full px-8 md:px-16 lg:px-24 relative z-10 mb-8">
        {/* Header Section */}
        <header ref={headerRef}>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] font-playfair pt-15">
            <span className="title-word-left block opacity-0 -translate-x-10">Selected /</span>
            <span className="title-word-right block text-6xl md:text-8xl pt-1 text-[var(--accent-primary)] opacity-0 translate-x-10">Projects</span>
          </h2>
        </header>
      </div>

      {/* Horizontal Scroll Wrapper on Desktop / Vertical Stack on Mobile */}
      <div className="relative flex-1 flex items-center md:items-end pb-2 overflow-x-hidden md:overflow-hidden">
        <div 
          ref={gridRef} 
          className="flex flex-col md:flex-row items-center md:items-start px-6 md:px-16 lg:px-24 w-full md:w-fit h-fit gap-8 md:gap-10"
        >
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative h-[550px] md:h-[620px] w-full max-w-[400px] md:w-[480px] flex flex-col p-8 md:p-12 border border-[var(--border-primary)] mr-0 shrink-0 rounded-3xl">
                <div className="flex justify-between items-start mb-8">
                  <Skeleton className="w-16 h-16 rounded-full bg-[var(--text-primary)] opacity-10" />
                  <Skeleton className="w-12 h-8 bg-[var(--text-primary)] opacity-10" />
                </div>
                <Skeleton className="w-full h-56 md:h-[280px] rounded-2xl bg-[var(--text-primary)] opacity-10 mb-8" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="w-3/4 h-10 bg-[var(--text-primary)] opacity-20" />
                  <Skeleton className="w-full h-24 bg-[var(--text-primary)] opacity-10" />
                </div>
              </div>
            ))
          ) : (
            projectsList.map((project, i) => (
              <ProjectCard
                key={project._id || i}
                project={project}
                index={i}
                onImageLoad={handleImageLoad}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
