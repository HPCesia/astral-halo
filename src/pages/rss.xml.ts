import { siteConfig } from '@/config';
import rss from '@astrojs/rss';
import { getSortedPosts } from '@utils/content-utils';
import type { AstroGlobal } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

export async function GET(context: AstroGlobal) {
  const posts = await getSortedPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site: context.site || '',
    stylesheet: '/rss/styles.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/posts/${post.data.slug}`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
  });
}
