import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crowe: {
          dark: "#17141E",       // Obsidian Charcoal (bg-dark)
          light: "#F4F4F2",      // Mycelium White (fg-light)
          accent: "#C6A351",     // Cultivar Gold (accent)
          secondary: "#C9B88A",  // Golden Clay (secondary)
          text: "#E0E0E0",       // Light text
          black: "#0D0D0D"       // Rich contrast
        },
        // CSS variable compatibility
        'crowe-bg-dark': '#17141E',
        'crowe-fg-light': '#F4F4F2', 
        'crowe-accent': '#C6A351',
        'crowe-secondary': '#C9B88A',
        'crowe-text': '#E0E0E0',
        'crowe-black': '#0D0D0D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'crowe-section': '2rem',
        'sidebar': '260px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'crowe': '12px',
      },
      lineHeight: {
        'crowe': '1.6',
      },
      fontSize: {
        'crowe-base': '16px',
      },
      width: {
        'sidebar': '260px',
      },
      margin: {
        'sidebar': '260px',
      }
    }
  },
  plugins: [],
};

export default config;