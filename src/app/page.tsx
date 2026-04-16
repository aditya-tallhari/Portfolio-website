"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { LaptopConsole, ArrowKey } from "@/components/home/LaptopConsole";
import { ConsoleScreen } from "@/components/home/ConsoleScreen";
import { SocialSidebar } from "@/components/layout/SocialSidebar";
import { BackgroundNoise } from "@/components/layout/BackgroundEffects";
import { GridPattern } from "@/components/ui/GridPattern";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

// ─── COMPONENTS FOR HUD ──────────────────────────────────────────

const ScanningLine = () => {
  const lineRef = useRef(null);
  useGSAP(() => {
    gsap.to(lineRef.current, {
      y: "100vh",
      duration: 8,
      repeat: -1,
      ease: "none",
    });
  });
  return (
    <div
      ref={lineRef}
      className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent z-[5] pointer-events-none opacity-50 dark:opacity-30"
    />
  );
};

const ParallaxBackgroundText = () => {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useGSAP(() => {
    gsap.to(text1Ref.current, {
      x: -30,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
    gsap.to(text2Ref.current, {
      x: 30,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  });

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none flex flex-col justify-center items-center gap-48 pt-20">
      <div
        ref={text1Ref}
        className="text-[14rem] font-jetbrains font-black opacity-[0.08] dark:opacity-[0.04] uppercase tracking-tighter mix-blend-multiply dark:mix-blend-overlay whitespace-nowrap leading-none"
        style={{ WebkitTextStroke: "1.5px var(--text-primary)" }}
      >
        ADITYA TALLHARI
      </div>
      <div
        ref={text2Ref}
        className="text-[14rem] font-jetbrains font-black opacity-[0.08] dark:opacity-[0.04] uppercase tracking-tighter mix-blend-multiply dark:mix-blend-overlay whitespace-nowrap leading-none"
        style={{ WebkitTextStroke: "1.5px var(--text-primary)" }}
      >
        MERN STACK
      </div>
    </div>
  );
};

const StatusTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = [
    "> [SYSTEM_STATUS: OPTIMIZED]",
    "> [ASSETS_LOADED: 100%]",
    "> [LATENCY: 24ms]",
    "> [NEXWAVE_DEPLOYED: ACTIVE]",
    "> [UI_SHELL: STABLE]",
    "> [CORE_INIT: SUCCESS]",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-3), allLogs[i]]);
      i = (i + 1) % allLogs.length;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-32 z-50 p-2 font-jetbrains text-[10px] text-[var(--accent-primary)] w-56 overflow-hidden">
      <div className="flex items-center gap-2 mb-2 bg-[var(--text-primary)]/5 p-1 px-2 rounded w-max">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
        <span className="uppercase tracking-widest text-[7px] font-bold text-[var(--text-primary)] opacity-70">Live Status Log</span>
      </div>
      <div className="space-y-1 pl-1">
        {logs.map((log, idx) => (
          <div key={idx} className="whitespace-nowrap overflow-hidden border-r-2 border-[var(--accent-primary)]/40 animate-typing text-[var(--text-primary)] font-medium">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

import { useTheme } from "@/providers/ColorModeProvider";

const ThemeToggle = () => {
  const { mode, toggleMode, isDark } = useTheme();
  
  return (
    <div 
      onClick={toggleMode}
      className="fixed top-10 right-10 z-50 flex items-center gap-3 px-4 py-2 cursor-pointer transition-all group"
    >
      <div className="relative w-3 h-3">
         <motion.div
          animate={{ 
            scale: isDark ? [1, 1.2, 1] : 1,
            rotate: isDark ? 0 : 180 
          }}
          transition={{ duration: 0.5 }}
          className={`w-full h-full rounded-full ${isDark ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]'}`}
        />
      </div>
      <span className="font-jetbrains text-[9px] font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase group-hover:text-[var(--accent-primary)] transition-colors">
        {isDark ? "Dark Protocol" : "Light System"}
      </span>
    </div>
  );
};

const QuickMetricsBento = () => {
  const metrics = [
    { label: "EXPERIENCE", val: "2+ YRS" },
    { label: "PROJECTS", val: "10+ OPS" },
    { label: "AVAILABILITY", val: "100%" },
  ];
  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-10">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          whileHover={{ scale: 1.1, x: -10 }}
          className="group relative flex flex-col items-end cursor-pointer"
        >
          <span className="text-[7px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
            {m.label}
          </span>
          <span className="text-[14px] font-black leading-none text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors tabular-nums">
            {m.val}
          </span>
          <div className="absolute -right-3 top-0 bottom-0 w-[2px] bg-[var(--text-primary)]/10 group-hover:bg-[var(--accent-primary)] transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── MAIN HOME PAGE ───────────────────────────────────────────────

export default function Home() {
  const handleArrowPress = useCallback((key: ArrowKey) => {
    (window as any).__consoleHandleArrow?.(key);
  }, []);

  const handleAction = useCallback((action: "select" | "back") => {
    (window as any).__consoleHandleAction?.(action);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden flex items-center justify-center p-4 selection:bg-[var(--accent-primary)] selection:text-white transition-colors duration-500">
      <BackgroundNoise />
      <GridPattern
        width={60}
        height={60}
        strokeDasharray="4 2"
        className="opacity-40 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
      />
      
      {/* ── CINEMATIC HUD LAYERS ── */}
      <ScanningLine />
      <ParallaxBackgroundText />
      <StatusTerminal />
      <ThemeToggle />
      <QuickMetricsBento />
      
      <SocialSidebar />

      <main className="relative z-10 w-full flex items-center justify-center lg:pl-24 overflow-visible">
        <div className="w-full max-w-4xl px-8">
          <LaptopConsole
            onArrowKeyPress={handleArrowPress}
            onActionExecute={handleAction}
          >
            <ConsoleScreen />
          </LaptopConsole>
        </div>
      </main>
    </div>
  );
}
