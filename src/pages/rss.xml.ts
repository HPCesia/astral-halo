import { siteConfig } from '@/config';
import { getContainerRenderer as mdxContainerRenderer } from '@astrojs/mdx';
import rss from '@astrojs/rss';
import Markdown from '@components/utils/Markdown.astro';
import { getAllReferences, getSortedPosts } from '@utils/content-utils';
import type { APIRoute } from 'astro';
import { experimental_AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import sanitizeHtml from 'sanitize-html';

const renderers = await loadRenderers([mdxContainerRenderer()]);
const container = await experimental_AstroContainer.create({
  renderers,
});

export const GET: APIRoute = async function (context) {
  const posts = await getSortedPosts();
  const allReferences = await getAllReferences();
  const rssItems = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/posts/${post.data.slug}`,
      content: sanitizeHtml(
        await container.renderToString(Markdown, {
          slots: {
            default: await container.renderToString(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (await render({ collection: 'posts', ...post } as any)).Content
            ),
          },
          props: {
            'bidirectional-references': await (async () => {
              const allRefByCurrent = allReferences.filter((it) => it.refBy.id === post.id);
              const { remarkPluginFrontmatter } = await render({
                collection: 'posts',
                ...post,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any);

              const references: {
                reference: string;
                context: string;
                id: string;
              }[] =
                (
                  remarkPluginFrontmatter.references as {
                    reference: string;
                    context: string;
                    id: string;
                  }[]
                )?.map((it) => ({
                  reference: it.reference.split('#')[0],
                  context: it.context,
                  id: it.id,
                })) || [];
              return { references, allRefByCurrent };
            })(),
          },
        })
      ),
    }))
  );
  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site: context.site || '',
    items: rssItems,
  });
};
