import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: 'src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    published: z.date(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    cover: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(''),
    lang: z.string().optional().default(''),
    comment: z.boolean().optional().default(true),
  }),
});

const specCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
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
  spec: specCollection,
};
