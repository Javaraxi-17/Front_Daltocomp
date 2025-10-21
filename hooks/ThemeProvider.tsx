import React, { createContext, useContext, useMemo, useState } from 'react';

type Theme = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    primary: string;
    danger: string;
    card: string;
    inputBorder: string;
  };
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => setIsDark((s) => !s);

  const colors = useMemo(() => {
    if (isDark) {
      return {
        background: '#000000',
        surface: '#0b0b0b',
        text: '#ffffff',
        mutedText: '#c4c4c4',
        primary: '#2563eb',
        danger: '#ef4444',
        card: '#0f1724',
        inputBorder: '#212121',
      };
    }

    return {
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      mutedText: '#475569',
      primary: '#2563eb',
      danger: '#ef4444',
      card: '#ffffff',
      inputBorder: '#e2e8f0',
    };
  }, [isDark]);

  const value = useMemo(() => ({ isDark, toggleTheme, colors }), [isDark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}