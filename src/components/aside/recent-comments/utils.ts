import { t } from '@utils/i18n';

export function cleanCommentHtml(htmlString: string) {
  return htmlString
    .replaceAll(/<img.*?src="(.*?)"?[^>]+>/gi, t.info.commentAbbrs.image())
    .replaceAll(
      /<a[^>]+?href=["']?([^"']+)["']?[^>]*>([^<]+)<\/a>/gi,
      t.info.commentAbbrs.link()
    )
    .replaceAll(/<pre><code[^>]+?>.*?<\/pre>/gis, t.info.commentAbbrs.code())
    .replaceAll(/<[^>]+>/g, '');
}
