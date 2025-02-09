import type { BlogPostData } from '@/types/data';
import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';
import { getCollection } from 'astro:content';

export async function getSortedPosts(): Promise<{ body: string; data: BlogPostData }[]> {
  const allBlogPosts = (await getCollection('posts')) as unknown as {
    body: string;
    data: BlogPostData;
  }[];
  const sortedBlogPosts = allBlogPosts.sort(
    (a: { data: BlogPostData }, b: { data: BlogPostData }) => {
      const dateA = new Date(a.data.published);
      const dateB = new Date(b.data.published);
      return dateA > dateB ? -1 : 1;
    }
  );
  return sortedBlogPosts;
}

export async function getPostsCount(): Promise<number> {
  const allBlogPosts = (await getCollection('posts')) as unknown as {
    body: string;
    data: BlogPostData;
  }[];
  return allBlogPosts.length;
}

export async function getCategories(): Promise<string[]> {
  const allBlogPosts = await getSortedPosts();
  const categories = [
    ...new Set(
      allBlogPosts.map((post) => post.data.category || (i18n(I18nKey.uncategorized) as string))
    ),
  ];
  return categories;
}

export async function getTags(): Promise<string[]> {
  const allBlogPosts = await getSortedPosts();
  const tags = [...new Set(allBlogPosts.map((post) => post.data.tags || []).flat())];
  return tags;
}

export function getCategoryUrl(category: string | undefined) {
  return category
    ? `/archives/categories/${category.replaceAll(/[\\/]/g, '-')}/1/`
    : `/archives/categories/${I18nKey.uncategorized}/1/`;
}

export function getTagUrl(tag: string) {
  return tag === i18n(I18nKey.untagged)
    ? `/archives/tags/${I18nKey.untagged}/1`
    : `/archives/tags/${tag.replaceAll(/[\\/]/g, '-')}/1`;
}
