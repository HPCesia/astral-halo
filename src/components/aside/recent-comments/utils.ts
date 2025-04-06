import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';

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
