---
title: Maunal
slug: '12345678'
published: 2025-01-16 22:01:22
category: Guide
tags:
  - guide
  - manual
---

This blog template is built with [Astro](https://astro.build). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Article Front Matter

```yaml
---
title: Article Title
slug: post-entry
published: 1970-01-01T00:00:00.000Z
description: Article Description
category: Lorem
tags: [Foo, Bar]
cover: /path/to/cover.jpg
lang: en # Only needed when article language differs from site language in `config.ts`
comment: true # Enable comments, requires comment system to be enabled and configured in `config.ts`
---
```

## Where to Place the Post Files

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets. To automatically generate a new post file, run `pnpm new [draft|post] [title] [--dir]` in the terminal at the root of the project.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
