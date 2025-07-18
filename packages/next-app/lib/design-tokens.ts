/**
 * Crowe Logic™ Design Tokens
 * Global design system for the myco-intelligent commerce interface
 */

export const croweTokens = {
  colors: {
    // Primary palette
    bgDark: '#17141E',      // Obsidian Charcoal
    fgLight: '#F4F4F2',     // Mycelium White  
    accent: '#C6A351',      // Cultivar Gold
    secondary: '#C9B88A',   // Golden Clay
    text: '#E0E0E0',        // Light text
    black: '#0D0D0D',       // Rich contrast
  },
  
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: {
      base: '16px',
      sm: '14px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    lineHeight: {
      base: 1.6,
      tight: 1.25,
      relaxed: 1.75,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    section: '2rem',
    component: '1.5rem',
    element: '1rem',
    tight: '0.5rem',
    sidebar: '260px',
  },
  
  borderRadius: {
    sm: '6px',
    base: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * CSS Custom Properties Generator
 * Converts design tokens to CSS variables
 */
export const generateCSSVariables = () => {
  return `
    :root {
      /* Colors */
      --clr-bg-dark: ${croweTokens.colors.bgDark};
      --clr-fg-light: ${croweTokens.colors.fgLight};
      --clr-accent: ${croweTokens.colors.accent};
      --clr-secondary: ${croweTokens.colors.secondary};
      --clr-text: ${croweTokens.colors.text};
      --clr-black: ${croweTokens.colors.black};
      
      /* Typography */
      --font-sans: ${croweTokens.typography.fontFamily};
      --text-base: ${croweTokens.typography.fontSize.base};
      --line-height-base: ${croweTokens.typography.lineHeight.base};
      
      /* Spacing */
      --spacing-section: ${croweTokens.spacing.section};
      --spacing-component: ${croweTokens.spacing.component};
      --spacing-element: ${croweTokens.spacing.element};
      --spacing-tight: ${croweTokens.spacing.tight};
      --sidebar-width: ${croweTokens.spacing.sidebar};
      
      /* Border Radius */
      --radius-sm: ${croweTokens.borderRadius.sm};
      --radius-base: ${croweTokens.borderRadius.base};
      --radius-lg: ${croweTokens.borderRadius.lg};
      --radius-xl: ${croweTokens.borderRadius.xl};
      --radius-full: ${croweTokens.borderRadius.full};
      
      /* Shadows */
      --shadow-sm: ${croweTokens.shadows.sm};
      --shadow-base: ${croweTokens.shadows.base};
      --shadow-lg: ${croweTokens.shadows.lg};
      --shadow-xl: ${croweTokens.shadows.xl};
      
      /* Transitions */
      --transition-fast: ${croweTokens.transitions.fast};
      --transition-base: ${croweTokens.transitions.base};
      --transition-slow: ${croweTokens.transitions.slow};
    }
  `;
};

/**
 * Tailwind Color Palette Export
 * For use in tailwind.config.js
 */
export const tailwindColors = {
  'crowe-bg-dark': croweTokens.colors.bgDark,
  'crowe-fg-light': croweTokens.colors.fgLight,
  'crowe-accent': croweTokens.colors.accent,
  'crowe-secondary': croweTokens.colors.secondary,
  'crowe-text': croweTokens.colors.text,
  'crowe-black': croweTokens.colors.black,
};

export default croweTokens;
