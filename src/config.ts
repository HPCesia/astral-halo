import type {
  ArticleConfig,
  FooterConfig,
  LicenseConfig,
  NavbarConfig,
  ProfileConfig,
  SearchConfig,
  SiteConfig,
  ToolBarConfig,
} from './types/config';
import I18nKey from '@i18n/I18nKey';
import { getRandomPost, toggleSearch } from '@scripts/utils';

export const siteConfig: SiteConfig = {
  title: 'Astral Halo',
  subtitle: '',
  lang: 'zh_CN', // "en" | "zh_CN" | "zh_TW"
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
      // Items displayed only when the width is greater than 768px.
      // 仅在宽度大于 768px 时显示的项目
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
        onclick: {
          id: 'search-btn',
          function: toggleSearch,
        },
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
        class: 'font-bold text-sm',
      },
    ],
    [
      {
        text: 'Astral Halo',
        link: 'https://github.com/HPCesia/astral-halo/',
        class: 'font-bold text-sm',
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
