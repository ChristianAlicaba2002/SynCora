import { useThemeStore } from "../store/themeStore";

export const DARK = {
  // Backgrounds
  screen:       "#050d1a",
  screenMid:    "#0a1628",
  // Glass surfaces
  glassBg:      "rgba(255,255,255,0.06)",
  glassBorder:  "rgba(255,255,255,0.13)",
  glassShine:   "rgba(255,255,255,0.18)",
  // Text
  textPrimary:  "#ffffff",
  textSecondary:"rgba(255,255,255,0.55)",
  textMuted:    "rgba(255,255,255,0.35)",
  // Input
  inputBg:      "rgba(255,255,255,0.06)",
  inputBorder:  "rgba(255,255,255,0.13)",
  inputText:    "#ffffff",
  placeholder:  "rgba(255,255,255,0.35)",
  // Tab bar
  tabBar:       "rgba(5,13,26,0.85)",
  tabBarBorder: "rgba(255,255,255,0.10)",
  tabActive:    "#4A9FE8",
  tabInactive:  "rgba(255,255,255,0.55)",
  // Header
  headerBg:     "rgba(5,13,26,0.6)",
  headerBorder: "rgba(255,255,255,0.10)",
  headerIcon:   "rgba(255,255,255,0.85)",
  // Blobs
  blob1:        "#1A4F7A",
  blob2:        "#0a3060",
  blob3:        "#112244",
  // Search
  searchBg:     "rgba(255,255,255,0.06)",
  searchBorder: "rgba(255,255,255,0.13)",
  searchText:   "#ffffff",
  searchPlaceholder: "rgba(255,255,255,0.35)",
  // Misc
  rowBorder:    "rgba(255,255,255,0.08)",
  sectionTitle: "rgba(255,255,255,0.4)",
  footer:       "rgba(255,255,255,0.2)",
  chevron:      "rgba(255,255,255,0.25)",
  blurTint:     "dark" as const,
  submitText:   "#1A4F7A",
  submitBg:     "#ffffff",
} as const;

export const LIGHT = {
  // Backgrounds
  screen:       "#f0f4ff",
  screenMid:    "#e4ecf9",
  // Glass surfaces
  glassBg:      "rgba(255,255,255,0.75)",
  glassBorder:  "rgba(26,79,122,0.15)",
  glassShine:   "rgba(255,255,255,0.9)",
  // Text
  textPrimary:  "#0d1f3c",
  textSecondary:"rgba(13,31,60,0.6)",
  textMuted:    "rgba(13,31,60,0.4)",
  // Input
  inputBg:      "rgba(255,255,255,0.8)",
  inputBorder:  "rgba(26,79,122,0.18)",
  inputText:    "#0d1f3c",
  placeholder:  "rgba(13,31,60,0.35)",
  // Tab bar
  tabBar:       "rgba(255,255,255,0.85)",
  tabBarBorder: "rgba(26,79,122,0.12)",
  tabActive:    "#1A4F7A",
  tabInactive:  "rgba(13,31,60,0.45)",
  // Header
  headerBg:     "rgba(240,244,255,0.8)",
  headerBorder: "rgba(26,79,122,0.12)",
  headerIcon:   "rgba(13,31,60,0.75)",
  // Blobs
  blob1:        "#b8d4f0",
  blob2:        "#cce0f5",
  blob3:        "#d8eaf8",
  // Search
  searchBg:     "rgba(255,255,255,0.8)",
  searchBorder: "rgba(26,79,122,0.15)",
  searchText:   "#0d1f3c",
  searchPlaceholder: "rgba(13,31,60,0.4)",
  // Misc
  rowBorder:    "rgba(26,79,122,0.08)",
  sectionTitle: "rgba(13,31,60,0.45)",
  footer:       "rgba(13,31,60,0.3)",
  chevron:      "rgba(13,31,60,0.25)",
  blurTint:     "light" as const,
  submitText:   "#ffffff",
  submitBg:     "#1A4F7A",
} as const;

export type Theme = typeof DARK;

export function useTheme(): Theme {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? DARK : LIGHT;
}
