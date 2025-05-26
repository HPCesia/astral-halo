import type { NamespaceWebTranslation } from '../../i18n-types.js';

const zh_TW_web = {
  common: {
    open: '打開',
    close: '關閉',
  },
  navigation: {
    title: '導航',
    home: '首頁',
    about: '關於',
    archive: {
      title: '歸檔',
      time: '時間',
      tags: '標籤',
      categories: '分類',
    },
    friendLinks: '友鏈',
    menu: '選單',
    prevPage: '上一頁',
    nextPage: '下一頁',
    recentPosts: '最近文章',
  },
  status: {
    totalPosts: '文章總數',
    totalWords: '字數總計',
    lastUpdated: '最後更新',
    runTime: '運行時間',
    wordsCount: '{0} 字',
    readTime: '{0} 分鐘',
    postsCount: '{0} 篇文章',
    tagsCount: '{0} 個標籤',
    categoriesCount: '{0} 個分類',
  },
  button: {
    search: '搜尋',
    subscribe: '訂閱',
    more: '更多',
    themeToggle: {
      title: '主題切換',
      lightMode: '亮色',
      darkMode: '暗色',
      systemMode: '跟隨系統',
    },
  },
  meta: {
    author: '作者',
    publishedAt: '發佈時間',
    license: '許可協議',
    tags: '標籤',
    category: '分類',
    unTagged: '無標籤',
    unCategorized: '未分類',
  },
  info: {
    toc: '目錄',
    toolBar: '工具欄',
    readingPercentage: '閱讀進度',
    comments: '評論',
    recentComments: '最新評論',
    commentAbbrs: {
      image: '[圖片]',
      link: '[連結]',
      code: '[程式碼]',
    },
    backLinks: '反向連結',
    devNote:
      '這是一個草稿，只會在 <code>DEV</code> 模式下顯示。要禁用草稿預覽，請在 <code>{configFilePath}</code> 中將 <code>{configKey}</code> 修改為 <code>{configValue}</code>。',
    openMenu: '打開選單',
    closeMenu: '關閉選單',
  },
  search: {
    title: '搜尋',
    placeholder: '搜尋任何內容...',
    searchResults: '搜尋結果',
    noSearchResults: '沒有找到結果',
  },
} satisfies NamespaceWebTranslation;

export default zh_TW_web;
