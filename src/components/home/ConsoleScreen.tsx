"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MusicScreen } from "./MusicScreen";
import { TerminalScreen } from "./TerminalScreen";

// ─── TYPES ────────────────────────────────────────────────────────
export type MenuItem = "portfolio" | "terminal" | "resume" | "music";
export type ArrowKey = "up" | "down" | "left" | "right";

export const menuItems: MenuItem[] = ["portfolio", "terminal", "resume", "music"];

// ─── Typewriter Hook ───────────────────────────────────────────────
const useTypewriter = (
  texts: string[],
  speed = 70,
  waitTime = 1500,
  deleteSpeed = 40
) => {
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentText.slice(0, charIndex + 1));
          setCharIndex((p) => p + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), waitTime);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed((p) => p.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCharIndex(0);
        setTextIndex((p) => (p + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, displayed, isDeleting, textIndex, texts, speed, waitTime, deleteSpeed]);

  return displayed;
};

// ─── Grid navigation ─────────────────────────────────────────────
const MENU_GRID: MenuItem[][] = [
  ["portfolio", "terminal"],
  ["resume", "music"],
];

function getNextItem(current: MenuItem, dir: ArrowKey): MenuItem {
  for (let r = 0; r < MENU_GRID.length; r++) {
    const c = MENU_GRID[r].indexOf(current);
    if (c === -1) continue;
    if (dir === "right" && c + 1 < MENU_GRID[r].length)
      return MENU_GRID[r][c + 1];
    if (dir === "left" && c - 1 >= 0) return MENU_GRID[r][c - 1];
    if (dir === "down" && r + 1 < MENU_GRID.length)
      return MENU_GRID[r + 1][Math.min(c, MENU_GRID[r + 1].length - 1)];
    if (dir === "up" && r - 1 >= 0)
      return MENU_GRID[r - 1][Math.min(c, MENU_GRID[r - 1].length - 1)];
  }
  return current;
}

// ─── Scanline overlay ─────────────────────────────────────────────
const ScanlineOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-50 opacity-10"
    style={{
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 0.5px, rgba(0,0,0,0.1) 0.5px, rgba(0,0,0,0.1) 1px)",
    }}
  />
);

