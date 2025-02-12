# Astral Halo

> [!WARNING]
> This project is still under development and may contain bugs and breaking changes. Use with caution.

[Live Demo (Netlify)](https://astral-halo.netlify.app/) | English | [简体中文](README-zh_CN.md)

Astral Halo is a static blog template developed with [Astro](https://astro.build).

## Features

- [x] Built with Astro and Tailwind CSS (using [daisyUI](https://daisyui.com/?lang=en))
- [x] Freely switchable light/dark themes
- [x] Responsive design
- [x] Search functionality (currently only supports [Pagefind](https://pagefind.app/))
- [x] Article table of contents
- [x] Comments system (supports [Twikoo](https://twikoo.js.org/en/) and [Giscus](https://giscus.app/))
- [ ] Smooth animations and page transitions

## Getting Started

1. Use this template to [generate a new repository](https://github.com/HPCesia/astral-halo/generate) or fork this repository.
2. For local development, clone the repository, run `pnpm install` to install dependencies, and `pnpm dev` to start the development server.

   - If [pnpm](https://pnpm.io/) is not installed, first run `npm install -g pnpm` to install it.

3. Customize your blog through the configuration file `src/config.ts`. Configuration documentation can be found in the comments of `src/types/config.ts`.
4. Run `pnpm new [draft|post] [title]` to create a new article. If creating a draft, run `pnpm pub [title]` to publish it to the `src/content/posts` directory when finished.
5. Refer to the [official guide](https://docs.astro.build/en/guides/deploy/) to deploy your blog to Vercel, Netlify, GitHub Pages, etc. Before deployment, edit the site settings in astro.config.mjs.

## Article Front Matter

```yaml
---
title: Article Title
slug: post-entry # The article will be generated at the path [BASE_URL]/posts/post-entry/
published: 1970-01-01T00:00:00Z
description: Article Description
category: Lorem
tags: [Foo, Bar]
cover: /path/to/cover.jpg
lang: en # Only needed when article language differs from site language in `config.ts`
comment: true # Enable comments, requires comment system to be enabled and configured in `config.ts`
---
```

## Commands

All commands need to be run from the project root directory:

| Command                          | Action                               |
| -------------------------------- | ------------------------------------ |
| `pnpm install`                   | Install dependencies                 |
| `pnpm dev`                       | Start dev server at `localhost:4321` |
| `pnpm build`                     | Build static site to `./dist/`       |
| `pnpm preview`                   | Preview built site locally           |
| `pnpm new [draft\|post] [title]` | Create new article                   |
| `pnpm pub [title]`               | Publish draft                        |
| `pnpm lint`                      | Check code                           |
| `pnpm format`                    | Format code                          |
| `pnpm astro ...`                 | Run Astro CLI                        |

## Acknowledgments

- This project is inspired by [Fuwari](https://github.com/saicaca/fuwari) and references some of its code and design elements.
- This project is inspired by [Pure](https://github.com/cworld1/astro-theme-pure) and references some of its code and design elements.
- This project is inspired by [Solitude](https://github.com/everfu/hexo-theme-solitude) and references some of its design elements.
