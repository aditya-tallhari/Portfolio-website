"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVFS } from "@/lib/api";

interface TerminalScreenProps {
  onBack: () => void;
}

type LineType = "command" | "output" | "error" | "info" | "success" | "warning";

interface TerminalLineData {
  type: LineType;
  content: string;
  path?: string;
  timestamp: string;
}

const TerminalLine: React.FC<{ line: TerminalLineData }> = ({ line }) => {
  const getTextColor = () => {
    switch (line.type) {
      case "command": return "text-[#00D9FF]";
      case "error":   return "text-[#FF3D3D]";
      case "success": return "text-[#00FF41]";
      case "warning": return "text-[#FFD700]";
      case "info":    return "text-white/50";
      default:        return "text-[#00FF41]/80";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col mb-1 border-l border-white/5 pl-1"
    >
      <div className={`${getTextColor()} font-mono leading-tight whitespace-pre-wrap text-[4px]`}>
        {line.type === "command" && <span className="mr-0.5 opacity-50">$</span>}
        {line.content}
      </div>
    </motion.div>
  );
};

export const TerminalScreen: React.FC<TerminalScreenProps> = ({ onBack }) => {
  const [vfs, setVfs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TerminalLineData[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const [uptime, setUptime] = useState("0s");
  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);


  const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  const addLine = useCallback((content: string, type: LineType = "output", path?: string) => {
    setHistory(prev => [...prev, {
      content,
      type,
      path,
      timestamp: "" // Will be set on the client
    }].map(h => h.timestamp ? h : { ...h, timestamp: getTimestamp() }));
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Restore focus if clicked anywhere inside the terminal
      if (viewportRef.current?.contains(e.target as Node)) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    const loadVFS = async () => {
      try {
        const response = await fetchVFS();
        setVfs(response.data.vfs);
        addLine("INIT ADITYA_OS_KERNEL v1.0.4...", "info");
        addLine("ESTABLISHING ENCRYPTED LINK TO REMOTE_DB...", "info");
        addLine("VFS MOUNTED AT ROOT (/) SUCCESSFULLY.", "success");
        addLine("DETECTED PARTITIONS: /home/aditya, /bin, /etc, /var/log, /proc", "info");
        addLine("Welcome, Developer. Type 'help' for available procedures.", "info");
      } catch (error) {
        addLine("SYSTEM FAULT DETECTED: UNABLE TO REACH CORE SERVICE.", "error");
        addLine("TERMINAL OPERATING IN OFFLINE MODE.", "warning");
      } finally {
        setLoading(false);
      }
    };
    loadVFS();

    const startTime = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setUptime(`${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [addLine]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const fullCmd = cmd.trim();
    if (!fullCmd) return;

    setCommandHistory(prev => [fullCmd, ...prev].slice(0, 50));
    setHistoryIndex(-1);

    const args = fullCmd.split(" ");
    const trimmedCmd = args[0].toLowerCase();
    
    addLine(fullCmd, "command", `guest@aditya-os:${currentPath}`);

    if (trimmedCmd === "ls") {
      const contents = vfs ? vfs[currentPath] : null;
      if (contents) {
        if (typeof contents === "object" && !Array.isArray(contents)) {
          const items = Object.keys(contents).map(k => {
             const val = contents[k];
             return typeof val === "object" ? `[DIR]  ${k}/` : `[FILE] ${k}`;
          });
          addLine(items.join("\n"), "output");
        } else if (Array.isArray(contents)) {
          addLine(contents.map(i => `[EXEC] ${i}`).join("\n"), "output");
        }
      } else if (!vfs) {
          addLine("Offline mode: VFS strictly unavailable.", "error");
      } else {
        addLine("Error: Invalid directory mapping.", "error");
      }
    } else if (trimmedCmd === "cd") {
      const target = args[1] || "/";
      if (target === ".." || target === "../") {
         setCurrentPath("/");
         addLine("Returning to root level.", "info");
      } else if (vfs && (vfs[target] || vfs[`/${target}`])) {
         const newPath = target.startsWith("/") ? target : `/${target}`;
         setCurrentPath(newPath);
         addLine(`Navigated to ${newPath}`, "success");
      } else {
         addLine(`bash: cd: ${target}: No such directory`, "error");
      }
    } else if (trimmedCmd === "cat") {
      const fileName = args.slice(1).join(" ");
      if (!fileName) {
        addLine("usage: cat [file]", "warning");
      } else {
        const contents = vfs ? vfs[currentPath] : null;
        if (contents && contents[fileName] && typeof contents[fileName] === "string") {
           addLine(contents[fileName], "output");
        } else {
           addLine(`cat: ${fileName}: No such file recorded`, "error");
        }
      }
    } else if (trimmedCmd === "exec" || trimmedCmd === "run") {
      const fileName = args.slice(1).join(" ");
      if (!fileName) {
        addLine(`usage: ${trimmedCmd} [executable]`, "warning");
      } else {
        const contents = vfs ? vfs[currentPath] : null;
        const isExecutable = typeof contents === 'object' && Array.isArray(vfs['/bin']) && vfs['/bin'].includes(fileName);
        
        if (isExecutable || (Array.isArray(contents) && contents.includes(fileName))) {
           addLine(`EXECUTING ${fileName}...`, "success");
           addLine("Redirecting to PORTFOLIO_VIRTUAL_DISPLAY...", "info");
           setTimeout(() => {
              (window as any).__laptopSetNavigating?.();
              window.location.href = "/portfolio";
           }, 1000);
        } else {
           addLine(`${trimmedCmd}: ${fileName}: Permission denied or not an executable`, "error");
        }
      }
    } else if (trimmedCmd === "help") {
      addLine("MANIFEST PROCEDURES:", "info");
      addLine("  ls [target]   - Enumerate partition contents", "output");
      addLine("  cd [target]   - Mutate current working directory", "output");
      addLine("  cat [subject] - Output subject data stream (e.g. cat bio.md)", "output");
      addLine("  exec [file]   - Execute system binary (Tip: exec binaries in /bin)", "output");
      addLine("  clear         - Wipe terminal buffer", "output");
      addLine("  whoami        - Display identity profile", "output");
      addLine("  status        - Show system health metrics", "output");
      addLine("  exit          - Terminate session", "output");
    } else if (trimmedCmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (trimmedCmd === "whoami") {
      addLine("IDENTITY: ADITYA TALLHARI", "success");
      addLine("ROLE    : ELITE FULL STACK ARCHITECT", "info");
      addLine("LEVEL   : SENIOR_DEV_L4", "info");
    } else if (trimmedCmd === "status") {
      addLine("SYSTEM STATUS REPORT:", "info");
      addLine("  UPTIME : " + uptime, "success");
      addLine("  BUFFER : OPTIMAL", "success");
      addLine("  NETWORK: ENCRYPTED", "success");
      addLine("  ACCESS : GUEST_ROOT", "warning");
    } else if (trimmedCmd === "exit") {
      onBack();
      return;
    } else {
      addLine(`Command not recognized: '${trimmedCmd}'. Type 'help' for syntax.`, "error");
    }

    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={viewportRef}
      className="absolute inset-0 bg-black text-[#00FF41] font-mono overflow-hidden flex flex-col p-2 select-none"
    >
      {/* Minimal Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-2">
        <button 
          onClick={onBack} 
          className="text-[3px] uppercase font-black hover:text-white/80"
        >
          [ BACK ]
        </button>
        <span className="text-[3.5px] uppercase opacity-40 font-black tracking-tighter">ADITYA_TERMINAL // UPTIME: {uptime}</span>
      </div>

      {/* Terminal Viewport */}
      <div 
        className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar"
        style={{ 
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
        {history.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}
        {loading && (
          <div className="text-[#00FF41] text-[5px] animate-pulse">CONNECTING...</div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Section */}
      <div className="mt-1 border-t border-white/5 pt-1">
        <div className="flex items-center gap-1">
          <span className="text-[#00D9FF] font-black text-[4px]">guest:{currentPath}$</span>
          <input
            ref={inputRef}
            autoFocus
            className="bg-transparent border-none outline-none flex-1 text-[#00FF41] text-[4px] font-mono"
            spellCheck="false"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Ensure we don't trigger parent laptop handlers
              e.stopPropagation();
              
              if (e.key === "Enter") {
                (window as any).__playConsoleClick?.();
                handleCommand(input);
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const nextIndex = historyIndex + 1;
                if (nextIndex < commandHistory.length) {
                  setHistoryIndex(nextIndex);
                  setInput(commandHistory[nextIndex]);
                }
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const nextIndex = historyIndex - 1;
                if (nextIndex >= 0) {
                  setHistoryIndex(nextIndex);
                  setInput(commandHistory[nextIndex]);
                } else {
                  setHistoryIndex(-1);
                  setInput("");
                }
              }
              if (e.key === "Escape") {
                (window as any).__playConsoleClick?.();
                onBack();
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

