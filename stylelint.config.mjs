/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-html/astro'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          // Tailwind CSS
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'layer',
          'config',
          'plugin',
          'reference',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
  },
};
