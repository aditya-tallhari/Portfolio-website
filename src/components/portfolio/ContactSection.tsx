'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    // Input focus line animation
    const inputs = document.querySelectorAll('.contact-input');
    inputs.forEach((input) => {
      const line = input.nextElementSibling as HTMLDivElement;
      input.addEventListener('focus', () => {
        gsap.to(line, { scaleX: 1, duration: 0.6, ease: 'expo.out' });
      });
      input.addEventListener('blur', () => {
        if (!(input as HTMLInputElement).value) {
          gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'expo.out' });
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-40 px-6 md:px-20 bg-[var(--bg-primary)] flex justify-center items-center transition-colors duration-1000">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="overflow-hidden">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              Let's/<br/><span className="text-[var(--accent-primary)] opacity-20">Connect</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-secondary)] border border-[var(--border-primary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--bg-primary)] transition-all duration-500 group-hover:shadow-[0_0_20px_var(--accent-primary)]">
                <Mail size={20} className="text-[var(--accent-primary)] group-hover:text-[var(--bg-primary)]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] opacity-60 mb-1">Email</p>
                <p className="text-lg font-bold">hello@aditya.dev</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-secondary)] border border-[var(--border-primary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--bg-primary)] transition-all duration-500 group-hover:shadow-[0_0_20px_var(--accent-primary)]">
                <MapPin size={20} className="text-[var(--accent-primary)] group-hover:text-[var(--bg-primary)]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] opacity-60 mb-1">Location</p>
                <p className="text-lg font-bold">Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div ref={formRef} className="relative p-10 md:p-16 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--border-primary)] backdrop-blur-xl shadow-2xl overflow-hidden group/form focus-within:border-[var(--accent-primary)] transition-all duration-700">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="YOUR NAME"
                className="contact-input w-full bg-transparent py-4 text-xl font-bold tracking-tight border-none outline-none placeholder:text-[var(--text-primary)]/20 text-[var(--text-primary)]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] scale-x-0 origin-center transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-primary)]" />
            </div>

            <div className="relative group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL"
                className="contact-input w-full bg-transparent py-4 text-xl font-bold tracking-tight border-none outline-none placeholder:text-[var(--text-primary)]/20 text-[var(--text-primary)]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] scale-x-0 origin-center transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-primary)]" />
            </div>

            <div className="relative group">
              <textarea 
                rows={4}
                placeholder="YOUR MESSAGE"
                className="contact-input w-full bg-transparent py-4 text-xl font-bold tracking-tight border-none outline-none placeholder:text-[var(--text-primary)]/20 text-[var(--text-primary)] resize-none"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] scale-x-0 origin-center transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-primary)]" />
            </div>

            <button className="group w-full py-6 rounded-2xl bg-[var(--accent-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] active:scale-95 transition-all shadow-[0_10px_30px_var(--accent-glow)]">
              Send Message
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