// ─── Speech Bubble ────────────────────────────────────────────────
const SpeechBubble = ({
  children,
  direction = "right",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
}) => (
  <div
    className={`relative bg-[#FFFCF0] text-[#1a1a2e] border-[1px] border-black shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] px-2 py-1 ${className}`}
    style={{ fontFamily: "'Courier New', Courier, monospace" }}
  >
    {children}
    {direction === "right" && (
      <>
        <div className="absolute -bottom-[4px] left-2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-black" />
        <div className="absolute -bottom-[2.5px] left-[2.2px] w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[3.5px] border-t-[#FFFCF0]" />
      </>
    )}
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────
const MainScreen: React.FC<{
  selectedItem: MenuItem;
  onItemSelect: (item: MenuItem) => void;
  onExecute: (item: MenuItem) => void;
}> = ({ selectedItem, onItemSelect, onExecute }) => {
  const typewriterText = useTypewriter(
    ["a developer", "Aditya Tallhari", "building cool stuff"],
    70,
    1500,
    40
  );

  const dialogueText =
    selectedItem === "music"
      ? "Hm..? Play a music?"
      : selectedItem === "terminal"
        ? "Open Terminal!"
        : null;

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
    >
      <Image
        src="/bg-image2.jpg"
        alt="background"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 900px"
        className="object-cover"
      />

      <div className="relative z-10 w-full h-full flex flex-col items-end justify-end gap-1 p-2 pb-3 pr-3">
        <SpeechBubble className="text-left min-w-[80px] max-w-[80px] min-h-[24px] border-[1px] shadow-[1px_1px_0_0_rgba(0,0,0,1)] px-1.5 py-1">
          <p className="text-[5px] font-black leading-tight tracking-tight">
            {dialogueText ?? (
              <>
                Hi! , I am{" "}
                <span className="text-[#c2410c]">
                  {typewriterText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </span>
              </>
            )}
          </p>
        </SpeechBubble>

        <SpeechBubble className="min-w-[90px] max-w-[100px] border-[1.5px] shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] px-2 py-0.5">
          <div className="absolute -top-1.5 left-2 bg-black text-white text-[3px] px-1 py-0.5 font-bold uppercase tracking-[0.2em]">
            Navigation
          </div>
          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 py-0.5">
            {menuItems.map((item) => (
              <span
                key={item}
                onClick={(e) => {
                  e.stopPropagation();
                  (window as any).__playConsoleClick?.();
                  onItemSelect(item);
                  onExecute(item);
                }}
                onMouseEnter={() => {
                  if (selectedItem !== item) {
                    (window as any).__playConsoleClick?.();
                    onItemSelect(item);
                  }
                }}
                className="group inline-flex cursor-pointer items-center gap-0.5 text-[4px] font-black uppercase tracking-[0.1em] py-0.5 px-1 hover:bg-black/5 rounded-sm transition-colors"
              >
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                  <AnimatePresence>
                    {selectedItem === item && (
                      <motion.span
                        initial={{ x: -2, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -2, opacity: 0 }}
                        className="text-[#1a1a2e] text-[4px]"
                      >
                        ▶
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={
                    selectedItem === item
                      ? "text-[#1a1a2e] underline underline-offset-1 decoration-[1px]"
                      : "text-[#1a1a2e]/40 group-hover:text-[#1a1a2e]"
                  }
                >
                  {item}
                </span>
              </span>
            ))}
          </div>
        </SpeechBubble>
      </div>
    </motion.div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────
export const ConsoleScreen = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem>("portfolio");
  const [activeScreen, setActiveScreen] = useState<"main" | "music" | "terminal">("main");
  const router = useRouter();

  const handleArrowNav = useCallback((dir: ArrowKey) => {
    if (activeScreen !== "main") return;
    setSelectedItem((current) => getNextItem(current, dir));
  }, [activeScreen]);

  const executeItem = useCallback((item: MenuItem) => {
    if (activeScreen !== "main") return;
    
    if (item === "music") {
      setActiveScreen("music");
    } else if (item === "terminal") {
      setActiveScreen("terminal");
    } else if (item === "portfolio") {
      (window as any).__laptopSetNavigating?.();
      router.push("/portfolio");
    } else if (item === "resume") {
      window.open("/Aditya_Tallhari_Resume.pdf", "_blank");
    }
  }, [activeScreen, router]);

  const handleAction = useCallback(
    (action: "select" | "back") => {
      if (action === "back") {
        setActiveScreen("main");
        return;
      }

      if (action === "select") {
        executeItem(selectedItem);
      }
    },
    [selectedItem, executeItem]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isNavKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Backspace"].includes(e.key);
      if (isNavKey) (window as any).__playConsoleClick?.();

      if (e.key === "ArrowUp") handleArrowNav("up");
      if (e.key === "ArrowDown") handleArrowNav("down");
      if (e.key === "ArrowLeft") handleArrowNav("left");
      if (e.key === "ArrowRight") handleArrowNav("right");
      if (e.key === "Enter") handleAction("select");
      if (e.key === "Backspace" && activeScreen === "main") handleAction("back");
    };

    window.addEventListener("keydown", handleKeyDown);
    (window as any).__consoleHandleArrow = handleArrowNav;
    (window as any).__consoleHandleAction = handleAction;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      delete (window as any).__consoleHandleArrow;
      delete (window as any).__consoleHandleAction;
    };
  }, [handleArrowNav, handleAction, activeScreen]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black z-10">
      <AnimatePresence mode="wait">
        {activeScreen === "main" ? (
          <MainScreen
            key="main"
            selectedItem={selectedItem}
            onItemSelect={setSelectedItem}
            onExecute={(item) => executeItem(item)}
          />
        ) : activeScreen === "music" ? (
          <MusicScreen key="music" onBack={() => setActiveScreen("main")} />
        ) : (
          <TerminalScreen key="terminal" onBack={() => setActiveScreen("main")} />
        )}
      </AnimatePresence>
      <ScanlineOverlay />
    </div>
  );
};
