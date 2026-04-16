"use client";

import { useState, useEffect, useCallback } from "react";

export type ColorMode = "light" | "dark";

export interface ColorModeContextType {
  mode: ColorMode;
  toggleMode: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const useColorMode = () => {
  const [mode, setMode] = useState<ColorMode>("light");

  // Initialize theme
  useEffect(() => {
    const savedMode = localStorage.getItem("portfolio-color-mode") as ColorMode | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialMode = savedMode || (systemPrefersDark ? "dark" : "light");
    setMode(initialMode);
    document.documentElement.setAttribute("data-color-mode", initialMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("portfolio-color-mode", newMode);
      document.documentElement.setAttribute("data-color-mode", newMode);
      
      // Emit custom event for non-react subscribers
      window.dispatchEvent(new CustomEvent("colorModeChange", { detail: { mode: newMode } }));
      
      return newMode;
    });
  }, []);

  return {
    mode,
    toggleMode,
    isDark: mode === "dark",
    isLight: mode === "light",
  };
};
