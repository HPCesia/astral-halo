import type { ImageMetadata } from 'astro';
import type { RenderedContent } from 'astro:content';

export type BlogPostData = {
  body: string;
  title: string;
  slug: string;
  published: Date;
  description: string;
  tags: string[];
  draft?: boolean;
  cover?: ImageMetadata;
  category?: string;
  comment?: boolean;
};

export type BlogPost = {
  id: string;
  body: string;
  data: BlogPostData;
  rendered?: RenderedContent & {
    headings?: MarkdownHeading[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter?: Record<string, any>;
  };
  filePath?: string;
};
