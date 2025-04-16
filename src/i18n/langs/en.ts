import Key from '../I18nKey';
import type { Translation } from '../translation';

export const en: Translation = {
  [Key.home]: 'Home',
  [Key.about]: 'About',
  [Key.archive]: 'Archive',
  [Key.search]: 'Search',
  [Key.links]: 'Links',
  [Key.time]: 'Time',

  [Key.tags]: 'Tags',
  [Key.categories]: 'Categories',
  [Key.recentPosts]: 'Recent Posts',
  [Key.randomPost]: 'Random Post',

  [Key.comments]: 'Comments',
  [Key.recentComments]: 'Recent Comments',
  [Key.subscribe]: 'Subscribe',
  [Key.backLinks]: 'Back Links',

  [Key.untitled]: 'Untitled',
  [Key.uncategorized]: 'Uncategorized',
  [Key.untagged]: 'No Tags',

  [Key.totalPosts]: 'Total Posts',
  [Key.totalWords]: 'Total Words',
  [Key.lastUpdated]: 'Last Updated',
  [Key.runTime]: 'Run Time',

  [Key.wordCount]: 'word',
  [Key.wordsCount]: 'words',
  [Key.minuteCount]: 'minute',
  [Key.minutesCount]: 'minutes',
  [Key.postCount]: 'post',
  [Key.postsCount]: 'posts',
  [Key.tagCount]: 'tag',
  [Key.tagsCount]: 'tags',
  [Key.categoryCount]: 'category',
  [Key.categoriesCount]: 'categories',

  [Key.toc]: 'Table of Content',

  [Key.themeToggle]: 'Toggle Theme',
  [Key.lightMode]: 'Light',
  [Key.darkMode]: 'Dark',
  [Key.systemMode]: 'System',

  [Key.more]: 'More',

  [Key.author]: 'Author',
  [Key.publishedAt]: 'Published at',
  [Key.license]: 'License',

  [Key.commentReplaceLink]: '[Link]',
  [Key.commentReplaceImage]: '[Image]',
  [Key.commentReplaceCode]: '[Code]',

  [Key.draftDevNote]:
    'This is a draft and will only be displayed in `DEV` mode. To disable draft preview, please modify `buildConfig.showDraftsOnDev` to `false` in `src/config.ts`.',
};
