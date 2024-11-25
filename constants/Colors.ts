/**
 * Color system for the grocery app using a simplified palette:
 * - Lapis Lazuli (#22577A) - Accent/Buttons
 * - Light Green (#80ED99) - Secondary/Interactive
 * - Emerald (#57CC99) - Additional accent
 * - White/Black - Backgrounds
 */

// Core colors we'll use throughout the app
const CORE_COLORS = {
  lapisLazuli: "#22577A",
  lightGreen: "#80ED99",
  emerald: "#57CC99",
} as const;

export const Colors = {
  light: {
    // Core UI colors
    primary: "#FFFFFF", // Main background
    background: "#FFFFFF", // Keeping for backwards compatibility
    text: "#000000",

    // Accent colors
    accent: CORE_COLORS.lapisLazuli,
    secondary: CORE_COLORS.lightGreen,
    tertiary: CORE_COLORS.emerald,

    // UI Elements
    buttonBackground: CORE_COLORS.lightGreen,
    buttonText: "#000000",
  },
  dark: {
    // Core UI colors
    primary: "#000000", // Main background
    background: "#000000", // Keeping for backwards compatibility
    text: "#FFFFFF",

    // Accent colors
    accent: CORE_COLORS.lapisLazuli,
    secondary: CORE_COLORS.lightGreen,
    tertiary: CORE_COLORS.emerald,

    // UI Elements
    buttonBackground: CORE_COLORS.lightGreen,
    buttonText: "#000000",
  },
} as const;

// Type definitions for TypeScript support
export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
export type ColorKey = keyof ThemeColors;
