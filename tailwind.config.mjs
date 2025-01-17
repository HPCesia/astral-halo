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
  darkMode: 'selector',
  plugins: [],
};
