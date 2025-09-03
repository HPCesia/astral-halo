import type { CommentData, CommentProvider } from './types';
import { cleanCommentHtml } from './utils';
import { asideConfig, commentConfig } from '@/config';
import { t } from '@utils/i18n';

export const ArtalkProvider: CommentProvider = {
  async setup() {
    const artalkConfig = commentConfig.artalk!;
    const desiredCount = asideConfig.recentComment.count;

    const apiBase = artalkConfig.serverURL;
    const apiConfigUrl = new URL(`api/v2/conf`, apiBase).toString();

    // fetch comment config first
    const responseConfig = await fetch(apiConfigUrl, { method: 'GET' });
    if (!responseConfig.ok) {
      throw new Error('Failed to fetch comment config');
    }
    const configData: {
      gravatar: {
        mirror: string;
        params: string;
      };
    } = (await responseConfig.json()).frontend_conf;

    const getAvatarUrl = (email: string) => {
      return `${configData.gravatar.mirror}${email}?${configData.gravatar.params}`;
    };

    // type for items returned by Artalk
    type FetchItem = {
      id: number;
      nick: string;
      content_marked: string;
      date: string;
      email_encrypted: string;
      page_url: string;
      is_collapsed: boolean;
      visible: boolean;
    }[];

    const collected: FetchItem = [];
    const seenIds = new Set<number>();
    let attempt = 0;
    let limit = desiredCount;
    let prevCollectedCount = 0;

    while (collected.length < desiredCount && attempt < 3) {
      const apiCommentUrl = new URL(
        `api/v2/stats/latest_comments?limit=${limit}`,
        apiBase
      ).toString();
      const resp = await fetch(apiCommentUrl, { method: 'GET' });
      if (!resp.ok) {
        throw new Error('Failed to fetch recent comments');
      }
      const data: FetchItem = (await resp.json()).data || [];

      let addedThisRound = 0;
      for (const item of data) {
        if (!item.visible) continue; // skip invisible comments
        if (seenIds.has(item.id)) continue; // dedupe
        collected.push(item);
        seenIds.add(item.id);
        addedThisRound++;
        if (collected.length >= desiredCount) break;
      }

      // if increasing limit didn't yield any new visible comments, stop
      if (addedThisRound === 0 && prevCollectedCount === collected.length) {
        break;
      }

      prevCollectedCount = collected.length;
      if (collected.length >= desiredCount) break;

      // increase limit to try to fetch more next round
      limit = limit + (desiredCount - collected.length);
      attempt++;
    }

    // map to CommentData and return up to desiredCount
    return collected.slice(0, desiredCount).map(
      (item): CommentData => ({
        avatarUrl: getAvatarUrl(item.email_encrypted),
        commentContent: item.is_collapsed
          ? t.info.commentAbbrs.collapsed()
          : cleanCommentHtml(item.content_marked),
        commentUrl: `${item.page_url}#atk-comment-${item.id}`,
        author: item.nick,
        time: new Date(item.date),
      })
    );
  },
};
