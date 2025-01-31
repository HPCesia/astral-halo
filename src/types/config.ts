import type I18nKey from '@i18n/I18nKey';

export type SiteConfig = {
  title: string;
  subtitle: string;
  lang: string;
  favicon: (string | { src: string; theme?: 'light' | 'dark' })[];
  postsPerPage: number;
};

export type ProfileConfig = {
  avatar: string;
  name: string;
  bio?: string;
  links: {
    name: string;
    url: string;
    icon: string;
  }[];
};

export type NavbarConfig = {
  navbarCenterItems: { text: string | I18nKey; href?: string }[];
  navbarRightItems: {
    onlyWide: {
      icon: string;
      text: string | I18nKey;
      href?: string;
      onclick?:
        | string
        | {
            id: string;
            function: (this: HTMLElement, ev: MouseEvent) => unknown;
          };
    }[];
    always: {
      icon: string;
      text: string | I18nKey;
      href?: string;
      onclick?:
        | string
        | {
            id: string;
            function: (this: HTMLElement, ev: MouseEvent) => unknown;
          };
    }[];
  };
};

export type ToolBarConfig = {
  enable: boolean;
  items: {
    icon: string;
    text?: string;
    href?: string;
    onclick?: string;
  }[];
};

export type LicenseConfig = {
  enable: boolean;
  name: string;
  url: string;
};

export type FooterConfig = {
  copyrightYear: number;
  rightItems: (string | { text: string; link?: string; class?: string })[][];
};

export type ArticleConfig = {
  toc: boolean;
  wordCount: boolean;
  readingTime: {
    enable: boolean;
    wordsPerMinute: {
      cjk: number;
      nonCjk: number;
    };
  };
};

export type SearchConfig = {
  enable: boolean;
  provider: 'pagefind' | 'algolia';
};
