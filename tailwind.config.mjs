import daisyui from 'daisyui';

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
          primary: '#BC4D2E',
          'primary-content': '#FEFEDB',
          secondary: '#EFBF89',
          'secondary-content': '#111',
          accent: '#742C22',
          'accent-content': '#FFF',
          'base-100': '#FFFFFD',
          'base-200': '#F6E7D2',
          'base-300': '#E6C9AC',
          'base-content': '#111',
        },
        dark: {
          primary: '#88B7DC',
          'primary-content': '#FFF',
          secondary: '#C47890',
          'secondary-content': '#FFF',
          accent: '#A343B0',
          'accent-content': '#FFF',
          'base-100': '#272A3C',
          'base-200': '#18192A',
          'base-300': '#11121F',
          'base-content': '#EEE',
        },
      },
    ],
  },
};
