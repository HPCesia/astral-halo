import type {
  LicenseConfig,
  ProfileConfig,
  SiteConfig,
  NavbarConfig,
  ToolBarConfig,
} from './types/config';

import I18nKey from '@i18n/I18nKey';

export const siteConfig: SiteConfig = {
  title: 'Astral Halo',
  subtitle: '',
  lang: 'zh_CN', // "en" | "zh_CN" | "zh_TW"
  favicon: [''],
  postsPerPage: 10,
};

export const profileConfig: ProfileConfig = {
  // avatar: 'https://example.com/avatar.png', // must be a absolute URL, if not set, will use src/asset/img/avatar.jpg
  name: 'John Doe',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  links: [],
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
        onclick: '',
      },
    ],
    always: [
      {
        icon: 'material-symbols:casino',
        text: I18nKey.randomPost,
        onclick: '',
      },
      {
        icon: 'material-symbols:search-rounded',
        text: I18nKey.search,
        onclick: '',
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
