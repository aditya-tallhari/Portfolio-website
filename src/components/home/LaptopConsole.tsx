"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type ArrowKey = "up" | "down" | "left" | "right";

interface LaptopConsoleProps {
  children: React.ReactNode;
  onArrowKeyPress?: (key: ArrowKey) => void;
  onActionExecute?: (action: "select" | "back") => void;
}

export const LaptopConsole: React.FC<LaptopConsoleProps> = ({
  children,
  onArrowKeyPress,
  onActionExecute,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const lidRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for Lid Opening/Closing
  useGSAP(() => {
    if (lidRef.current) {
      gsap.to(lidRef.current, {
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 20,
        duration: 0.8,
        ease: "expo.out",
      });
    }
  }, [isOpen]);

  const togglePower = useCallback(() => {
    setIsPowerOn(!isPowerOn);
  }, [isPowerOn]);

  // ── SOUND ENGINE ───────────────────────────────────────────────
  const playClick = useCallback(() => {
    const audio = new Audio('/sfx/click.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPowerOn) {
        if (e.key === "Enter") {
          playClick();
          togglePower();
        }
        return;
      }

      // If user is typing in an input/textarea, don't trigger global console actions
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput && (e.key === "Backspace" || e.key === "Enter" || e.key.startsWith("Arrow"))) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":    playClick(); onArrowKeyPress?.("up"); break;
        case "ArrowDown":  playClick(); onArrowKeyPress?.("down"); break;
        case "ArrowLeft":  playClick(); onArrowKeyPress?.("left"); break;
        case "ArrowRight": playClick(); onArrowKeyPress?.("right"); break;
        case "Enter":      playClick(); onActionExecute?.("select"); break;
        case "Backspace":  playClick(); onActionExecute?.("back"); break;
        case "Escape":     playClick(); setIsPowerOn(false); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPowerOn, onArrowKeyPress, onActionExecute, togglePower, playClick]);

  // Handle window methods for child components to trigger sounds
  useEffect(() => {
    (window as any).__playConsoleClick = playClick;
    return () => { delete (window as any).__playConsoleClick; };
  }, [playClick]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[900px] mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 261.012 190.145"
        className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="power-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="webcam-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── FULL LAPTOP VECTOR (CHASSIS, FULL KEYBOARD, TRACKPAD & BEZEL) ── */}
        <image
          href="/laptop.svg"
          xlinkHref="/laptop.svg"
          x="0"
          y="0"
          width="261.012"
          height="190.145"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ── LID AND SCREEN (REACTIVE GROUP) ── */}
        <g id="laptop-lid" ref={lidRef}>
          {/* Embedded Screen via foreignObject */}
          <foreignObject
            x="26.835"
            y="11.044"
            width="207.344"
            height="138.547"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
               <AnimatePresence mode="wait">
                  {isPowerOn ? (
                    <motion.div
                      key="screen-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      {children}
                    </motion.div>
                  ) : (
                    <div key="off-black" className="w-full h-full bg-black flex items-center justify-center p-8 text-center cursor-pointer" onClick={togglePower}>
                       <span className="text-white/20 text-[6px] uppercase tracking-widest font-bold">Press Power Button to Start</span>
                    </div>
                  )}
               </AnimatePresence>
            </div>
          </foreignObject>

          {/* ── REALISTIC WEBCAM & SENSORS MODULE (TOP BEZEL CENTER) ── */}
          <g id="laptop-webcam" className="pointer-events-none select-none">
            {/* Sleek Camera Bezel Housing Pill */}
            <rect
              x="122.5"
              y="5.4"
              width="16"
              height="3.3"
              rx="1.65"
              fill="#0a0a0e"
              stroke="#1f1f26"
              strokeWidth="0.15"
            />

            {/* Left Microphone Pinhole */}
            <circle cx="125.2" cy="7.05" r="0.28" fill="#030303" stroke="#18181b" strokeWidth="0.06" />

            {/* Ambient Light Sensor */}
            <circle cx="127.8" cy="7.05" r="0.32" fill="#060810" stroke="#18181b" strokeWidth="0.06" />

            {/* Center Camera Outer Metal Ring */}
            <circle cx="130.5" cy="7.05" r="1.1" fill="#08080c" stroke="#27272a" strokeWidth="0.12" />

            {/* Deep Optical Glass Lens */}
            <circle cx="130.5" cy="7.05" r="0.68" fill="#0b132b" />
            
            {/* Inner Aperture */}
            <circle cx="130.5" cy="7.05" r="0.36" fill="#020617" />

            {/* Glass Specular Glint Highlight */}
            <circle cx="130.32" cy="6.88" r="0.16" fill="#93c5fd" opacity="0.9" />

            {/* Camera Status Green LED Indicator */}
            <circle
              cx="133.4"
              cy="7.05"
              r="0.34"
              fill={isPowerOn ? "#22c55e" : "#0f2316"}
              opacity={isPowerOn ? 1 : 0.4}
              filter={isPowerOn ? "url(#webcam-glow)" : undefined}
              className="transition-all duration-300"
            />
            {isPowerOn && (
              <circle cx="133.4" cy="7.05" r="0.12" fill="#bbf7d0" />
            )}

            {/* Right Microphone Pinhole */}
            <circle cx="135.8" cy="7.05" r="0.28" fill="#030303" stroke="#18181b" strokeWidth="0.06" />
          </g>



          {/* Interactive Power Button (Top right of keyboard) */}
          <g
            className="cursor-pointer group"
            onClick={togglePower}
          >
            {/* Tactile Keycap Surface */}
            <polygon
              points="208.101,161.96 206.68,160.069 197.204,160.069 198.448,161.96"
              fill={isPowerOn ? "#dc2626" : "#1e1e1e"}
              stroke={isPowerOn ? "#f87171" : "#ef4444"}
              strokeWidth={isPowerOn ? "0.3" : "0.4"}
              className="transition-colors duration-200 group-hover:brightness-125"
            />

            {/* Standby / Active Center Power LED */}
            <circle
              cx="202.608"
              cy="161.014"
              r="0.5"
              fill={isPowerOn ? "#ffffff" : "#ef4444"}
              filter={isPowerOn ? "url(#power-glow)" : undefined}
              className="transition-all duration-200"
            />

            {/* Power Ring Arc */}
            <circle
              cx="202.608"
              cy="161.014"
              r="0.8"
              fill="none"
              stroke={isPowerOn ? "#fecaca" : "#ef4444"}
              strokeWidth="0.16"
              strokeDasharray="3.2, 1"
              opacity={isPowerOn ? 0.95 : 0.8}
            />

            <title>{isPowerOn ? "Turn off laptop (ESC)" : "Turn on laptop (ENTER)"}</title>
          </g>
        </g>
      </svg>
    </div>
  );
};
