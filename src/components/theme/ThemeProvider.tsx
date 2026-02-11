"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  accentColor: string;
  borderColor: string;
}

export interface Theme extends ThemeColors {
  id: string;
  name: string;
  slug: string;
}

interface ThemeContextValue {
  theme: Theme | null;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "hobbynews-theme";

const defaultTheme: Theme = {
  id: "default",
  name: "Light",
  slug: "light",
  primaryColor: "#3b82f6",
  secondaryColor: "#6366f1",
  backgroundColor: "#f3f4f6",
  surfaceColor: "#ffffff",
  textColor: "#111827",
  textMutedColor: "#6b7280",
  accentColor: "#8b5cf6",
  borderColor: "#e5e7eb",
};

function applyThemeToDOM(theme: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primaryColor);
  root.style.setProperty("--color-secondary", theme.secondaryColor);
  root.style.setProperty("--color-background", theme.backgroundColor);
  root.style.setProperty("--color-surface", theme.surfaceColor);
  root.style.setProperty("--color-text", theme.textColor);
  root.style.setProperty("--color-text-muted", theme.textMutedColor);
  root.style.setProperty("--color-accent", theme.accentColor);
  root.style.setProperty("--color-border", theme.borderColor);

  // Determine if dark mode based on background luminance
  const rgb = hexToRgb(theme.backgroundColor);
  const luminance = rgb
    ? (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    : 1;
  root.style.setProperty("color-scheme", luminance < 0.5 ? "dark" : "light");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load themes from API
  useEffect(() => {
    fetch("/api/themes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setThemes(data);
        }
      })
      .catch(console.error);
  }, []);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setThemeState(parsed);
        applyThemeToDOM(parsed);
      } catch {
        applyThemeToDOM(defaultTheme);
      }
    } else {
      applyThemeToDOM(defaultTheme);
    }
    setIsLoading(false);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: theme ?? defaultTheme, themes, setTheme, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
