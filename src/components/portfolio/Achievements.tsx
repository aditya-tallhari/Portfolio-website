'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award, Compass, School } from 'lucide-react';

const educationData = [
  {
    id: '01',
    degree: 'B.Tech in CSE',
    institution: 'Vignans Institute of Engineering',
    location: 'AP, India',
    period: '2021 — 2025',
    grade: 'CGPA: 0.0',
    desc: 'Specializing in Machine Learning and Full Stack Systems.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '02',
    degree: 'Diploma - CS',
    institution: 'Government Polytechnic',
    location: 'AP, India',
    period: '2018 — 2021',
    grade: 'Score: 00%',
    desc: 'Core fundamentals of computer science and hardware architectures.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '03',
    degree: 'SSC (10th)',
    institution: 'School Name',
    location: 'AP, India',
    period: '2016 — 2018',
    grade: 'GPA: 0.0',
    desc: 'High school education with honors in Mathematics and Science.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
  }
];

export const Achievements = () => {
  return (
    <section id="education" className="relative py-24 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500">
      {/* Background Ornament */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-[2px] bg-[var(--accent-primary)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--accent-primary)]">Trajectory</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-playfair font-black tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)]">
            Education <br /> 
            <span className="opacity-20">Milestones</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {educationData.map((edu, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group relative flex flex-col bg-[var(--bg-secondary)] border border-[var(--text-primary)]/[0.03] rounded-[2rem] overflow-hidden hover:border-[var(--accent-primary)]/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Card Number Overlay */}
              <div className="absolute top-6 left-6 z-20 mix-blend-difference opacity-40 group-hover:opacity-100 transition-opacity">
                 <span className="text-4xl font-black font-playfair text-white">{edu.id}</span>
              </div>

              {/* Image Section */}
              <div className="aspect-[4/3] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                 <img 
                   src={edu.image} 
                   alt={edu.institution} 
                   className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-90" />
                 
                 {/* Floating Period Badge */}
                 <div className="absolute bottom-5 right-6 px-3 py-1 rounded-full bg-[var(--text-primary)]/5 backdrop-blur-md border border-[var(--text-primary)]/10 text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                    {edu.period}
                 </div>
              </div>

              {/* Content body */}
              <div className="p-8 pb-10 flex flex-col flex-1 gap-6 relative">
                <div className="space-y-4">
                   <div>
                      <div className="flex items-center gap-2 mb-1 opacity-40 text-[var(--text-secondary)]">
                         <MapPin size={8} className="text-[var(--accent-primary)]" />
                         <span className="text-[7px] font-black uppercase tracking-widest">{edu.location}</span>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight leading-tight group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 text-[var(--text-primary)]">
                        {edu.degree}
                      </h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-20 mt-1 line-clamp-1">{edu.institution}</p>
                   </div>
                   
                   <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed opacity-40 group-hover:opacity-80 transition-opacity">
                      {edu.desc}
                   </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--text-primary)]/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/5 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/10 group-hover:bg-[var(--accent-primary)]/10 transition-colors">
                         <GraduationCap size={18} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[12px] font-black tracking-tighter text-[var(--accent-primary)]">{edu.grade}</span>
                         <span className="text-[6px] font-black uppercase tracking-widest opacity-20 text-[var(--text-secondary)]">Verified Record</span>
                      </div>
                   </div>
                   
                   <div className="w-8 h-8 rounded-full border border-[var(--text-primary)]/5 flex items-center justify-center text-[var(--text-primary)] opacity-10 group-hover:text-[var(--accent-primary)] group-hover:border-[var(--accent-primary)]/30 group-hover:opacity-100 transition-all">
                      <Compass size={14} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
