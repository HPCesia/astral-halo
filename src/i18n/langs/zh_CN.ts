import Key from '../I18nKey';
import type { Translation } from '../translation';

export const zh_CN: Translation = {
  [Key.home]: '主页',
  [Key.about]: '关于',
  [Key.archive]: '归档',
  [Key.search]: '搜索',
  [Key.links]: '友链',
  [Key.time]: '时间',

  [Key.tags]: '标签',
  [Key.categories]: '分类',
  [Key.recentPosts]: '最新文章',
  [Key.randomPost]: '随机文章',

  [Key.comments]: '评论',
  [Key.recentComments]: '最新评论',
  [Key.subscribe]: '订阅',
  [Key.backLinks]: '反向链接',

  [Key.untitled]: '无标题',
  [Key.uncategorized]: '未分类',
  [Key.untagged]: '无标签',

  [Key.totalPosts]: '文章总数',
  [Key.totalWords]: '字数总计',
  [Key.lastUpdated]: '最后更新',
  [Key.runTime]: '运行时间',

  [Key.wordCount]: '字',
  [Key.wordsCount]: '字',
  [Key.minuteCount]: '分钟',
  [Key.minutesCount]: '分钟',
  [Key.postCount]: '篇文章',
  [Key.postsCount]: '篇文章',
  [Key.tagCount]: '个标签',
  [Key.tagsCount]: '个标签',
  [Key.categoryCount]: '个分类',
  [Key.categoriesCount]: '个分类',

  [Key.toc]: '目录',

  [Key.themeToggle]: '主题切换',
  [Key.lightMode]: '亮色',
  [Key.darkMode]: '暗色',
  [Key.systemMode]: '跟随系统',

  [Key.more]: '更多',

  [Key.author]: '作者',
  [Key.publishedAt]: '发布于',
  [Key.license]: '许可协议',

  [Key.commentReplaceLink]: '[链接]',
  [Key.commentReplaceImage]: '[图片]',
  [Key.commentReplaceCode]: '[代码]',

  [Key.draftDevNote]:
    '这是一篇草稿，只会在 `DEV` 模式下显示。关闭草稿预览，请修改 `src/config.ts` 中的 `buildConfig.showDraftsOnDev` 为 `false`。',
};
