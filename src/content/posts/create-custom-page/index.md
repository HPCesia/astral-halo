---
title: Create a Custom Page Guide
slug: create-custom-page
category: Guide
tags: ['guide']
published: 2025-02-13T18:52:07+08:00
cover: ./demo_cover.jpg
---

<!--  -->

In this guide, I will show you how to create a custom page in this blog template.

You might not be satisfied with posts, or the preset About and Links pages in Astral Halo;
you want more—this article is here to meet that need.

In the `src/content/spec` directory, you can find a file named `page-template.md`.

:::filetree{open=true}

- src
  - content
    - spec
      - page-template.md

:::

Make a copy of this file in the same place, rename it to `any-name-you-want.md`,
and write whatever content you want.

:::filetree{open=true}

- src
  - content
    - spec
      - any-name-you-want.md
      - page-template.md

:::

In the `src/pages` directory, find a file named `_page.template.astro`(files starting with `_` will not be rendered).

:::filetree{open=true}

- src
  - content
    - spec
      - any-name-you-want.md
      - page-template.md
  - pages
    - \_page.template.astro

:::

Make a copy of this file in the same directory, and rename it to `any-name-you-want.astro` (the name can be
different from the previous `any-name-you-want.md`), and this new file name will be the URL of your custom page.

:::filetree{open=true}

- src
  - content
    - spec
      - any-name-you-want.md
      - page-template.md
  - pages
    - \_page.template.astro
    - any-name-you-want.astro

:::

Open this `.astro` file in your editor, and you'll see the line `const pageSlug = 'page-template';`.
Change `'page-template'` to the `any-name-you-want` from your just-renamed `any-name-you-want.md` and save.

<!-- prettier-ignore-start -->
```astro del={9} add={10}
// any-name-you-want.astro
---
import PostInfo from '@components/misc/PostInfo.astro';
import Markdown from '@components/utils/Markdown.astro';
import PostPageLayout from '@layouts/PostPageLayout.astro';
import { getAllReferences } from '@utils/content-utils';
import { getEntry, render } from 'astro:content';

const pageSlug = 'page-template';
const pageSlug = 'any-name-you-want';

const md = await getEntry('spec', pageSlug);

// Other codes
---
```
<!-- prettier-ignore-end -->

Wherever you want to add this new page, add a link to `/any-name-you-want`, where `any-name-you-want`
refers to the `.astro` file. Finally, use `pnpm dev` and view your newly created custom page in the
local preview that launches.
