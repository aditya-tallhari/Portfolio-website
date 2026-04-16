'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: '2024 - Present',
    role: 'Lead Developer',
    company: 'Innovation Labs',
    desc: 'Driving the development of scalable architectures and mentoring junior developers in a fast-paced environment.'
  },
  {
    year: '2023 - 2024',
    role: 'Full Stack Engineer',
    company: 'Nexwave Systems',
    desc: 'Pioneered the integration of AI-driven analytics into customer-facing dashboards, improving user retention by 25%.'
  },
  {
    year: '2022 - 2023',
    role: 'Frontend Specialist',
    company: 'Creative Studio',
    desc: 'Crafted pixel-perfect, highly interactive user interfaces using GSAP and Framer Motion for global brands.'
  },
  {
    year: '2021 - 2022',
    role: 'Junior Developer',
    company: 'StartUp Hub',
    desc: 'Gained hands-on experience in the MERN stack while building modern web applications from the ground up.'
  }
];

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // 1. Line Drawing Animation
    gsap.fromTo(lineRef.current, 
      { strokeDashoffset: 1000, strokeDasharray: 1000 },
      {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1.5,
        }
      }
    );

    // 2. Node Lighting Animation
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;

      const marker = node.querySelector('.timeline-marker');
      const content = node.querySelector('.timeline-content');

      gsap.fromTo(marker,
        { backgroundColor: 'var(--border-primary)', boxShadow: '0 0 0px transparent' },
        {
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 0 20px var(--accent-glow)',
          scrollTrigger: {
            trigger: node,
            start: 'top 50%',
            end: 'bottom 50%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      gsap.fromTo(content,
        { opacity: 0.2, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 60%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section id="experience" ref={containerRef} className="py-32 px-6 md:px-20 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="max-w-4xl mx-auto relative">
        <div className="overflow-hidden mb-32">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">
            Work/<br/><span className="text-[var(--muted-text)]">Timeline</span>
          </h2>
        </div>

        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-48 bottom-0 w-px bg-[var(--border-primary)] -translate-x-1/2">
          <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
            <line
              ref={lineRef}
              x1="50%" y1="0" x2="50%" y2="100%"
              stroke="var(--text-primary)"
              strokeWidth="2"
              className="hidden md:block"
            />
          </svg>
        </div>

        <div className="space-y-40 relative z-10">
          {experiences.map((exp, i) => (
            <div
              key={i}
              ref={(el) => { nodeRefs.current[i] = el; }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content Card */}
              <div className="timeline-content flex-1 w-full">
                <div className={`p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-primary)] backdrop-blur-md ${
                  i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--muted-text)] mb-2">{exp.year}</p>
                  <h3 className="text-2xl font-black mb-1 tracking-tight">{exp.role}</h3>
                  <p className="text-sm font-bold text-[var(--accent-primary)]/50 mb-6 uppercase tracking-widest">{exp.company}</p>
                  <p className="text-sm leading-relaxed text-[var(--muted-text)]">{exp.desc}</p>
                </div>
              </div>

              {/* Marker */}
              <div className="absolute left-4 md:static md:mx-4 -translate-x-1/2 md:translate-x-0">
                <div className="timeline-marker w-4 h-4 rounded-full bg-[var(--text-primary)] border-4 border-[var(--bg-primary)] z-20" />
              </div>

              {/* Spacer for reverse layout */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
