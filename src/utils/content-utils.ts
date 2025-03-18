import { buildConfig } from '@/config';
import type { BlogPostData } from '@/types/data';
import type { BlogPost } from '@/types/data';
import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';
import { type CollectionEntry, getCollection, render } from 'astro:content';
import dayjs from 'dayjs';

export async function getPosts() {
  const posts = await getCollection('posts');
  const onDev = import.meta.env.DEV;
  if (onDev && buildConfig.showDraftsOnDev) {
    const drafts = (await getCollection('drafts')) as unknown as CollectionEntry<'posts'>[];
    drafts.forEach(async (draft) => {
      if (draft.data.published !== undefined) return;
      const { remarkPluginFrontmatter } = await render(draft);
      const published = dayjs(remarkPluginFrontmatter.createAt as string).toDate();
      draft.data.published = published;
      draft.data.draft = true;
    });
    return [...posts, ...drafts];
  }
  return posts;
}

export async function getSortedPosts(): Promise<BlogPost[]> {
  const allBlogPosts = (await getPosts()) as unknown as BlogPost[];
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

export async function getCategories(): Promise<Map<string, number>> {
  const allBlogPosts = await getSortedPosts();
  const categoryMap = new Map<string, number>();

  allBlogPosts.forEach((post) => {
    const category = post.data.category || (i18n(I18nKey.uncategorized) as string);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  return categoryMap;
}

export async function getTags(): Promise<Map<string, number>> {
  const allBlogPosts = await getSortedPosts();
  const tagMap = new Map<string, number>();

  allBlogPosts.forEach((post) => {
    const tags = post.data.tags || [];
    tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return tagMap;
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
