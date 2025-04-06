import type { CommentData, CommentProvider } from './types';
import { cleanCommentHtml } from './utils';
import { asideConfig, commentConfig } from '@/config';
import { loadScript } from '@/scripts/utils';
import { CDN } from '@constants/cdn';

const twikooConfig = commentConfig.twikoo!;

export const TwikooProvider: CommentProvider = {
  async setup() {
    const waitTwikoo = () => {
      if (typeof twikoo === 'undefined') {
        setTimeout(waitTwikoo, 100);
      }
    };

    // 判断当前页面是否已经加载了 Twikoo 的脚本
    // 如果没有加载，则动态加载
    const twikooWrapper = document.getElementById('twikoo-wrap');
    if (!twikooWrapper) {
      await loadScript(CDN.twikoo);
    }
    waitTwikoo();

    const recentComments = await twikoo.getRecentComments({
      envId: twikooConfig.envId,
      pageSize: asideConfig.recentComment.count,
    });

    return recentComments.map(
      (comment): CommentData => ({
        avatarUrl: comment.avatar,
        commentContent: cleanCommentHtml(comment.comment),
        commentUrl: `${comment.url}#${comment.id}`,
        author: comment.nick,
        time: new Date(comment.created),
      })
    );
  },
};
