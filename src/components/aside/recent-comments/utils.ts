import { siteConfig } from '@/config';
import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';

export function getTemplate() {
  const recentCommentsCard = document.getElementById('recent-comments-card');
  if (!recentCommentsCard) {
    console.error('Recent comments card not found');
    return;
  }
  const recentCommentsList = recentCommentsCard.querySelector('ul')!;
  const recentCommentTemplate = recentCommentsList.querySelector('template');
  return {
    container: recentCommentsList,
    template: recentCommentTemplate,
  };
}

export function cleanCommentHtml(htmlString: string) {
  return htmlString
    .replaceAll(/<img.*?src="(.*?)"?[^>]+>/gi, i18n(I18nKey.commentReplaceImage)!)
    .replaceAll(
      /<a[^>]+?href=["']?([^"']+)["']?[^>]*>([^<]+)<\/a>/gi,
      i18n(I18nKey.commentReplaceLink)!
    )
    .replaceAll(/<pre><code[^>]+?>.*?<\/pre>/gis, i18n(I18nKey.commentReplaceCode)!)
    .replaceAll(/<[^>]+>/g, '');
}

export function createCommentItem(
  container: HTMLUListElement,
  template: HTMLTemplateElement,
  data: {
    avatarUrl: string;
    commentContent: string;
    commentUrl: string;
    author: string;
    time: Date;
  }
) {
  const item = template.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  const avatarLinkEl = item.querySelector('a.avatar')!;
  const avatarWrapper = avatarLinkEl.querySelector('div')!;
  const avatarImg = new Image();
  const comment = item.querySelector('a.line-clamp-2')!;
  const time = item.querySelector('time')!;

  avatarLinkEl.setAttribute('href', data.commentUrl);
  comment.setAttribute('href', data.commentUrl);

  avatarImg.src = data.avatarUrl;
  avatarImg.alt = data.author;
  avatarWrapper.appendChild(avatarImg);

  comment.innerHTML = data.commentContent;
  time.setAttribute('datetime', data.time.toISOString());
  time.innerText = data.time.toLocaleDateString(siteConfig.lang.replace('_', '-'), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  container.appendChild(item);
}

export function cleanPlaceholders(container: HTMLUListElement, template: HTMLTemplateElement) {
  template.remove();
  const placeholders = container.querySelectorAll('.comment-placeholder');
  placeholders.forEach((placeholder) => {
    placeholder.remove();
  });
}
