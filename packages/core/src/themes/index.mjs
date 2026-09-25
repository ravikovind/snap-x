/**
 * Built-in themes for snap-x.
 * Each theme defines: bg, surface, text, textMuted, accent, accentMuted,
 * borderColor, fontDisplay, fontMono.
 */

export const themes = {
  /** Dark tech — pure black bg, electric accent (default) */
  dark: {
    bg: "#000000",
    surface: "#111111",
    text: "rgba(255,255,255,0.95)",
    textMuted: "rgba(255,255,255,0.50)",
    accent: "#eb1d25",
    accentMuted: "rgba(235,29,37,0.35)",
    borderColor: "rgba(255,255,255,0.10)",
    borderAccent: "rgba(235,29,37,0.25)",
    fontDisplay: "Inter",
    fontMono: "JetBrains Mono",
  },

  /** Clean light — white bg, dark text, subtle accent */
  light: {
    bg: "#ffffff",
    surface: "#f8f8f8",
    text: "rgba(0,0,0,0.90)",
    textMuted: "rgba(0,0,0,0.45)",
    accent: "#2563eb",
    accentMuted: "rgba(37,99,235,0.15)",
    borderColor: "rgba(0,0,0,0.08)",
    borderAccent: "rgba(37,99,235,0.30)",
    fontDisplay: "Inter",
    fontMono: "JetBrains Mono",
  },

  /** Midnight — deep navy, soft cyan accent */
  midnight: {
    bg: "#0a0f1e",
    surface: "#111827",
    text: "rgba(255,255,255,0.92)",
    textMuted: "rgba(255,255,255,0.45)",
    accent: "#38bdf8",
    accentMuted: "rgba(56,189,248,0.25)",
    borderColor: "rgba(255,255,255,0.08)",
    borderAccent: "rgba(56,189,248,0.30)",
    fontDisplay: "Inter",
    fontMono: "JetBrains Mono",
  },

  /** Forest — dark green, warm amber accent */
  forest: {
    bg: "#0d1a0f",
    surface: "#152318",
    text: "rgba(255,255,255,0.92)",
    textMuted: "rgba(255,255,255,0.45)",
    accent: "#f59e0b",
    accentMuted: "rgba(245,158,11,0.25)",
    borderColor: "rgba(255,255,255,0.08)",
    borderAccent: "rgba(245,158,11,0.30)",
    fontDisplay: "Inter",
    fontMono: "JetBrains Mono",
  },

  /** Minimal — off-white, no strong accent */
  minimal: {
    bg: "#fafafa",
    surface: "#f0f0f0",
    text: "rgba(0,0,0,0.85)",
    textMuted: "rgba(0,0,0,0.40)",
    accent: "#171717",
    accentMuted: "rgba(23,23,23,0.12)",
    borderColor: "rgba(0,0,0,0.07)",
    borderAccent: "rgba(0,0,0,0.20)",
    fontDisplay: "Inter",
    fontMono: "JetBrains Mono",
  },
};

export function getTheme(name = "dark") {
  return themes[name] ?? themes.dark;
}

/** Merge a partial theme override onto a base theme */
export function extendTheme(base, overrides = {}) {
  return { ...getTheme(base), ...overrides };
}
