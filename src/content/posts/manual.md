---
title: Manual
slug: '12345678'
published: 2025-01-16T22:01:22+08:00
category: Guide
tags:
  - guide
  - manual
---

This blog template is built with [Astro](https://astro.build). For the things that are not
mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Article Front Matter

```yaml
---
title: Article Title
slug: post-entry
published: 1970-01-01T00:00:00Z
description: Article Description
category: Lorem
tags: [Foo, Bar]
cover: /path/to/cover.jpg
lang: en # Only needed when article language differs from site language in `config.ts`
comment: true # Enable comments, requires comment system to be enabled and configured in `config.ts`
---
```

## Where to Place the Post Files

Your post files should be placed in `src/content/posts/` directory. You need to create
sub-directories if you want to use local assets. To automatically generate a new post file,
run `pnpm new [draft|post] [title] [--dir]` in the terminal at the root of the project.

:::filetree{open=true}

- src/content/posts
  - post-1.md
  - post-2
    - cover.png
    - index.md

:::
