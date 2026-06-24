import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#070b12',
        foreground: '#e5e7eb',
        muted: '#93a4ba',
        panel: '#0c121b',
        panel2: '#101826',
        border: 'rgba(148, 163, 184, 0.16)',
        accent: '#d7dde6',
        accentSoft: '#9fb0c5',
        success: '#8fbf9a',
        warning: '#d6b06b',
        danger: '#d87979'
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.04), 0 18px 48px rgba(0,0,0,0.45)'
      },
      backgroundImage: {
        'radial-quiet': 'radial-gradient(circle at top, rgba(148, 163, 184, 0.13), transparent 48%)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
