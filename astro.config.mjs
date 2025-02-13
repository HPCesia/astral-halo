// @ts-check
import { CDN } from './src/constants/cdn.mjs';
import { rehypePrettierCodes } from './src/plugins/rehype-prettier-codes.ts';
import { rehypeWrapTables } from './src/plugins/rehype-wrap-tables.ts';
import { remarkExcerpt } from './src/plugins/remark-excerpt.ts';
import { remarkGithubBlockquote } from './src/plugins/remark-github-blockquote.ts';
// import { remarkHeadingShift } from './src/plugins/remark-heading-shift.ts';
import { remarkImageProcess } from './src/plugins/remark-image-process.ts';
import { remarkReadingTime } from './src/plugins/remark-reading-time.ts';
import { wrapCode } from './src/plugins/shiki-transformers.ts';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';
// import { transformerNotationDiff } from '@shikijs/transformers';
// import { transformerNotationHighlight } from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMathJaxCHtml from 'rehype-mathjax/chtml';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  site: 'https://astral-halo.netilify.app/',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    icon(),
    sitemap({ filter: (page) => !page.includes('/archives/') && !page.includes('/about/') }),
    pagefind(),
    mdx(),
    swup({
      containers: ['main'],
      animationClass: 'swup-transition-',
      globalInstance: true,
      smoothScrolling: true,
      progress: true,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      defaultColor: false,
      transformers: [
        // transformerNotationDiff(),
        // transformerNotationHighlight(),
        wrapCode(),
      ],
    },
    remarkPlugins: [
      // remarkHeadingShift,
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      remarkImageProcess,
      remarkGithubBlockquote,
    ],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          content: {
            type: 'text',
            value: '#',
          },
          properties: {
            'aria-label': 'Anchor link',
          },
        },
      ],
      [
        rehypeMathJaxCHtml,
        {
          chtml: {
            fontURL: CDN.mathjaxFont,
          },
        },
      ],
      rehypeWrapTables,
      rehypePrettierCodes,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
