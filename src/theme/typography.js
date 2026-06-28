/**
 * HERCO Design System - Typography
 * Using Inter font family for modern, professional appearance
 */

export const typography = {
  // Font Family
  fontFamily: {
    base: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.02,
    normal: 0,
    wide: 0.02,
  },
};

export const textStyles = {
  // Headings
  h1: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.02,
  },
  h2: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.01,
  },
  h3: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // Body
  body: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  // Labels
  label: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0.5,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4,
  },
};

export default typography;
