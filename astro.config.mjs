// @ts-check
import { buildConfig, siteConfig } from './src/config.ts';
import { CDN } from './src/constants/cdn.ts';
import { pluginLanguageBadge } from './src/plugins/expressive-code-lang-badget.ts';
import { rehypeComponentsAsync } from './src/plugins/rehype-components-async.ts';
import { rehypeComponentsList } from './src/plugins/rehype-components-list.ts';
import { rehypeWrapTables } from './src/plugins/rehype-wrap-tables.ts';
import { remarkArticleReferences } from './src/plugins/remark-article-references';
import { remarkCreateTime } from './src/plugins/remark-create-time.ts';
import { remarkExcerpt } from './src/plugins/remark-excerpt.ts';
// import { remarkHeadingShift } from './src/plugins/remark-heading-shift.ts';
import { remarkImageProcess } from './src/plugins/remark-image-process.ts';
import { remarkObsidianCallout } from './src/plugins/remark-obsidian-callout.ts';
import { remarkReadingTime } from './src/plugins/remark-reading-time.ts';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeMathJaxCHtml from 'rehype-mathjax/chtml';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkMath from 'remark-math';
import Icons from 'unplugin-icons/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://astral-halo.netlify.app/',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    icon(),
    sitemap({ filter: (page) => !page.includes('/archives/') && !page.includes('/about/') }),
    pagefind(),
    AstroPWA({
      manifest: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        description: siteConfig.subtitle,
        lang: siteConfig.lang,
        theme_color: '#4f94c9', // Should be the same as the primary color in src/styles/global.css
        background_color: '#f2e8e0', // Should be the same as the base-100 color in src/styles/global.css
      },
      pwaAssets: {
        config: true,
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: false,
        navigateFallbackAllowlist: [/^\/$/],
      },
    }),
    expressiveCode({
      themeCssSelector: (theme) => `[data-theme="${buildConfig.themeNames[theme.type]}"]`,
      plugins: [pluginLineNumbers(), pluginLanguageBadge()],
      shiki: {
        langAlias: {
          pip: 'ini',
        },
      },
    }),
    mdx(),
    solidJs({ devtools: true }),
  ],
  markdown: {
    remarkPlugins: [
      // remarkHeadingShift,
      remarkMath,
      remarkDirective,
      // @ts-expect-error Types of the plugin are not correct
      remarkDirectiveRehype,
      remarkCreateTime,
      remarkReadingTime,
      remarkExcerpt,
      remarkImageProcess,
      remarkObsidianCallout,
      remarkArticleReferences,
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
  [rehypeComponentsAsync, { components: rehypeComponentsList }],
    ],
  },
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: 'solid' })],
    build: {
      rollupOptions: {
        external: ['workbox-window'],
      },
    },
  },
});
