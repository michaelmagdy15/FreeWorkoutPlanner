'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'coral' | 'pink' | 'emerald' | 'sky' | 'babyblue';

export interface ThemeValues {
  primary: string;       // HSL values without brackets
  secondary: string;     // HSL values without brackets
  ring: string;          // HSL values without brackets
  name: string;          // User-friendly name
}

export const themes: Record<ThemeName, ThemeValues> = {
  coral: {
    primary: '12 100% 63%',
    secondary: '262 83% 62%',
    ring: '12 100% 63%',
    name: 'Neon Coral (Original)',
  },
  pink: {
    primary: '330 100% 71%',
    secondary: '280 80% 60%',
    ring: '330 100% 71%',
    name: 'Sleek Pink',
  },
  emerald: {
    primary: '142 76% 45%',
    secondary: '174 75% 39%',
    ring: '142 76% 45%',
    name: 'Emerald Overload',
  },
  sky: {
    primary: '200 95% 55%',
    secondary: '220 90% 50%',
    ring: '200 95% 55%',
    name: 'Deep Blue Sky',
  },
  babyblue: {
    primary: '198 93% 68%',
    secondary: '210 75% 55%',
    ring: '198 93% 68%',
    name: 'Baby Blue (Mirna)',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: { id: ThemeName; name: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('babyblue');

  // Load theme preference and boot PWA service workers on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('fwp-theme-color') as ThemeName;
    const active = savedTheme && themes[savedTheme] ? savedTheme : 'babyblue';
    setThemeState(active);
    applyTheme(active);

    // Register PWA Service Worker for local caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('🚀 [PWA] Service Worker registered successfully:', reg.scope))
          .catch((err) => console.error('❌ [PWA] Service Worker registration failed:', err));
      });
    }
  }, []);


  const applyTheme = (themeName: ThemeName) => {
    const root = document.documentElement;
    const selection = themes[themeName];
    if (selection) {
      root.style.setProperty('--primary', selection.primary);
      root.style.setProperty('--secondary', selection.secondary);
      root.style.setProperty('--ring', selection.ring);
    }
  };

  const setTheme = (themeName: ThemeName) => {
    if (themes[themeName]) {
      setThemeState(themeName);
      localStorage.setItem('fwp-theme-color', themeName);
      applyTheme(themeName);

      // Sync color setting to DB asynchronously if dynamic user profile endpoints are available
      fetch('/api/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'default-user', themeColor: themeName }),
      }).catch((err) => console.log('Theme sync to backend deferred:', err));
    }
  };

  const availableThemes = Object.entries(themes).map(([key, val]) => ({
    id: key as ThemeName,
    name: val.name,
  }));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
