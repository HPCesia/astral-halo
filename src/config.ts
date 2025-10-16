// WARNING: This file will be bundled into the build product.
// DO NOT add any sensitive information here.
// 警告: 该文件会被打包到构建产物中, 不要在此添加任何敏感信息
import type {
  ArticleConfig,
  AsideConfig,
  BuildConfig,
  CommentConfig,
  FastActionsConfig,
  FooterConfig,
  LicenseConfig,
  LinksConfig,
  NavbarConfig,
  ProfileConfig,
  SearchConfig,
  SiteConfig,
} from './types/config';
import { L } from '@astral-halo/i18n';

export const siteConfig: SiteConfig = {
  title: 'Astral Halo',
  subtitle: 'A static blog template powered by Astro',
  lang: 'en',
  createAt: new Date('2025-01-01'),
  postsPerPage: 10,
  banner: {
    src: 'assets/img/demo_banner.jpg',
    text: 'Welcome to Astral Halo!',
    homepageHeight: '100svh',
    postHeight: '40svh',
    pagesHeight: [
      // {
      //   pagePathRegex: /\/about\//,
      //   height: '50svh',
      // },
    ],
    defaultHeight: '40svh',
  },
};

// To avoid circular dependency
const t = L[siteConfig.lang].web;

export const buildConfig: BuildConfig = {
  showDraftsOnDev: true,
  inferRemoteImageSize: {
    enable: true,
    defaultSize: {
      width: 800,
      height: 600,
    },
  },
  enableImageZoom: true,
  themeNames: {
    light: 'light',
    dark: 'dark',
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
        {
          name: 'Astro',
          url: 'https://astro.build/',
          avatar: 'https://astro.build/favicon.svg',
          description: 'The web framework for content-driven websites.',
        },
        {
          name: 'HPCesia',
          url: 'https://blog.hpcesia.com/',
          avatar: 'https://blog.hpcesia.com/assets/img/avatar.webp',
          description: 'The author of Astral Halo.',
        },
        { name: 'Site 1', url: 'https://example.com', avatar: 'assets/img/avatar.jpg' },
        { name: 'Site 2', url: 'https://example.com', avatar: 'assets/img/avatar.jpg' },
      ],
    },
  ],
};

export const navbarConfig: NavbarConfig = {
  navbarCenterItems: [
    {
      title: t.navigation.archive.title(),
      items: [
        { text: t.navigation.archive.time(), href: '/archives/' },
        { text: t.navigation.archive.categories(), href: '/archives/categories/' },
        { text: t.navigation.archive.tags(), href: '/archives/tags/' },
      ],
    },
    { text: t.navigation.friendLinks(), href: '/links/' },
    { text: t.navigation.about(), href: '/about/' },
  ],
  navbarRightItems: {
    onlyWide: [
      {
        icon: 'material-symbols:rss-feed-rounded',
        text: t.button.subscribe(),
        href: '/rss.xml',
        blank: true,
      },
    ],
    always: [
      {
        icon: 'material-symbols:search-rounded',
        text: t.button.search(),
        onclick: 'search_modal.showModal()',
      },
    ],
  },
};

export const fastActionsConfig: FastActionsConfig = {
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
  columns: [
    {
      title: t.navigation.title(),
      items: [
        { text: t.navigation.home(), link: '/' },
        { text: t.navigation.archive.title(), link: '/archives/' },
        { text: t.navigation.about(), link: '/about/' },
        { text: t.button.subscribe(), link: '/rss.xml' },
      ],
    },
    {
      title: t.navigation.friendLinks(),
      items: linksConfig.items
        .flatMap((group) =>
          group.groupItems.map((item) => ({ text: item.name, link: item.url }))
        )
        .slice(0, 5),
    },
  ],
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
        link: 'https://codeberg.org/HPCesia/AstralHalo',
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
