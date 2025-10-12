import { load } from 'cheerio';
import type { CheerioAPI } from 'cheerio';

export interface LinkPreviewData {
  title: string;
  description: string;
  siteName: string;
  image?: string | null;
  favicon?: string | null;
  url: string;
  fetchedAt: string;
}

interface LinkPreviewFallback {
  title?: string;
  description?: string;
  siteName?: string;
  image?: string | null;
  favicon?: string | null;
}

const previewCache = new Map<string, Promise<LinkPreviewData>>();

function makeAbsolute(resource: string | undefined | null, baseUrl: string): string | null {
  if (!resource) return null;
  try {
    return new URL(resource, baseUrl).href;
  } catch (error) {
    console.warn(`Failed to resolve resource URL for ${resource}`, error);
    return null;
  }
}

type PartialPreview = {
  title?: string | null;
  description?: string | null;
  siteName?: string | null;
  image?: string | null;
  favicon?: string | null;
};

function extractMeta($: CheerioAPI, selector: string): string | null {
  const content = $(selector).attr('content');
  if (!content) return null;
  return content.trim() || null;
}

function createPreviewData(
  url: string,
  partial: PartialPreview,
  fallback: LinkPreviewFallback
): LinkPreviewData {
  const target = new URL(url);

  const title = partial.title?.trim() || fallback.title?.trim() || target.hostname;
  const description = partial.description?.trim() || fallback.description?.trim() || '';
  const siteName = partial.siteName?.trim() || fallback.siteName?.trim() || target.hostname;
  const image = partial.image ?? fallback.image ?? null;
  const favicon = partial.favicon ?? fallback.favicon ?? null;

  return {
    title,
    description,
    siteName,
    image,
    favicon,
    url,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchAndParse(
  url: string,
  fallback: LinkPreviewFallback
): Promise<LinkPreviewData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Astral-Halo-LinkPreview/1.0 (+https://astral-halo.netlify.app)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch preview for ${url}: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = load(html);

    const title =
      extractMeta($, 'meta[property="og:title"]') ||
      extractMeta($, 'meta[name="twitter:title"]') ||
      $('title').first().text().trim() ||
      null;

    const description =
      extractMeta($, 'meta[property="og:description"]') ||
      extractMeta($, 'meta[name="description"]') ||
      extractMeta($, 'meta[name="twitter:description"]') ||
      null;

    const image = makeAbsolute(
      extractMeta($, 'meta[property="og:image"]') ||
        extractMeta($, 'meta[name="twitter:image"]') ||
        $('img[src]').first().attr('src'),
      url
    );

    const siteName =
      extractMeta($, 'meta[property="og:site_name"]') ||
      $('meta[name="application-name"]').attr('content') ||
      $('meta[name="author"]').attr('content') ||
      null;

    const faviconLink = $(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    )
      .map((_, el) => $(el).attr('href')?.trim())
      .get()
      .find(Boolean);

    const favicon = makeAbsolute(faviconLink, url);

    return createPreviewData(url, { title, description, image, siteName, favicon }, fallback);
  } catch (error) {
    console.warn(`[LinkPreview] Failed to fetch ${url}:`, error);
    return createPreviewData(url, {}, fallback);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getLinkPreview(
  url: string,
  fallback: LinkPreviewFallback = {}
): Promise<LinkPreviewData> {
  if (!previewCache.has(url)) {
    const previewPromise = fetchAndParse(url, fallback).catch((error) => {
      previewCache.delete(url);
      throw error;
    });
    previewCache.set(url, previewPromise);
  }

  try {
    return await previewCache.get(url)!;
  } catch {
    return createPreviewData(url, {}, fallback);
  }
}
