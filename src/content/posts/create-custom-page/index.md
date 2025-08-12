---
title: Create a Custom Page Guide
slug: create-custom-page
category: Guide
tags: ['guide']
published: 2025-02-13T18:52:07+08:00
cover: ./demo_cover.jpg
---

In this guide, I will show you how to create a custom page in this blog template.

You might not be satisfied with posts, or the preset About and Links pages in Astral Halo; you want more—this article is here to meet that need.

In the `src/content/spec` directory, you can find a file named `page-template.md`. Make a copy of this file in the same place, rename it to `any-name-you-want.md`, and write whatever content you want.

In the `src/pages` directory, find a file named `_page.template.astro` (files starting with `_` will not be rendered). Make a copy of this file in the same directory, and rename it to `any-name-you-want.astro` (the name can be different from the previous `any-name-you-want.md`), and this new file name will be the URL of your custom page. Open this `.astro` file in your editor, and you'll see the line `const pageSlug = 'page-template';`. Change `'page-template'` to the `any-name-you-want` from your just-renamed `any-name-you-want.md` and save.

Wherever you want to add this new page, add a link to `/any-name-you-want`, where `any-name-you-want` refers to the `.astro` file. Finally, use `pnpm dev` and view your newly created custom page in the local preview that launches.
