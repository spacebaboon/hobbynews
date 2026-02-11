"use client";

import { useState, useEffect } from "react";
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
  onSave?: (customTheme: ThemeColors & { name: string }) => Promise<void>;
}

interface ColorPickerModalProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

function ColorPickerModal({ label, value, onSave, onCancel }: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Edit {label}</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <input
              type="color"
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              className="w-32 h-32 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Hex Value</label>
            <input
              type="text"
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>

          <div
            className="h-12 rounded-lg border border-gray-200"
            style={{ backgroundColor: tempColor }}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(tempColor)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function ThemeBuilder({ onSave }: ThemeBuilderProps) {
  const { theme, themes, setTheme, applyThemeColors } = useTheme();
  const [colors, setColors] = useState<ThemeColors | null>(null);
  const [themeName, setThemeName] = useState("My Custom Theme");
  const [saving, setSaving] = useState(false);
  const [baseTheme, setBaseTheme] = useState<Theme | null>(null);
  const [editingColor, setEditingColor] = useState<{ key: keyof ThemeColors; label: string } | null>(null);

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
      if (theme.slug === "custom") {
        setThemeName(theme.name);
      }
    }
  }, [theme, colors]);

  if (!colors) return null;

  const updateColor = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    // Apply live preview without saving
    applyThemeColors(newColors);
  };

  const resetToBase = () => {
    if (baseTheme) {
      const baseColors = {
        primaryColor: baseTheme.primaryColor,
        secondaryColor: baseTheme.secondaryColor,
        backgroundColor: baseTheme.backgroundColor,
        surfaceColor: baseTheme.surfaceColor,
        textColor: baseTheme.textColor,
        textMutedColor: baseTheme.textMutedColor,
        accentColor: baseTheme.accentColor,
        borderColor: baseTheme.borderColor,
      };
      setColors(baseColors);
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
    if (!colors) return;

    // Save as custom theme
    const customTheme: Theme = {
      id: "custom",
      name: themeName || "Custom Theme",
      slug: "custom",
      ...colors,
    };
    setTheme(customTheme);

    if (onSave) {
      setSaving(true);
      try {
        await onSave({ ...colors, name: themeName });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleColorPickerSave = (value: string) => {
    if (editingColor) {
      updateColor(editingColor.key, value);
      setEditingColor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme Name
        </label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          placeholder="My Custom Theme"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Base Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start from theme
        </label>
        <select
          value={baseTheme?.slug || ""}
          onChange={(e) => {
            const selected = themes.find((t) => t.slug === e.target.value);
            if (selected) selectBaseTheme(selected);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {themes.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Color Pickers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colors
        </label>
        <div className="grid grid-cols-2 gap-3">
          {colorFields.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setEditingColor({ key, label })}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
            >
              <div
                className="w-8 h-8 rounded-lg border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: colors[key] }}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500 font-mono truncate">{colors[key]}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Theme"}
        </button>
      </div>

      {/* Color Picker Modal */}
      {editingColor && (
        <ColorPickerModal
          label={editingColor.label}
          value={colors[editingColor.key]}
          onSave={handleColorPickerSave}
          onCancel={() => setEditingColor(null)}
        />
      )}
    </div>
  );
}
