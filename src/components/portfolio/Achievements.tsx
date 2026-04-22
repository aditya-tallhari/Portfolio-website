'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, MapPin, Award, Calendar, CircleUser, Sparkles, Binary } from 'lucide-react';

const educationData = [
  {
    id: '01',
    degree: 'B.Tech in CSE',
    institution: "R. C. Patel Institute of Technology",
    location: 'Shirpur, Dhule',
    period: '2024 — 2027',
    grade: 'CGPA: 8.47',
    desc: 'Currently pursuing B.Tech in Computer Science and Engineering, with a strong focus on Advanced Machine Learning and Scalable Full Stack Systems. Actively involved in technical research and algorithmic development.',
    tags: ['Machine Learning', 'Data Structures', 'Cloud Systems'],
    verified: true
  },
  {
    id: '02',
    degree: 'Diploma in CS',
    institution: 'Godavari Polytechnic College, Jalgaon',
    location: 'Jalgaon, Maharashtra',
    period: '2021 — 2024',
    grade: 'Score: 87.77%',
    desc: 'Achieved an overall score of 87.77% in Diploma in Computer Science, specializing in core engineering fundamentals and foundational software development principles.',
    tags: ['C/C++', 'OS Fundamentals', 'Hardware'],
    verified: true
  },
  {
    id: '03',
    degree: 'SSC (Secondary School)',
    institution: 'A.G.C.S High School,Bhuswal',
    location: 'Bhusawal, Maharashtra',
    period: '2019 — 2021',
    grade: '77.80%',
    desc: 'Secured 77.80% in SSC, demonstrating a strong foundation in mathematics and sciences, which paved the way for my technical education.',
    tags: ['Mathematics', 'Science'],
    verified: true
  }
];

const SplitText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export const Achievements = () => {
  return (
    <section id="education" className="relative py-32 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent opacity-20" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center md:justify-start gap-4 mb-6"
          >
             <div className="w-16 h-[2px] bg-[var(--accent-primary)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)] font-jetbrains">Trajectory // Education_Path</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-9xl font-playfair font-black tracking-tighter uppercase leading-[0.8] mb-10">
            <SplitText text="Academic" className="block text-[var(--text-primary)]" />
            <SplitText text="Expedition" className="block text-[var(--text-primary)] opacity-20" />
          </h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-60 font-jetbrains text-[10px] uppercase tracking-widest font-black text-[var(--text-primary)]"
          >
            <span className="flex items-center gap-2"><Sparkles size={12} /> Excellence Focused</span>
            <span className="flex items-center gap-2"><Binary size={12} /> Computer Science Core</span>
            <span className="flex items-center gap-2"><CircleUser size={12} /> continuous Learning</span>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {educationData.map((edu, i) => (
            <EducationRow key={edu.id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const EducationRow = ({ edu, index }: { edu: typeof educationData[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col md:flex-row gap-8 md:items-center p-10 md:p-14 rounded-[2.5rem] border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] hover:bg-[var(--text-primary)]/[0.03] transition-all duration-700 hover:border-[var(--accent-primary)]/20"
    >
      {/* Index Number */}
      <div className="absolute top-10 right-14 font-playfair text-8xl font-black italic text-[var(--text-primary)] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        {edu.id}
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-10 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest font-jetbrains">
            {edu.period}
          </div>
          {edu.verified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest font-jetbrains">
              <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Institutional Verified
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-[var(--text-primary)] opacity-60">
             <GraduationCap size={20} />
             <h4 className="text-xs font-black uppercase tracking-[0.3em] font-jetbrains">{edu.institution}</h4>
          </div>
          <h3 className="text-4xl md:text-5xl font-playfair font-black text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-primary)] transition-colors duration-500">
            {edu.degree}
          </h3>
          <div className="flex items-center gap-2 text-[var(--text-primary)] opacity-50 text-[10px] font-black uppercase tracking-widest font-jetbrains">
            <MapPin size={12} /> {edu.location}
          </div>
        </div>

        <p className="max-w-2xl text-sm md:text-base text-[var(--text-primary)] opacity-70 leading-relaxed font-jetbrains italic">
          "{edu.desc}"
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {edu.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-widest border border-[var(--border-primary)] px-3 py-1.5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity font-jetbrains text-[var(--text-primary)]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Grade Card */}
      <div className="w-full md:w-64 p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex flex-col items-center justify-center gap-2 group-hover:border-[var(--accent-primary)]/40 transition-all duration-500 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-40 font-jetbrains">Final Assessment</span>
        <div className="text-4xl md:text-5xl font-black font-playfair italic text-[var(--accent-primary)]">
          {edu.grade}
        </div>
        <div className="mt-4 w-full h-[1px] bg-[var(--border-primary)]" />
        <div className="flex items-center gap-2 mt-4 text-[var(--text-primary)] opacity-40 text-[9px] font-black uppercase tracking-widest font-jetbrains">
          <Award size={12} /> Transcripts Ready
        </div>
      </div>
    </motion.div>
  );
};
