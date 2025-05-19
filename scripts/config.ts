export interface Config {
  draftsDir: string;
  postsDir: string;
  draftStructure: 'category' | 'flat';
  postStructure: 'category' | 'flat';
}

export const config: Config = {
  draftsDir: 'src/content/drafts',
  postsDir: 'src/content/posts',
  draftStructure: 'flat',
  postStructure: 'category',
};
