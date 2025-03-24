import type I18nKey from '@i18n/I18nKey';

// ============================================================================
export type Favicon = {
  /**
   * The URL of the favicon.
   *
   * favicon 的 URL。
   */
  src: string;
  /**
   * The sizes of the favicon.
   *
   * favicon 的尺寸。
   */
  sizes?: `${string}x${string}`;
};

export type ButtonSubConfig<T extends string> = T extends 'text'
  ? {
      /**
       * The text of the button.
       *
       * 按钮的文本。
       */
      text: string | I18nKey;
    } & (
      | {
          /**
           * The URL of the button.
           *
           * 按钮的 URL。
           */
          href?: string;
        }
      | {
          /**
           * The function to be called when the button is clicked.
           *
           * 当按钮被点击时要调用的函数。
           */
          onclick?:
            | string
            | {
                id: string;
                function: (this: HTMLElement, ev: MouseEvent) => unknown;
              };
        }
    )
  : T extends 'icon'
    ? {
        /**
         * The icon of the button. Should be a name of iconify icon.
         *
         * 按钮的图标。应该是一个 iconify 图标的名称。
         */
        icon: string;
        /**
         * The text of the button.
         *
         * 按钮的文本。
         */
        text?: string | I18nKey;
      } & (
        | {
            /**
             * The URL of the button.
             *
             * 按钮的 URL。
             */
            href?: string;
          }
        | {
            /**
             * The function to be called when the button is clicked.
             *
             * 当按钮被点击时要调用的函数。
             */
            onclick?:
              | string
              | {
                  id: string;
                  function: (this: HTMLElement, ev: MouseEvent) => unknown;
                };
          }
      )
    : never;

// ============================================================================

export type SiteConfig = {
  /**
   * The title of the site.
   *
   * 站点的标题。
   */
  title: string;
  /**
   * The subtitle of the site.
   *
   * 站点的副标题。
   */
  subtitle: string;
  /**
   * The language of the site.
   *
   * 站点的语言。
   */
  lang: string;
  /**
   * The favicon of the site.
   *
   * 站点的 favicon。
   */
  favicon: Favicon[];
  /**
   * The time when the site was created.
   *
   * 站点建立时间
   */
  createAt: Date;
  /**
   * The number of posts displayed per page.
   *
   * 每页显示的文章数量。
   */
  postsPerPage: number;
  /**
   * The configuration of the banner.
   *
   * 横幅的配置。
   */
  banner:
    | false
    | {
        /**
         * The URL of the banner.
         *
         * 横幅的 URL。
         */
        src: string;
        /**
         * The height of the banner in homepage.
         *
         * 主页中横幅的高度。
         */
        homepageHeight: `${number}${'vh' | 'rem' | 'px'}`;
        /**
         * The height of the banner in post page.
         *
         * 文章页面中横幅的高度。
         */
        postHeight: `${number}${'vh' | 'rem' | 'px'}`;
        /**
         * The height of the banner in pages.
         *
         * 页面中横幅的高度。
         */
        pagesHeight: {
          /**
           * The regular expression of the page path.
           *
           * 页面路径的正则表达式。
           */
          pagePathRegex: RegExp;
          /**
           * The height of the banner.
           *
           * 横幅的高度。
           */
          height: `${number}${'vh' | 'rem' | 'px'}`;
        }[];
        /**
         * The default height of the banner.
         *
         * 横幅的默认高度。
         */
        defaultHeight: `${number}${'vh' | 'rem' | 'px'}`;
      };
};

export type BuildConfig = {
  /**
   * Whether to show drafts on development mode.
   *
   * 是否在开发模式下显示草稿。
   */
  showDraftsOnDev: boolean;
  /**
   * Fetch the size data of remote images during build.\
   * This feature **CAN NOT** fetch images in `.md` files.
   * To fetch images in `.md` files, see https://docs.astro.build/en/reference/configuration-reference/#imageservice
   *
   * 在构建时获取远程图像的大小数据。\
   * 需要注意，本功能**不能**获取 `.md` 中的图像。
   * 获取 `.md` 中的图像，请参考 https://docs.astro.build/zh-cn/reference/configuration-reference/#imageservice
   */
  inferRemoteImageSize: {
    /**
     * Whether to enable the feature. Enabling this can reduce cumulative layout shift, but will increase build time.
     *
     * 是否开启此功能。开启后，能够减少累计布局位移，但是会增加构建时间。
     */
    enable: boolean;
    /**
     * The default size of the image. This will be used when the size of the image cannot be fetched or the feature is disabled.
     *
     * 图像的默认大小。当无法获取图像的大小或功能被禁用时，将使用此值。
     */
    defaultSize: {
      width: number;
      height: number;
    };
  };
};

