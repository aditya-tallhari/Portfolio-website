"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useColorMode, ColorMode } from "@/hooks/useColorMode";

interface ColorModeContextType {
  mode: ColorMode;
  toggleMode: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const colorMode = useColorMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ColorModeProvider");
  }
  return context;
};
