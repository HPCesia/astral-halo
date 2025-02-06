import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      letterSpacing: {
        'extra-wide': '0.25em',
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [daisyui],
  daisyui: {
    base: false,
    themes: [
      {
        light: {
          ...themes['light'],
          primary: '#BC4D2E',
          'primary-content': '#ffffff',
          secondary: '#626437',
          'secondary-content': '#ffffff',
          accent: '#512620',
        },
        dark: {
          ...themes['dark'],
          primary: '#3C8CC7',
          'primary-content': '#ffffff',
          secondary: '#DB446B',
          'secondary-content': '#ffffff',
          accent: '#D29F60',
        },
      },
    ],
  },
};
