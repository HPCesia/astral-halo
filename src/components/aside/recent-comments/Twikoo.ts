import {
  cleanCommentHtml,
  cleanPlaceholders,
  createCommentItem,
  getTemplate,
} from './utils.ts';
import { asideConfig, commentConfig } from '@/config';
import { loadScript } from '@/scripts/utils';
import { CDN } from '@constants/cdn.mjs';

const twikooConfig = commentConfig.twikoo!;

async function setup() {
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

  const { container, template } = getTemplate()!;
  if (container && !template) {
    // 说明已经加载完毕, 模板被删除了
    return;
  }

  recentComments.forEach((comment) =>
    createCommentItem(container, template!, {
      avatarUrl: comment.avatar,
      commentContent: cleanCommentHtml(comment.comment),
      commentUrl: `${comment.url}#${comment.id}`,
      author: comment.nick,
      time: new Date(comment.created),
    })
  );

  cleanPlaceholders(container, template!);
}

document.addEventListener('astro:page-load', setup);
await setup();
