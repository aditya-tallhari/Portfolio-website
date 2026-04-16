'use client';

import { useState, useEffect, useCallback } from 'react';

export const themeConfig = {
  dark: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#0A1929',
    '--text-primary': '#ffffff',
    '--text-secondary': '#A89968',
    '--accent-primary': '#D4AF37', // Gold
    '--accent-secondary': '#0A1929', // Navy
    '--border-primary': 'rgba(212, 175, 55, 0.2)', // Soft Gold/Navy border
    '--accent-glow': 'rgba(212, 175, 55, 0.15)', // Gold Glow
    '--card-bg': 'rgba(10, 25, 41, 0.6)', // Deep Navy card
    '--muted-text': 'rgba(168, 153, 104, 0.6)',
  },
  light: {
    '--bg-primary': '#fdfdfd',
    '--bg-secondary': '#f4f4f4',
    '--text-primary': '#0A1929',
    '--text-secondary': '#666666',
    '--accent-primary': '#D4AF37', // Gold remains Gold
    '--accent-secondary': '#E0E0E0', 
    '--border-primary': 'rgba(10, 25, 41, 0.1)',
    '--accent-glow': 'rgba(212, 175, 55, 0.1)',
    '--card-bg': 'rgba(10, 25, 41, 0.03)',
    '--muted-text': 'rgba(10, 25, 41, 0.5)',
  }
};

export const useToggle = () => {
  const [isLight, setIsLight] = useState(false);

  const applyColors = useCallback((mode: 'light' | 'dark') => {
    const root = document.documentElement;
    const colors = themeConfig[mode];
    
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    root.classList.toggle('light', mode === 'light');
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'light') {
      setIsLight(true);
      applyColors('light');
    } else {
      applyColors('dark');
    }
  }, [applyColors]);

  const toggle = () => {
    const nextMode = !isLight ? 'light' : 'dark';
    setIsLight(!isLight);
    localStorage.setItem('site-theme', nextMode);
    applyColors(nextMode);
  };

  return { isLight, toggle, colors: themeConfig[isLight ? 'light' : 'dark'] };
};
