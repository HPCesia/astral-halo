export type BlogPostData = {
  body: string;
  title: string;
  abbrlink: string;
  published: Date;
  description: string;
  tags: string[];
  draft?: boolean;
  cover?: string;
  category?: string;
};
