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
      className=" relative z-30 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-10 pb-10 min-h-screen flex flex-col"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-glow)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full px-8 md:px-16 lg:px-24 relative z-10 mb-8">
        {/* Header Section */}
        <header ref={headerRef}>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] font-playfair pt-15">
            <span className="title-word-left block">Selected /</span>
            <span className="title-word-right block text-6xl md:text-8xl pt-1 text-[var(--accent-primary)]">Projects</span>
          </h2>
        </header>
      </div>

      {/* Horizontal Scroll Wrapper - Full height of remaining flex space */}
      <div className="relative flex-1 flex items-end pb-2 overflow-hidden">
        <div ref={gridRef} className="flex pl-8 md:pl-16 lg:pl-24 pr-8 md:pr-16 lg:pr-24 w-fit h-fit gap-10">
          {isLoading ? (
            // Skeleton Loader for Horizontal Area
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative h-[550px] md:h-[620px] w-[350px] md:w-[480px] flex flex-col p-8 md:p-12 border border-[var(--border-primary)] mr-0 shrink-0 rounded-3xl">
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
            projectsList?.map((project, i) => (
              <ProjectCard
                key={project._id || i}
                project={project}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
