import type {
  ArticleConfig,
  CommentConfig,
  FooterConfig,
  LicenseConfig,
  NavbarConfig,
  ProfileConfig,
  SearchConfig,
  SiteConfig,
  ToolBarConfig,
} from './types/config';
import I18nKey from '@i18n/I18nKey';
import { getRandomPost } from '@scripts/utils';

export const siteConfig: SiteConfig = {
  title: 'Astral Halo',
  subtitle: '',
  lang: 'en', // "en" | "zh_CN" | "zh_TW"
  favicon: [''],
  postsPerPage: 10,
};

export const profileConfig: ProfileConfig = {
  avatar: 'assets/img/avatar.jpg',
  name: 'Lorem Ipsum',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  links: [
    {
      name: 'GitHub',
      url: 'https://github.com/example',
      icon: 'mdi:github',
    },
    {
      name: 'Email',
      url: 'mailto:example@example.com',
      icon: 'mdi:email',
    },
  ],
};

export const navbarConfig: NavbarConfig = {
  navbarCenterItems: [
    { text: I18nKey.archive, href: '/archives/' },
    { text: I18nKey.categories, href: '/archives/categories/' },
    { text: I18nKey.tags, href: '/archives/tags/' },
    { text: I18nKey.about, href: '/about/' },
  ],
  navbarRightItems: {
    onlyWide: [
      {
        icon: 'material-symbols:rss-feed-rounded',
        text: I18nKey.subscribe,
        href: '/rss.xml',
      },
    ],
    always: [
      {
        icon: 'material-symbols:casino',
        text: I18nKey.randomPost,
        onclick: {
          id: 'random-post-btn',
          function: getRandomPost,
        },
      },
      {
        icon: 'material-symbols:search-rounded',
        text: I18nKey.search,
        onclick: 'search_modal.showModal()',
      },
    ],
  },
};

export const toolBarConfig: ToolBarConfig = {
  enable: true,
  items: [],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

export const footerConfig: FooterConfig = {
  copyrightYear: 2025,
  rightItems: [
    [
      {
        text: 'Astro',
        link: 'https://astro.build/',
        class: 'font-bold',
      },
    ],
    [
      {
        text: 'Astral Halo',
        link: 'https://github.com/HPCesia/astral-halo/',
        class: 'font-bold',
      },
    ],
  ],
};

export const articleConfig: ArticleConfig = {
  toc: true,
  wordCount: true,
  readingTime: {
    enable: true,
    wordsPerMinute: {
      cjk: 300,
      nonCjk: 160,
    },
  },
};

export const searchConfig: SearchConfig = {
  enable: true,
  provider: 'pagefind',
};

export const commentConfig: CommentConfig = {
  enable: false,
  provider: 'twikoo',
  twikoo: {
    envId: 'your-env-id',
  },
  giscus: {
    repo: 'your/repo',
    repoId: 'your-repo-id',
    category: 'your-category',
    categoryId: 'your-category-id',
    mapping: 'og:title',
  },
};
