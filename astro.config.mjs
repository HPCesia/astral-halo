// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://astral-halo.netilify.app/',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [tailwind({ nesting: true }), icon()],
});
