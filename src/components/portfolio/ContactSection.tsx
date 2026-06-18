'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { sendContactMessage } from '@/lib/api';

export const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendContactMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      setError(error.message || 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 opacity-60">
            <div className="w-8 sm:w-12 h-[1px] bg-[var(--accent-primary)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)]">Contact</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-8xl font-playfair font-black tracking-tighter uppercase mb-4 sm:mb-6 leading-[0.9]">
            Let's <span className="text-[var(--accent-primary)]">Connect</span>
          </h2>
          <p className="text-[var(--text-primary)] max-w-xl text-[10px] sm:text-xs md:text-base uppercase tracking-widest leading-relaxed opacity-60 transition-opacity duration-500">
            Have a project in mind? reach out for collaboration or inquiries.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8 md:space-y-10 lg:space-y-12">
            <div className="space-y-8">
              <a href="mailto:adityatallhari@gmail.com" className="group block space-y-2 overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[var(--text-primary)]">Email</p>
                <div className="flex items-center gap-3 text-[var(--text-primary)]">
                  <span className="text-base sm:text-lg md:text-xl lg:text-3xl font-black font-playfair group-hover:text-[var(--accent-primary)] transition-colors break-all sm:break-normal">adityatallhari@gmail.com</span>
                  <ArrowRight size={20} className="hidden xs:block text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
              </a>

              <div className="space-y-2 text-[var(--text-primary)]">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Location</p>
                <p className="text-lg sm:text-xl md:text-3xl font-black font-playfair">Shirpur, Maharashtra, India</p>
              </div>
            </div>

            {/* <div className="pt-6 sm:pt-8 border-t border-[var(--border-primary)] flex gap-6 sm:gap-8">
              {[
                { icon: FaGithub, href: 'https://github.com/adityatallhari', label: 'GitHub' },
                { icon: FaLinkedin, href: 'https://linkedin.com/in/adityatallhari', label: 'LinkedIn' }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" className="text-[var(--text-primary)] opacity-60 hover:text-[var(--accent-primary)] hover:opacity-100 transition-all flex items-center gap-2">
                   <social.icon size={20} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{social.label}</span>
                </a>
              ))}
            </div> */}
          </div>

          {/* Right: Simple Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[var(--text-primary)]">Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="w-full bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl px-6 py-4 outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-primary)] placeholder:opacity-30 text-[var(--text-primary)]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[var(--text-primary)]">Email</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" className="w-full bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl px-6 py-4 outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-primary)] placeholder:opacity-30 text-[var(--text-primary)]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[var(--text-primary)]">Message</label>
                    <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Your project details..." rows={5} className="w-full bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-2xl px-6 py-4 outline-none focus:border-[var(--accent-primary)] transition-colors resize-none placeholder:text-[var(--text-primary)] placeholder:opacity-30 text-[var(--text-primary)]" />
                  </div>
                  
                  {error && <p className="text-[10px] font-bold uppercase text-red-500">{error}</p>}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="group w-full sm:w-auto bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 sm:px-10 py-4 sm:py-5 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                    <Send size={16} />
                  </button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-[var(--bg-primary)] mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-3xl font-black font-playfair uppercase mb-2">Success</h3>
                  <p className="text-sm opacity-60 uppercase tracking-widest mb-8">Message has been transmitted.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-[10px] font-bold uppercase border-b border-[var(--accent-primary)] text-[var(--accent-primary)]">Send Another</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
