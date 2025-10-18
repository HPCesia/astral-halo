# Astral Halo

> [!WARNING]
> 該項目仍在開發中，可能存在 bug，且會有破壞性變更。請謹慎使用。

[**線上預覽**（Netlify）](https://astral-halo.netlify.app/) | [English](./README.md) | [简体中文](./README.zh-CN.md) | 繁體中文

Astral Halo 是一個基於 [Astro](https://astro.build) 開發的靜態部落格模板。

> [!NOTE]
> 本專案託管於以下倉庫：
>
> - Codeberg（主倉庫）：[HPCesia/AstralHalo](https://codeberg.org/HPCesia/AstralHalo)
> - GitHub（鏡像）：[HPCesia/astral-halo](https://github.com/HPCesia/astral-halo)
>
> 鏡像倉庫僅用於收集 issue，不接受 PR。

## 功能特性/TODO

- [x] 基於 Astro 和 Tailwind CSS（使用 [daisyUI](https://daisyui.com/?lang=zh_hant)）開發
- [x] 可自由切換的明亮/暗黑主題
- [x] 響應式設計
- [x] 搜尋（目前僅支援 [Pagefind](https://pagefind.app/)）
- [x] 響應式的文章目錄顯示
- [x] 部分支援 Obsidian 特性
  - [x] Callout
  - [ ] Wiki 連結（僅支援對文章的連結）
  - [ ] 反向連結（僅支援對 Wiki 連結的反向連結顯示）
- [x] 評論系統，支援：
  - [Twikoo](https://twikoo.js.org/)
  - [Giscus](https://giscus.app/zh-TW/)
  - [Waline](https://waline.js.org/)
  - [Artalk](https://artalk.js.org/)
- [x] 各種各樣可在文章中使用的元件
- [ ] 流暢的動畫和頁面過渡
- [x] 實用 JS 指令碼工具
- [x] PWA 支援

## 使用方法

1. 使用此模板生成新儲存庫或 Fork 此儲存庫。
2. 進行本地開發，克隆儲存庫到本地，執行 `pnpm install` 安裝依賴，執行 `pnpm dev` 啟動開發伺服器。

   - 若未安裝 [pnpm](https://pnpm.io/)，請先執行 `npm install -g pnpm` 安裝 pnpm。

3. 通過配置檔案 `src/config.ts` 自訂部落格，配置說明位於 `src/types/config.ts` 的文件註釋中。
4. 執行 `pnpm new` 建立新草稿。編寫完成後執行 `pnpm pub` 發布文章到 `src/content/posts` 目錄。
5. 參考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)將部落格部署至 Vercel, Netlify, GitHub Pages 等；部署前需編輯 astro.config.mjs 中的網站設定。

## 文章 Front Matter

```yaml
---
title: 文章標題
slug: post-entry # 文章將生成至 [BASE_URL]/posts/post-entry/ 路徑下
published: 1970-01-01T00:00:00Z
description: 文章描述
category: Lorem
tags: [Foo, Bar]
cover: /path/to/cover.jpg
lang: zh-TW # 僅當文章語言與 `config.ts` 中網站語言不同時需要設定
comment: true # 是否啟用評論，需要在 `config.ts` 中啟用並配置評論系統
---
```

## 指令

下列指令均需要在專案根目錄執行：

| 指令             | 行為                               |
| ---------------- | ---------------------------------- |
| `pnpm install`   | 安裝依賴                           |
| `pnpm dev`       | 在 `localhost:4321` 啟動開發伺服器 |
| `pnpm build`     | 構建靜態網站到 `./dist/` 目錄      |
| `pnpm preview`   | 本地預覽構建的靜態網站             |
| `pnpm new`       | 建立新文章                         |
| `pnpm pub`       | 發布草稿                           |
| `pnpm lint`      | 檢查程式碼                         |
| `pnpm format`    | 格式化程式碼                       |
| `pnpm astro ...` | 執行 Astro CLI                     |

## 致謝

- 專案受 [Fuwari](https://github.com/saicaca/fuwari) 啟發，參考了其中的部分程式碼和設計元素。
- 專案受 [Pure](https://github.com/cworld1/astro-theme-pure) 啟發，參考了其中的部分程式碼和設計元素。
- 專案受 [Solitude](https://github.com/everfu/hexo-theme-solitude) 啟發，參考了其中的部分設計元素。
