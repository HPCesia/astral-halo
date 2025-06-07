import { siteConfig } from '@/config';
import rss from '@astrojs/rss';
import { getSortedPosts } from '@utils/content-utils';
import type { APIRoute } from 'astro';
import sanitizeHtml from 'sanitize-html';

export const GET: APIRoute = async function (context) {
  const posts = await getSortedPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site: context.site || '',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/posts/${post.data.slug}`,
      content: sanitizeHtml(post.rendered?.html || ''),
    })),
  });
};
