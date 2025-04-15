import type {
  ArticleConfig,
  AsideConfig,
  BuildConfig,
  CommentConfig,
  FooterConfig,
  LicenseConfig,
  LinksConfig,
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
  subtitle: 'A static blog template powered by Astro',
  lang: 'en', // "en" | "zh_CN" | "zh_TW"
  favicon: [
    // Leave this array empty to use the default favicon.
    // 留空数组以使用默认的 favicon。
  ],
  createAt: new Date('2025-01-01'),
  postsPerPage: 10,
  banner: {
    src: 'assets/img/demo_banner.jpg',
    text: 'Welcome to Astral Halo!',
    homepageHeight: '100dvh',
    postHeight: '40dvh',
    pagesHeight: [
      // {
      //   pagePathRegex: /\/about\//,
      //   height: '50dvh',
      // },
    ],
    defaultHeight: '40dvh',
  },
};

export const buildConfig: BuildConfig = {
  showDraftsOnDev: true,
  inferRemoteImageSize: {
    enable: true,
    defaultSize: {
      width: 800,
      height: 600,
    },
  },
};

export const profileConfig: ProfileConfig = {
  avatar: 'assets/img/avatar.jpg',
  name: 'Lorem Ipsum',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  socialLinks: [
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

export const linksConfig: LinksConfig = {
  items: [
    {
      groupName: 'Lorem Ipsum',
      groupDescription: 'Lorem ipsum dolor sit amet.',
      groupItems: [
        { name: 'Item 1', url: 'https://example.com', avatar: 'assets/img/avatar.jpg' },
        {
          name: 'Item 2',
          url: 'https://example.com',
          avatar: 'assets/img/avatar.jpg',
          description: 'Lorem ipsum dolor sit amet.',
        },
        { name: 'Item 3', url: 'https://example.com', avatar: 'assets/img/avatar.jpg' },
      ],
    },
  ],
};

export const navbarConfig: NavbarConfig = {
  navbarCenterItems: [
    {
      title: I18nKey.archive,
      items: [
        { text: I18nKey.time, href: '/archives/' },
        { text: I18nKey.categories, href: '/archives/categories/' },
        { text: I18nKey.tags, href: '/archives/tags/' },
      ],
    },
    { text: I18nKey.links, href: '/links/' },
    { text: I18nKey.about, href: '/about/' },
  ],
  navbarRightItems: {
    onlyWide: [
      {
        icon: 'material-symbols:rss-feed-rounded',
        text: I18nKey.subscribe,
        href: '/rss.xml',
        blank: true,
      },
      {
        icon: 'material-symbols:casino',
        text: I18nKey.randomPost,
        onclick: {
          id: 'random-post-btn',
          function: getRandomPost,
        },
      },
    ],
    always: [
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

export const asideConfig: AsideConfig = {
  siteInfo: {
    contents: ['stats', 'tags'],
    stats: ['post-count', 'last-updated', 'site-words-count', 'site-run-days'],
  },
  recentComment: {
    enable: true,
    count: 5,
    showAvatar: true,
  },
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
        link: 'https://github.com/HPCesia/astral-halo',
        class: 'font-bold',
      },
    ],
  ],
};

export const articleConfig: ArticleConfig = {
  toc: true,
  wordCount: true,
  readingTime: true,
};

export const searchConfig: SearchConfig = {
  enable: true,
  provider: 'pagefind',
};

export const commentConfig: CommentConfig = {
  enable: true,
  provider: 'waline',
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
  waline: {
    serverURL: 'https://astral-halo-comment.netlify.app/.netlify/functions/comment',
    wordLimit: 100, // Set a lower limit for demo site, to prevent abuse and save free database space cost.
    pageSize: 10,
    reaction: false,
  },
  artalk: {
    serverURL: 'https://artalk.yourdomain.com',
    // locale: 'en', // Optional, default is site language.
  },
};
