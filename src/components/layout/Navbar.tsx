'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ColorModeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Exp', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Winnings', href: '#hackathons' },
  { name: 'Coding', href: '#competitive' },
  { name: 'Contact', href: '#contact' },
];

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-4.51-2-7-2"/></svg>
);

const VolumeOnIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
);

const VolumeOffIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
);

const SunIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

export const Navbar = () => {
  const pathname = usePathname();
  const { mode, toggleMode, isLight } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSoundOn, setIsSoundOn] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.volume = 0.3; // Default volume
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isSoundOn]);

  return (
    <>
      <audio ref={audioRef} src="/bg-music.mp3" loop />
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 lg:px-12 py-5 flex items-center justify-between w-full text-[var(--text-primary)] backdrop-blur-2xl bg-[var(--bg-primary)]/70 border-b border-[var(--border-primary)] transition-all duration-500">
      {/* ── Logo Section ── */}
      <div className="flex-shrink-0 z-[110]">
        <Link href="/" className="flex flex-col font-black tracking-tighter text-sm md:text-base leading-[0.85] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all">
          <span>ADITYA</span>
          <span>TALLHARI</span>
        </Link>
      </div>

      {/* ── Desktop Navigation ── */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-12 max-w-2xl mx-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:text-[var(--accent-primary)] ${
                isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--muted-text)]'
              } relative group`}
            >
               {link.name}
               <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`} />
            </Link>
          );
        })}
      </div>

      {/* ── Right Control Center ── */}
      <div className="flex items-center gap-4 md:gap-6 z-[110]">
        <button
          onClick={toggleMode}
          className={`relative group p-2 rounded-full overflow-hidden hover:bg-[var(--accent-glow)] transition-all active:scale-95 ${
            isLight ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]/60 hover:text-[var(--accent-primary)]'
          }`}
          aria-label="Toggle Theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLight ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          onClick={() => setIsSoundOn(!isSoundOn)}
          className={`relative group p-2 rounded-full overflow-hidden hover:bg-[var(--accent-glow)] transition-all active:scale-95 ${
            isSoundOn ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]/60 hover:text-[var(--accent-primary)]'
          }`}
          aria-label="Toggle Sound"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSoundOn ? 'on' : 'off'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isSoundOn ? <VolumeOnIcon size={20} /> : <VolumeOffIcon size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-all"
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

    </nav>

      {/* ── Mobile Menu Overlay ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 pt-24 pb-10 px-8 bg-[var(--bg-primary)] z-[9999] flex flex-col md:hidden overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                aria-label="Close Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col gap-6 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors border-b border-[var(--border-primary)]/20 pb-4"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-12 flex flex-col gap-4">
                <span className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-wider">Connect</span>
                <div className="flex flex-wrap gap-6">
                  <a href="mailto:adityatallhari79@gmail.com" className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Email</a>
                  <a href="https://github.com/aditya-tallhari" target="_blank" rel="noreferrer" className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">GitHub</a>
                  <a href="https://linkedin.com/in/aditya-tallhari" target="_blank" rel="noreferrer" className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">LinkedIn</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
