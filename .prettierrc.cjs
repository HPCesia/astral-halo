/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 96,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  importOrderSeparation: false,
  importOrderSortSpecifiers: true,

  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-astro-organize-imports',
  ],

  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
