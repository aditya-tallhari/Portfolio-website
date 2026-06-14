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

const LeetcodeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* <title>LeetCode</title> */}
    <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039 0.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396 -2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" />
  </svg>
);



export const SocialSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const socials = [
    { icon: MailIcon, href: "mailto:adityatallhari79@gmail.com", label: "Email" },
    { icon: LinkedinIcon, href: "https://www.linkedin.com/in/aditya-tallhari", label: "LinkedIn" },
    { icon: LeetcodeIcon, href: "https://leetcode.com/u/aditya_tallhari_", label: "LeetCode" },
    { icon: GithubIcon, href: "https://github.com/aditya-tallhari", label: "GitHub" },
    { icon: InstagramIcon, href: "https://www.instagram.com/aditya_tallare_", label: "Instagram" },
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
    <>
      {/* Hamburger Toggle Button (Mobile Only) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-10 left-6 sm:left-10 z-[60] lg:hidden flex items-center justify-center p-2.5 rounded-xl bg-[var(--bg-secondary)]/80 border border-[var(--border-primary)] shadow-md backdrop-blur-md focus:outline-none cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Toggle Social Menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between items-center relative">
          <span className={`w-full h-[2px] bg-[var(--text-primary)] rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-full h-[2px] bg-[var(--text-primary)] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-[2px] bg-[var(--text-primary)] rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </div>
      </button>
 
      {/* Sidebar Container */}
      <div className={`fixed left-0 top-0 bottom-0 w-24 flex flex-col items-center py-10 z-50 bg-[var(--bg-primary)]/95 border-r border-[var(--border-primary)]/10 backdrop-blur-md transition-transform duration-500 lg:translate-x-0 lg:bg-transparent lg:border-r-0 lg:backdrop-blur-none group/sidebar ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Branding */}
        <div className="mb-auto mt-14 lg:mt-0 relative">
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
              onClick={() => setIsOpen(false)}
              className="relative text-[var(--text-primary)] opacity-60 dark:opacity-30 transition-all block p-2 z-10 hover:opacity-100 hover:text-[var(--accent-primary)]"
              aria-label={social.label}
            >
              <social.icon size={28} className="relative z-10 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="relative w-[1px] h-32 invisible" />
      </div>
    </>
  );
};
