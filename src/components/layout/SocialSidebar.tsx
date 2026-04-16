"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

// Custom SVG Icons
const MailIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-10 11"/><path d="m2 22 10-11"/><path d="M22 22 12 11"/><path d="M2 2 12 11"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const FacebookIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-4.51-2-7-2"/></svg>
);

const InstagramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);


export const SocialSidebar = () => {
  const socials = [
    { icon: MailIcon, href: "mailto:your@email.com", label: "Email" },
    { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
    { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
    { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  ];

  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    if (!buttonRefs.current[index]) return;
    gsap.to(buttonRefs.current[index], {
      scale: 1.3,
      y: -5,
      color: "var(--accent-primary)",
      duration: 0.4,
      ease: "back.out(1.7)"
    });
  };

  const handleMouseLeave = (index: number) => {
    if (!buttonRefs.current[index]) return;
    gsap.to(buttonRefs.current[index], {
      scale: 1,
      y: 0,
      color: "var(--text-primary)",
      duration: 0.4,
      opacity: 0.6,
      ease: "power2.inOut"
    });
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-24 flex flex-col items-center py-10 z-50 bg-transparent group/sidebar">
      {/* Branding */}
      <div className="mb-auto relative">
         <h2 className="text-[var(--text-primary)] text-3xl font-black tracking-tighter select-none opacity-50 hover:opacity-100 transition-opacity cursor-default">
            AT
         </h2>
         {/* Signal Pulse */}
         <div className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-ping opacity-75" />
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-10 items-center mb-10 relative">
        
        {socials.map((social, index) => (
          <Link
            key={social.label}
            href={social.href}
            target="_blank"
            ref={(el) => { buttonRefs.current[index] = el; }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className="relative text-[var(--text-primary)] opacity-60 dark:opacity-30 transition-all block p-2 z-10 hover:opacity-100 hover:text-[var(--accent-primary)]"
          >
            <social.icon size={28} className="relative z-10 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="relative w-[1px] h-32 invisible" />
    </div>
  );
};
