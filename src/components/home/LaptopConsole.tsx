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
        {/* ── BASE AND KEYBOARD (SVG BACKGROUND) ── */}
        <g id="laptop-base">
          {/* Base structure */}
          <linearGradient id="base-grad" gradientUnits="userSpaceOnUse" x1="130.5053" y1="134.4774" x2="130.5053" y2="203.2668">
            <stop offset="0" style={{ stopColor: "#D9D9D9" }} />
            <stop offset="0.5" style={{ stopColor: "#4F4F4F" }} />
            <stop offset="1" style={{ stopColor: "#000000" }} />
          </linearGradient>
          <path fill="url(#base-grad)" d="M237.393,169.921c-1.78-1.219-5.49-1.682-5.49-1.682h-15.065h-78.798h-0.001h-15.065l0,0H44.175H29.11c0,0-3.711,0.463-5.492,1.682L4.217,182.782l2.382,3.249c0.58,0.551,1.181,1.261,2.18,1.261h15.066h60.842h30.795h30.048h30.797h60.842h15.064c0.999,0,1.601-0.71,2.18-1.261l2.382-3.249L237.393,169.921z" />
          
          <linearGradient id="base-edge" gradientUnits="userSpaceOnUse" x1="130.5067" y1="159.5566" x2="130.5067" y2="196.4097">
            <stop offset="0" style={{ stopColor: "#D9D9D9" }} />
            <stop offset="1" style={{ stopColor: "#000000" }} />
          </linearGradient>
          <path fill="url(#base-edge)" d="M257.076,182.095c0.02-0.151,0.022-0.304,0-0.457v-4.458l-17.532-12.759c-1.954-1.338-6.026-1.847-6.026-1.847H130.506l0,0H27.494c0,0-4.071,0.509-6.026,1.847L3.942,177.232v4.361c-0.027,0.185-0.027,0.368,0,0.551v0.003h0.002c0.083,0.512,0.424,0.994,1.238,1.338h150.078h33.798h66.771c0.837-0.354,1.173-0.85,1.245-1.375h0.001V182.095z" />

          {/* Power Button Simulation Area (Top right of keyboard) */}
          <g className="cursor-pointer" onClick={togglePower}>
            <polygon fill={isPowerOn ? "#c2410c" : "#404040"} points="208.101,161.96 206.68,160.069 197.204,160.069 198.448,161.96" />
          </g>

          {/* Trackpad area */}
          <polygon fill="#333" points="176.046,170.634 84.639,170.634 81.376,175.428 179.143,175.428" opacity="0.5" />
        </g>

        {/* ── LID AND SCREEN (REACTIVE GROUP) ── */}
        <g id="laptop-lid" ref={lidRef}>
          {/* Outer Lid Frame */}
          <linearGradient id="lid-grad" gradientUnits="userSpaceOnUse" x1="130.5058" y1="-17.9674" x2="130.5058" y2="181.5536">
            <stop offset="0" style={{ stopColor: "#333333" }} />
            <stop offset="0.5" style={{ stopColor: "#575757" }} />
            <stop offset="1" style={{ stopColor: "#111" }} />
          </linearGradient>
          <path fill="url(#lid-grad)" d="M240.458,152.208V83.544v-6.45V8.428c0,0,0.057-5.576-5.637-5.576h-27.697h-16.547H26.191c-5.692,0-5.638,5.576-5.638,5.576v68.666v6.45v68.664c0,0-0.055,5.575,5.638,5.575h164.386h5.16h39.084C240.515,157.783,240.458,152.208,240.458,152.208z" />
          
          <path fill="#0a0a0a" d="M238.685,150.367V83.461v-6.283V10.271c0,0,0.056-5.434-5.547-5.434h-27.25h-16.281H27.873c-5.601,0-5.546,5.434-5.546,5.434v66.907v6.283v66.906c0,0-0.055,5.432,5.546,5.432h161.734h5.077h38.454C238.741,155.799,238.685,150.367,238.685,150.367z" />

          {/* Embedded Screen via foreignObject */}
          <foreignObject
            x="26.835"
            y="11.044"
            width="207.344"
            height="138.547"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
               <AnimatePresence>
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

          {/* Screen Glare (from SVG) */}
          <path style={{ opacity: 0.05, fill: "#FFFFFF" }} pointerEvents="none" d="M191.121,4.814l-40.555,0.208L110.013,5.11L69.459,5.196L28.905,5.121h-0.008l-0.022-0.002c-1.389-0.09-2.892,0.16-4.056,0.926c-1.191,0.754-1.834,2.125-1.941,3.539c-0.072,2.902-0.025,5.886-0.045,8.825l-0.018,17.697l-0.037,35.396l-0.193,70.791l-0.193-70.791l-0.037-35.396l-0.02-17.697c0.014-2.959-0.039-5.878,0.025-8.871c0.068-0.758,0.246-1.525,0.608-2.219c0.359-0.693,0.899-1.297,1.55-1.727c1.317-0.862,2.883-1.126,4.417-1.037l-0.029-0.003l40.554-0.086l40.554,0.075l40.554,0.078L191.121,4.814z"/>
        </g>
      </svg>
    </div>
  );
};
