import Key from '../I18nKey';
import type { Translation } from '../translation';

export const zh_TW: Translation = {
  [Key.home]: '首頁',
  [Key.about]: '關於',
  [Key.archive]: '彙整',
  [Key.search]: '搜尋',
  [Key.links]: '連結',
  [Key.time]: '時間',
  [Key.menu]: '選單',

  [Key.tags]: '標籤',
  [Key.categories]: '分類',
  [Key.recentPosts]: '最新文章',
  [Key.randomPost]: '隨機文章',

  [Key.comments]: '評論',
  [Key.recentComments]: '最新評論',
  [Key.subscribe]: '訂閱',
  [Key.backLinks]: '反向連結',

  [Key.untitled]: '無標題',
  [Key.uncategorized]: '未分類',
  [Key.untagged]: '無標籤',

  [Key.totalPosts]: '文章總數',
  [Key.totalWords]: '字數總計',
  [Key.lastUpdated]: '最後更新',
  [Key.runTime]: '運行時間',

  [Key.wordCount]: '字',
  [Key.wordsCount]: '字',
  [Key.minuteCount]: '分鐘',
  [Key.minutesCount]: '分鐘',
  [Key.postCount]: '篇文章',
  [Key.postsCount]: '篇文章',
  [Key.tagCount]: '個標籤',
  [Key.tagsCount]: '個標籤',
  [Key.categoryCount]: '個分類',
  [Key.categoriesCount]: '個分類',

  [Key.toc]: '目錄',

  [Key.themeToggle]: '主題切換',
  [Key.lightMode]: '亮色',
  [Key.darkMode]: '暗色',
  [Key.systemMode]: '跟隨系統',

  [Key.more]: '更多',

  [Key.author]: '作者',
  [Key.publishedAt]: '發佈於',
  [Key.license]: '許可協議',

  [Key.commentReplaceLink]: '[連結]',
  [Key.commentReplaceImage]: '[圖片]',
  [Key.commentReplaceCode]: '[程式碼]',

  [Key.draftDevNote]:
    '這是一篇草稿，只會在 `DEV` 模式下顯示。關閉草稿預覽，請修改 `src/config.ts` 中的 `buildConfig.showDraftsOnDev` 為 `false`。',
};
