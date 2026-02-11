"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme, Theme, ThemeColors } from "./ThemeProvider";
import { RotateCcw, Save, X } from "lucide-react";

const colorFields: { key: keyof ThemeColors; label: string }[] = [
  { key: "primaryColor", label: "Primary" },
  { key: "secondaryColor", label: "Secondary" },
  { key: "backgroundColor", label: "Background" },
  { key: "surfaceColor", label: "Surface" },
  { key: "textColor", label: "Text" },
  { key: "textMutedColor", label: "Muted Text" },
  { key: "accentColor", label: "Accent" },
  { key: "borderColor", label: "Border" },
];

interface ThemeBuilderProps {
  onSave?: (customTheme: ThemeColors) => Promise<void>;
  onCancel?: () => void;
}

export function ThemeBuilder({ onSave, onCancel }: ThemeBuilderProps) {
  const { theme, themes, setTheme } = useTheme();
  const [colors, setColors] = useState<ThemeColors | null>(null);
  const [saving, setSaving] = useState(false);
  const [baseTheme, setBaseTheme] = useState<Theme | null>(null);
  const initialTheme = useRef<Theme | null>(null);

  // Initialize colors from current theme
  useEffect(() => {
    if (theme && !colors) {
      setColors({
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        backgroundColor: theme.backgroundColor,
        surfaceColor: theme.surfaceColor,
        textColor: theme.textColor,
        textMutedColor: theme.textMutedColor,
        accentColor: theme.accentColor,
        borderColor: theme.borderColor,
      });
      setBaseTheme(theme);
      initialTheme.current = theme;
    }
  }, [theme, colors]);

  if (!colors) return null;

  const updateColor = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    // Apply live preview
    setTheme({
      id: "custom",
      name: "Custom",
      slug: "custom",
      ...newColors,
    });
  };

  const resetToBase = () => {
    if (baseTheme) {
      setColors({
        primaryColor: baseTheme.primaryColor,
        secondaryColor: baseTheme.secondaryColor,
        backgroundColor: baseTheme.backgroundColor,
        surfaceColor: baseTheme.surfaceColor,
        textColor: baseTheme.textColor,
        textMutedColor: baseTheme.textMutedColor,
        accentColor: baseTheme.accentColor,
        borderColor: baseTheme.borderColor,
      });
      setTheme(baseTheme);
    }
  };

  const selectBaseTheme = (newBase: Theme) => {
    setBaseTheme(newBase);
    const newColors = {
      primaryColor: newBase.primaryColor,
      secondaryColor: newBase.secondaryColor,
      backgroundColor: newBase.backgroundColor,
      surfaceColor: newBase.surfaceColor,
      textColor: newBase.textColor,
      textMutedColor: newBase.textMutedColor,
      accentColor: newBase.accentColor,
      borderColor: newBase.borderColor,
    };
    setColors(newColors);
    setTheme(newBase);
  };

  const handleSave = async () => {
    if (!onSave || !colors) return;
    setSaving(true);
    try {
      await onSave(colors);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialTheme.current) {
      setTheme(initialTheme.current);
    }
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      {/* Base Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Start from theme
        </label>
        <select
          value={baseTheme?.slug || ""}
          onChange={(e) => {
            const selected = themes.find((t) => t.slug === e.target.value);
            if (selected) selectBaseTheme(selected);
          }}
          className="w-full px-3 py-2 border border-theme-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-surface text-theme-text"
        >
          {themes.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-4">
        {colorFields.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-theme-text mb-1">
              {label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="w-10 h-10 rounded border border-theme-border cursor-pointer"
              />
              <input
                type="text"
                value={colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="flex-1 px-2 py-1 border border-theme-border rounded text-sm font-mono bg-theme-surface text-theme-text"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-sm font-medium text-theme-text mb-2">
          Preview
        </label>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.backgroundColor }}
        >
          <div
            className="rounded-lg p-4 shadow-sm"
            style={{
              backgroundColor: colors.surfaceColor,
              borderColor: colors.borderColor,
              borderWidth: 1,
            }}
          >
            <h3
              className="font-bold mb-2"
              style={{ color: colors.textColor }}
            >
              Preview Card Title
            </h3>
            <p
              className="text-sm mb-3"
              style={{ color: colors.textMutedColor }}
            >
              This is how your content will look with the selected colors.
            </p>
            <div className="flex gap-2">
              <span
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: colors.primaryColor }}
              >
                Primary
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: colors.secondaryColor }}
              >
                Secondary
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: colors.accentColor }}
              >
                Accent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={resetToBase}
          className="flex items-center gap-2 px-4 py-2 border border-theme-border rounded-lg text-sm font-medium text-theme-text hover:bg-theme-bg"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        {onCancel && (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 border border-theme-border rounded-lg text-sm font-medium text-theme-text hover:bg-theme-bg"
          >
            <X size={16} />
            Cancel
          </button>
        )}
        {onSave && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Custom Theme"}
          </button>
        )}
      </div>
    </div>
  );
}
