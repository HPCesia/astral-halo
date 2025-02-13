import type { BlogPostData } from '@/types/data';
import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';
import type { MarkdownHeading } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.d.ts';
import { getCollection } from 'astro:content';
import { type CollectionEntry, render } from 'astro:content';

interface RenderResult {
  Content: AstroComponentFactory;
  headings: MarkdownHeading[];
  remarkPluginFrontmatter: Record<string, unknown>;
}

const renderCache = new Map<string, RenderResult>();

export async function getOrCreateRenderResult(article: CollectionEntry<'posts'>) {
  const cacheKey = article.id;

  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }

  const { Content, headings, remarkPluginFrontmatter } = await render(article);
  const result = { Content, headings, remarkPluginFrontmatter };

  renderCache.set(cacheKey, result);
  return result;
}

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
