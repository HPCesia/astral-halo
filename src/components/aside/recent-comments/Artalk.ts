import {
  cleanCommentHtml,
  cleanPlaceholders,
  createCommentItem,
  getTemplate,
} from './utils.ts';
import { asideConfig, commentConfig } from '@/config';

async function setup() {
  const artalkConfig = commentConfig.artalk!;
  const commentCount = asideConfig.recentComment.count;

  const apiCommentUrl = new URL(
    `api/v2/stats/latest_comments?limit=${commentCount}`,
    artalkConfig.serverURL
  ).toString();
  const apiConfigUrl = new URL(`api/v2/conf`, artalkConfig.serverURL).toString();

  const responseComment = fetch(apiCommentUrl, {
    method: 'GET',
  });
  const responseConfig = fetch(apiConfigUrl, {
    method: 'GET',
  });
  if (!(await responseComment).ok) {
    throw new Error('Failed to fetch recent comments');
  }
  if (!(await responseConfig).ok) {
    throw new Error('Failed to fetch comment config');
  }

  const commentData: {
    id: number;
    nick: string;
    content_marked: string;
    date: string;
    email_encrypted: string;
    page_url: string;
  }[] = (await (await responseComment).json()).data;
  const configData: {
    gravatar: {
      mirror: string;
      params: string;
    };
  } = (await (await responseConfig).json()).frontend_conf;

  const getAvatarUrl = (email: string) => {
    return `${configData.gravatar.mirror}${email}?${configData.gravatar.params}`;
  };

  const { container, template } = getTemplate()!;
  if (container && !template) {
    // 说明已经加载完毕, 模板被删除了
    return;
  }

  commentData.forEach((item) =>
    createCommentItem(container, template!, {
      avatarUrl: getAvatarUrl(item.email_encrypted),
      commentContent: cleanCommentHtml(item.content_marked),
      commentUrl: `${item.page_url}#atk-comment-${item.id}`,
      author: item.nick,
      time: new Date(item.date),
    })
  );

  cleanPlaceholders(container, template!);
}

document.addEventListener('astro:page-load', setup);
await setup();