export type ProfileConfig = {
  /**
   * The avatar of the profile.
   *
   * 头像。
   */
  avatar: string;
  /**
   * The name of the profile.
   *
   * 名字。
   */
  name: string;
  /**
   * The bio of the profile.
   *
   * 简介。
   */
  bio?: string;
  /**
   * The social links of the profile.
   *
   * 社交链接。
   */
  socialLinks: {
    /**
     * The title of the link.
     *
     * 链接的标题。
     */
    name: string;
    /**
     * The URL of the link.
     *
     * 链接的 URL。
     */
    url: string;
    /**
     * The icon of the link. Should be a name of iconify icon.
     *
     * 链接的图标。应该是一个 iconify 图标的名称。
     */
    icon: string;
  }[];
};

export type LinksConfig = {
  /**
   * The items displayed in the links.
   *
   * 在友情链接中显示的项目。
   */
  items: {
    /**
     * The name of the group.
     *
     * 组的名称。
     */
    groupName: string;
    /**
     * The description of the group.
     *
     * 组的描述。
     */
    groupDescription?: string;
    /**
     * The items displayed in the group.
     *
     * 在组中显示的项目。
     */
    groupItems: {
      /**
       * The name of the link.
       *
       * 链接的名称。
       */
      name: string;
      /**
       * The URL of the link.
       *
       * 链接的 URL。
       */
      url: string;
      /**
       * The avatar of the link.
       *
       * 链接的头像。
       */
      avatar: string;
      /**
       * The description of the link.
       *
       * 链接的描述。
       */
      description?: string;
    }[];
  }[];
};

export type NavbarConfig = {
  /**
   * The items displayed in the center of the navbar.
   *
   * 在导航栏中间显示的项目。
   */
  navbarCenterItems: (
    | ButtonSubConfig<'text'>
    | {
        /**
         * The title of the group.
         *
         * 组的标题。
         */
        title: string | I18nKey;
        /**
         * The items displayed in the group.
         *
         * 在组中显示的项目。
         */
        items: ButtonSubConfig<'text'>[];
      }
  )[];
  /**
   * The items displayed in the right of the navbar.
   *
   * 在导航栏右侧显示的项目。
   */
  navbarRightItems: {
    /**
     * The items displayed only in wide screen (greater than 768px).
     *
     * 仅在宽屏幕（大于 768px）显示的项目。
     */
    onlyWide: ButtonSubConfig<'icon'>[];
    /**
     * The items displayed always.
     *
     * 总是显示的项目。
     */
    always: ButtonSubConfig<'icon'>[];
  };
};

export type ToolBarConfig = {
  /**
   * Whether to enable the side toolbar.
   *
   * 是否启用侧边工具栏。
   */
  enable: boolean;
  /**
   * The items displayed in the side toolbar.
   *
   * 在侧边工具栏中显示的项目。
   */
  items: ButtonSubConfig<'icon'>[];
};

export type AsideConfig = {
  siteInfo: {
    /**
     * The contents displayed in the site info.
     *
     * 在站点信息中显示的内容。
     */
    contents: ('stats' | 'tags')[];
    /**
     * The stats displayed in the site info.
     *
     * 在站点信息中显示的统计数据。
     */
    stats: ('post-count' | 'last-updated' | 'site-words-count' | 'site-run-days')[];
  };
  /**
   * Recent comments card.
   *
   * 最近评论卡片
   */
  recentComment: {
    /**
     * Whether to enable the recent comments card.
     *
     * 是否启用最近评论卡片。
     */
    enable: boolean;
    /**
     * The number of recent comments displayed.
     *
     * 显示的最近评论数量。
     */
    count: number;
    /**
     * Whether to show the avatar of the commenter.
     *
     * 是否显示评论者的头像。
     */
    showAvatar: boolean;
  };
};

export type LicenseConfig = {
  /**
   * Whether to enable the license.
   *
   * 是否启用许可证。
   */
  enable: boolean;
  /**
   * The name of the license.
   *
   * 许可证的名称。
   */
  name: string;
  /**
   * The link of the license.
   *
   * 许可证的链接。
   */
  url: string;
};

export type FooterConfig = {
  /**
   * The start year of the copyright.
   *
   * 版权开始年份。
   */
  copyrightYear: number;
  /**
   * The items displayed in the right of the footer.
   *
   * 在页脚右侧显示的项目。
   */
  rightItems: (string | { text: string; link?: string; class?: string })[][];
};

export type ArticleConfig = {
  /**
   * Whether to enable the table of contents.
   *
   * 是否启用目录。
   */
  toc: boolean;
  /**
   * Whether to enable the word count.
   *
   * 是否启用字数统计。
   */
  wordCount: boolean;
  /**
   * The configuration of the reading time.
   *
   * 阅读时间的配置。
   */
  readingTime: boolean;
};

export type SearchConfig = {
  /**
   * Whether to enable search.
   *
   * 是否启用搜索。
   */
  enable: boolean;
  /**
   * The provider of the search.
   *
   * 搜索的提供者。
   */
  provider: 'pagefind';
};

