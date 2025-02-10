import type { AstroGlobal, MarkdownHeading } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { type CollectionEntry, render } from 'astro:content';

const renderedInstance = new Set<string>();

export function isFirstInstance(id: string, url: AstroGlobal['url']): boolean {
  const key = `${id}-${url.pathname}`;
  if (renderedInstance.has(key)) {
    return false;
  }
  renderedInstance.add(key);
  return true;
}

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
