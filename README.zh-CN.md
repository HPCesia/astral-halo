# Astral Halo

> [!WARNING]
> 该项目仍在开发中，可能存在 bug，且会有破坏性变更。请谨慎使用。

[**在线预览**（Netlify）](https://astral-halo.netlify.app/) | [English](README.md) | 简体中文

Astral Halo 是一个基于 [Astro](https://astro.build) 开发的静态博客模板。

## 功能特性/TODO

- [x] 基于 Astro 和 Tailwind CSS（使用 [daisyUI](https://daisyui.com/?lang=zh_hans)）开发
- [x] 可自由切换的明亮/暗黑主题
- [x] 响应式设计
- [x] 搜索（目前仅支持 [Pagefind](https://pagefind.app/)）
- [x] 响应式的文章目录显示
- [x] 文章双向引用
- [x] 评论系统，支持：
  - [Twikoo](https://twikoo.js.org/)
  - [Giscus](https://giscus.app/zh-CN/)
  - [Waline](https://waline.js.org/)
  - [Artalk](https://artalk.js.org/)
- [x] 各种各样可在文章中使用的组件
- [ ] 流畅的动画和页面过渡
- [ ] 实用 JS 脚本工具
- [ ] PWA 支持

## 使用方法

1. 使用此模板[生成新仓库](https://github.com/HPCesia/astral-halo/generate)或 Fork 此仓库。
2. 进行本地开发，克隆仓库到本地，执行 `pnpm install` 安装依赖，执行 `pnpm dev` 启动开发服务器。

   - 若未安装 [pnpm](https://pnpm.io/)，请先执行 `npm install -g pnpm` 安装 pnpm。

3. 通过配置文件 `src/config.ts` 自定义博客，配置说明位于 `src/types/config.ts` 的文档注释中。
4. 执行 `pnpm new [draft|post] [title]` 创建新文章。若创建的是草稿，编写完成后执行 `pnpm pub` 发布文章到 `src/content/posts` 目录。
5. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 astro.config.mjs 中的站点设置。

## 文章 Front Matter

```yaml
---
title: 文章标题
slug: post-entry # 文章将生成至 [BASE_URL]/posts/post-entry/ 路径下
published: 1970-01-01T00:00:00Z
description: 文章描述
category: Lorem
tags: [Foo, Bar]
cover: /path/to/cover.jpg
lang: zh-CN # 仅当文章语言与 `config.ts` 中站点语言不同时需要设置
comment: true # 是否启用评论，需要在 `config.ts` 中启用并配置评论系统
---
```

## 指令

下列指令均需要在项目根目录执行：

| 指令                             | 行为                               |
| -------------------------------- | ---------------------------------- |
| `pnpm install`                   | 安装依赖                           |
| `pnpm dev`                       | 在 `localhost:4321` 启动开发服务器 |
| `pnpm build`                     | 构建静态站点到 `./dist/` 目录      |
| `pnpm preview`                   | 本地预览构建的静态站点             |
| `pnpm new [draft\|post] [title]` | 创建新文章                         |
| `pnpm pub`                       | 发布草稿                           |
| `pnpm lint`                      | 检查代码                           |
| `pnpm format`                    | 格式化代码                         |
| `pnpm astro ...`                 | 运行 Astro CLI                     |

## 致谢

- 项目受 [Fuwari](https://github.com/saicaca/fuwari) 启发，参考了其中的部分代码和设计元素。
- 项目受 [Pure](https://github.com/cworld1/astro-theme-pure) 启发，参考了其中的部分代码和设计元素。
- 项目受 [Solitude](https://github.com/everfu/hexo-theme-solitude) 启发，参考了其中的部分设计元素。
