import i18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';

export function pathsEqual(path1: string, path2: string) {
  const normalizedPath1 = path1.replace(/^\/|\/$/g, '').toLowerCase();
  const normalizedPath2 = path2.replace(/^\/|\/$/g, '').toLowerCase();
  return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
  const joined = parts.join('/');
  return joined.replace(/\/+/g, '/');
}

export function url(path: string) {
  return joinUrl('', import.meta.env.BASE_URL, path);
}

export function getCategoryUrl(category: string): string {
  if (category === i18n(i18nKey.uncategorized)) return url('/archives/category/uncategorized/');
  return url(`/archives/categories/${category}/1/`);
}
