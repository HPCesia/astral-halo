// @ts-check
import { CDN } from './src/constants/cdn.mjs';
import { componentTabs } from './src/plugins/components/tabs.mjs';
import { rehypeWrapTables } from './src/plugins/rehype-wrap-tables.mjs';
import { remarkExcerpt } from './src/plugins/remark-excerpt';
import { parseDirectiveNodes } from './src/plugins/remark-prase-directive.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeComponents from 'rehype-components';
import rehypeMathJaxCHtml from 'rehype-mathjax/chtml';
import remarkDirective from 'remark-directive';
import remarkGithubBlockQuote from 'remark-github-beta-blockquote-admonitions';
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
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      defaultColor: false,
    },
    remarkPlugins: [
      // remarkHeadingShift,
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      // @ts-expect-error - types are not up to date
      [
        remarkGithubBlockQuote,
        {
          classNameMaps: {
            block: (/** @type {string} */ title) =>
              `admonition admonition-${title.toLowerCase()}`,
            title: 'admonition-title',
          },
        },
      ],
      remarkDirective,
      parseDirectiveNodes,
    ],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeComponents,
        {
          components: { tabs: componentTabs },
        },
      ],
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
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
