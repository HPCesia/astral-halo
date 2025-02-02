export type BlogPostData = {
  body: string;
  title: string;
  slug: string;
  published: Date;
  description: string;
  tags: string[];
  draft?: boolean;
  cover?: string;
  category?: string;
  comment?: boolean;
};