export type CommentConfig = {
  /**
   * Whether to enable comments.
   *
   * 是否启用评论。
   */
  enable: boolean;
  /**
   * The provider of the comments.
   *
   * 评论的提供者。
   */
  provider: 'twikoo' | 'giscus' | 'waline';
  /**
   * The configuration of Twikoo.
   *
   * Twikoo 的配置。
   *
   * @see https://twikoo.js.org/
   */
  twikoo?: {
    /**
     * The envID of Twikoo.
     *
     * Twikoo 的 envID。
     */
    envId: string;
    /**
     * The region of Twikoo backend.
     *
     * Twikoo 后端的地区设置。
     */
    region?: string;
  };
  /**
   * The configuration of Giscus.
   *
   * Giscus 的配置。
   *
   * @see https://giscus.app/
   */
  giscus?: {
    /**
     * The repo used by Giscus.
     *
     * Giscus 使用的 repo。
     */
    repo: `${string}/${string}`;
    /**
     * The repo ID generated by Giscus.
     *
     * Giscus 生成的 repo ID。
     *
     * @see https://giscus.app/
     */
    repoId: string;
    /**
     * The category used by Giscus.
     *
     * Giscus 使用的 discussion 分类。
     *
     * @suggest Announcement
     */
    category: string;
    /**
     * The category ID generated by Giscus.
     *
     * Giscus 生成的分类 ID。
     *
     * @see https://giscus.app/
     */
    categoryId: string;
    /**
     * The mapping of the discussion.
     *
     * 讨论的映射。
     *
     * @suggest 'og:title'
     * @see https://giscus.app/
     */
    mapping:
      | 'pathname'
      | 'url'
      | 'title'
      | 'og:title'
      | {
          type: 'specific' | 'number';
          term: string | number;
        };
    /**
     * The theme of Giscus.
     *
     * Giscus 的主题。
     *
     * @default 'preferred_color_scheme'
     * @see https://giscus.app/
     */
    theme?: string;
    /**
     * The position of the comment box.
     *
     * 评论框的位置
     *
     * @default 'bottom'
     */
    inputPosition?: 'top' | 'bottom';
    /**
     * Whether to enable reactions.
     *
     * 是否启用表情。
     *
     * @default false
     */
    reactionsEnabled?: boolean;
    /**
     * Whether to enable metadata emit.
     *
     * 是否启用元数据输出。
     *
     * @default false
     * @see https://giscus.app/
     */
    emitMetadata?: boolean;
    /**
     * The language setting of Giscus.
     *
     * Giscus 的语言设置。
     *
     * @default siteConfig.lang
     */
    lang?: string;
    /**
     * Whether to lazy load the comment area.
     *
     * 是否懒加载评论区
     *
     * @default true
     */
    lazyLoad?: boolean;
  };
  /**
   * The configuration of Waline.
   *
   * Waline 的配置。
   *
   * @see https://waline.js.org/
   */
  waline?: {
    /**
     * The server URL of Waline.
     *
     * Waline 的服务端地址。
     *
     * @see https://waline.js.org/reference/client/props.html#serverurl
     */
    serverURL: string;
    /**
     * The path processor of the page.
     * The parameter is `Astro.url.pathname`, and the return value will be passed to Waline as `path`.
     *
     * 页面路径处理器。传入参数为 `Astro.url.pathname`，返回值将传入 Waline 作为 `path`。
     *
     * @default (path) => path
     * @see https://docs.astro.build/reference/api-reference/#url
     * @see https://waline.js.org/reference/client/props.html#path
     */
    path?: (path: string) => string;
    /**
     * Reviewer attributes of Waline.
     *
     * Waline 的评论者相关属性。
     *
     * @default ['nick', 'mail', 'link']
     * @see https://waline.js.org/reference/client/props.html#meta
     */
    meta?: ('nick' | 'mail' | 'link')[];
    /**
     * Required reviewer attributes of Waline.
     *
     * Waline 的评论者必填属性。
     *
     * @default []
     * @see https://waline.js.org/reference/client/props.html#requiredmeta
     */
    requiredMeta?: [] | ['nick'] | ['nick', 'mail'];
    /**
     * Whether to enable or force to login.
     *
     * 是否启用或强制登录。
     *
     * @default 'enable'
     * @see https://waline.js.org/reference/client/props.html#login
     */
    login?: 'enable' | 'disable' | 'force';
    /**
     * The word limit of the comment.
     *
     * 评论的字数限制。
     *
     * @default 500
     * @see https://waline.js.org/reference/client/props.html#wordlimit
     */
    wordLimit?: number;
    /**
     * The page size of the comments.
     *
     * 评论的分页大小。
     *
     * @default 10
     * @see https://waline.js.org/reference/client/props.html#pagesize
     */
    pageSize?: number;
    /**
     * Whether to enable reactions.
     *
     * 是否启用表情。
     *
     * @default false
     * @see https://waline.js.org/reference/client/props.html#reaction
     */
    reaction?: boolean | string[];
  };
};
