import type { BaseTranslation } from '../../i18n-types.js';

const en_web = {
  common: {
    open: 'Open',
    close: 'Close',
    refresh: 'Refresh',
  },
  navigation: {
    title: 'Navigation',
    home: 'Home',
    about: 'About',
    archive: {
      title: 'Archive',
      time: 'Time',
      tags: 'Tags',
      categories: 'Categories',
    },
    friendLinks: 'Links',
    menu: 'Menu',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    recentPosts: 'Recent Posts',
  },
  status: {
    totalPosts: 'Total Posts',
    totalWords: 'Total Words',
    lastUpdated: 'Last Updated',
    runTime: 'Run Time',
    wordsCount: '{0} word{{s}}',
    readTime: '{0} minute{{s}}',
    postsCount: '{0} post{{s}}',
    tagsCount: '{0} tag{{s}}',
    categoriesCount: '{0} category{{s}}',
  },
  button: {
    search: 'Search',
    subscribe: 'Subscribe',
    more: 'More',
    themeToggle: {
      title: 'Toggle Theme',
      lightMode: 'Light',
      darkMode: 'Dark',
      systemMode: 'System',
    },
  },
  meta: {
    author: 'Author',
    publishedAt: 'Published At',
    license: 'License',
    tags: 'Tags',
    category: 'Category',
    unTagged: 'No Tags',
    unCategorized: 'Uncategorized',
    wordsCount: 'Words Count',
    readingTime: 'Reading Time',
  },
  info: {
    toc: 'Table of Content',
    toolBar: 'Tool Bar',
    readingPercentage: 'Reading Percentage',
    comments: 'Comments',
    recentComments: 'Recent Comments',
    commentAbbrs: {
      image: '[Image]',
      link: '[Link]',
      code: '[Code]',
    },
    backLinks: 'Back Links',
    devNote:
      'This is a draft and will only be displayed in <code>DEV</code> mode. To disable draft preview, please modify <code>{configKey:string}</code> to <code>{configValue:boolean}</code> in <code>{configFilePath:string}</code>.',
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu',
  },
  search: {
    title: 'Search',
    placeholder: 'Search Anything...',
    searchResults: 'Search Results',
    noSearchResults: 'No Results Found',
  },
} satisfies BaseTranslation;

export default en_web;
