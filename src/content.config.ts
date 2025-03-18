import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*', '!**/_*/**'],
    base: 'src/content/posts',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      published: z.date(),
      draft: z.boolean().optional().default(false),
      description: z.string().optional().default(''),
      cover: image().optional(),
      tags: z.array(z.string()).optional().default([]),
      category: z.string().optional().default(''),
      lang: z.string().optional().default(''),
      comment: z.boolean().optional().default(true),
    }),
});

const draftsCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*', '!**/_*/**'],
    base: 'src/content/drafts',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string().optional().default(''),
      cover: image().optional(),
      tags: z.array(z.string()).optional().default([]),
      category: z.string().optional().default(''),
      lang: z.string().optional().default(''),
      comment: z.boolean().optional().default(true),
    }),
});

const specCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*', '!**/_*/**'],
    base: 'src/content/spec',
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    comment: z.boolean().optional().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
  drafts: draftsCollection,
  spec: specCollection,
};
