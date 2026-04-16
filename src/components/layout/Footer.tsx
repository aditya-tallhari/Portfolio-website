import React from 'react';
import { Mail } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.7 5.7 0 0 0 .1-3.9s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.7 5.7 0 0 0 .1 3.9A5.4 5.4 0 0 0 3 9.6c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-[var(--color-text-secondary)]">
            © 2026 Aditya Tallhari. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 opacity-60">
            Made with ❤️ in Next.js
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors">
            <GithubIcon size={20} />
          </a>
          <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors">
            <LinkedinIcon size={20} />
          </a>
          <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors">
            <TwitterIcon size={20} />
          </a>
          <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
