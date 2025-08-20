import type PhotoSwipeLightbox from 'photoswipe/lightbox';
import type { Swup } from 'swup';

declare global {
  interface Window {
    swup: Swup;
    lightbox: typeof PhotoSwipeLightbox;
    pswpModuleImporter: () => Promise<typeof import('photoswipe')>;
  }

  const twikoo: {
    init: (options: {
      envId: string;
      el: string;
      region?: string;
      path?: string;
      lang?: string;
      onCommentLoaded?: () => void;
    }) => Promise<void>;
    getCommentsCount: (options: {
      envId: string;
      urls: string[];
      includeReply?: boolean;
    }) => Promise<{ url: string; count: number }[]>;
    getRecentComments: (options: {
      envId: string;
      urls?: string[];
      pageSize?: number;
      includeReply?: boolean;
    }) => Promise<
      {
        id: string;
        url: string;
        nick: string;
        mailMd5: string;
        link: string;
        comment: string;
        commentText: string;
        created: number;
        avatar: string;
        relativeTime: string;
      }[]
    >;
  };
}
