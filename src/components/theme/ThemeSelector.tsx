"use client";

import { useTheme, Theme } from "./ThemeProvider";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  onSelect?: (theme: Theme) => void;
}

export function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  const { theme: currentTheme, themes, setTheme, applyThemeColors, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const handleSelect = (theme: Theme) => {
    setTheme(theme);
    onSelect?.(theme);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {themes.map((theme) => {
        const isSelected = currentTheme?.slug === theme.slug;
        return (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme)}
            className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              isSelected
                ? "border-blue-500 ring-2 ring-blue-500/30"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <ThemePreview theme={theme} />
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs font-medium text-center truncate"
              style={{
                backgroundColor: theme.surfaceColor,
                color: theme.textColor,
              }}
            >
              {theme.name}
            </div>
            {isSelected && (
              <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                <Check size={12} className="text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      className="h-20 p-2"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Mini card preview */}
      <div
        className="h-full rounded p-1.5 flex flex-col gap-1"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
          borderWidth: 1,
        }}
      >
        {/* Header bar */}
        <div
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: theme.primaryColor }}
        />
        {/* Text lines */}
        <div
          className="h-1 w-full rounded-full opacity-80"
          style={{ backgroundColor: theme.textColor }}
        />
        <div
          className="h-1 w-3/4 rounded-full"
          style={{ backgroundColor: theme.textMutedColor }}
        />
        <div className="flex gap-1 mt-auto">
          <div
            className="h-1.5 w-4 rounded-full"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className="h-1.5 w-4 rounded-full"
            style={{ backgroundColor: theme.secondaryColor }}
          />
        </div>
      </div>
    </div>
  );
}
