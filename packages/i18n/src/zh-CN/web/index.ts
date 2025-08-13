import type { NamespaceWebTranslation } from '../../i18n-types.js';

const zh_CN_web = {
  common: {
    open: '打开',
    close: '关闭',
    refresh: '刷新',
  },
  navigation: {
    title: '导航',
    home: '首页',
    about: '关于',
    archive: {
      title: '归档',
      time: '时间',
      tags: '标签',
      categories: '分类',
    },
    friendLinks: '友链',
    menu: '菜单',
    prevPage: '上一页',
    nextPage: '下一页',
    recentPosts: '最近文章',
  },
  status: {
    totalPosts: '文章总数',
    totalWords: '字数总计',
    lastUpdated: '最后更新',
    runTime: '运行时间',
    wordsCount: '{0} 字',
    readTime: '{0} 分钟',
    postsCount: '{0} 篇文章',
    tagsCount: '{0} 个标签',
    categoriesCount: '{0} 个分类',
  },
  button: {
    search: '搜索',
    subscribe: '订阅',
    more: '更多',
    themeToggle: {
      title: '主题切换',
      lightMode: '亮色',
      darkMode: '暗色',
      systemMode: '跟随系统',
    },
  },
  meta: {
    author: '作者',
    publishedAt: '发布时间',
    license: '许可协议',
    tags: '标签',
    category: '分类',
    unTagged: '无标签',
    unCategorized: '未分类',
  },
  info: {
    toc: '目录',
    toolBar: '工具栏',
    readingPercentage: '阅读进度',
    comments: '评论',
    recentComments: '最新评论',
    commentAbbrs: {
      image: '[图片]',
      link: '[链接]',
      code: '[代码]',
    },
    backLinks: '反向链接',
    devNote:
      '这是一个草稿，只会在 <code>DEV</code> 模式下显示。要禁用草稿预览，请在 <code>{configFilePath}</code> 中将 <code>{configKey}</code> 修改为 <code>{configValue}</code>。',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
  },
  search: {
    title: '搜索',
    placeholder: '搜索任何内容...',
    searchResults: '搜索结果',
    noSearchResults: '没有找到结果',
  },
} satisfies NamespaceWebTranslation;

export default zh_CN_web;
