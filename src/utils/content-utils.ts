import { buildConfig } from '@/config';
import type { BlogPostData } from '@/types/data';
import type { BlogPost } from '@/types/data';
import I18nKey from '@i18n/I18nKey';
import { i18n } from '@i18n/translation';
import { type CollectionEntry, getCollection, render } from 'astro:content';
import dayjs from 'dayjs';

export async function getPosts() {
  const posts = await getCollection('posts');
  const onDev = import.meta.env.DEV;
  if (onDev && buildConfig.showDraftsOnDev) {
    const drafts = (await getCollection('drafts')) as unknown as CollectionEntry<'posts'>[];
    drafts.forEach(async (draft) => {
      if (draft.data.published !== undefined) return;
      const { remarkPluginFrontmatter } = await render(draft);
      const published = dayjs(remarkPluginFrontmatter.createAt as string).toDate();
      draft.data.published = published;
      draft.data.draft = true;
    });
    return [...posts, ...drafts];
  }
  return posts;
}

export async function getSortedPosts(): Promise<BlogPost[]> {
  const allBlogPosts = (await getPosts()) as unknown as BlogPost[];
  const sortedBlogPosts = allBlogPosts.sort(
    (a: { data: BlogPostData }, b: { data: BlogPostData }) => {
      const dateA = new Date(a.data.published);
      const dateB = new Date(b.data.published);
      return dateA > dateB ? -1 : 1;
    }
  );
  return sortedBlogPosts;
}

export async function getPostsCount(): Promise<number> {
  const allBlogPosts = (await getCollection('posts')) as unknown as {
    body: string;
    data: BlogPostData;
  }[];
  return allBlogPosts.length;
}

export async function getCategories(): Promise<Map<string, number>> {
  const allBlogPosts = await getSortedPosts();
  const categoryMap = new Map<string, number>();

  allBlogPosts.forEach((post) => {
    const category = post.data.category || (i18n(I18nKey.uncategorized) as string);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  return categoryMap;
}

export async function getTags(): Promise<Map<string, number>> {
  const allBlogPosts = await getSortedPosts();
  const tagMap = new Map<string, number>();

  allBlogPosts.forEach((post) => {
    const tags = post.data.tags || [];
    tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return tagMap;
}

export function getCategoryUrl(category: string | undefined) {
  return category
    ? `/archives/categories/${category.replaceAll(/[\\/]/g, '-')}/1/`
    : `/archives/categories/${I18nKey.uncategorized}/1/`;
}

export function getTagUrl(tag: string) {
  return tag === i18n(I18nKey.untagged)
    ? `/archives/tags/${I18nKey.untagged}/1`
    : `/archives/tags/${tag.replaceAll(/[\\/]/g, '-')}/1`;
}

/**
 * 获取所有的引用，返回一个数组
 */
export async function getAllReferences() {
  type frontmatterRef = {
    /** 引用的文章，即 [[ref|alias]] 中的 ref 部分 */
    reference: string;
    /** 引用的上下文，即整个 xxxx[[ref|alias]]xxxx 的内容，截取前后 20 个字符 */
    context: string;
    /** 引用的偏移量，即 [[ref|alias]] 在上下文字符串中的起始和结束位置 */
    offset: [number, number];
    /** 引用应该被分配的 id，用于通过 #id 跳转 */
    id: string;
  };
  type Article = {
    /** 文章的标题 */
    title: string;
    /** 文章的集合，posts 或 spec，drafts 会被处理为 posts */
    collection: 'posts' | 'spec';
    /** 文章的 id，对 posts 来说是 slug 参数，对 spec 来说是文件名 */
    id: string;
  };

  const posts = await getPosts();
  const specs = await getCollection('spec');

  const pathMap = [
    ...posts.map((it) => ({
      id: it.id,
      title: it.data.title,
      collection: it.collection,
      filePath: it.filePath,
    })),
    ...specs.map((it) => ({
      id: it.id,
      title: it.data.title,
      collection: it.collection,
      filePath: it.filePath,
    })),
  ].reduce(
    (acc, it) => {
      const path = it.filePath!.replace('src/content/', '').split('.').slice(0, -1).join('.');
      acc[path] = {
        id: it.id,
        title: it.title || path.split('/').slice(-1)[-1],
        collection: it.collection,
      };
      return acc;
    },
    {} as Record<
      string,
      {
        id: string;
        title: string;
        collection: 'posts' | 'spec';
      }
    >
  );

  const postsRefData = posts.map(async (post) => {
    const { remarkPluginFrontmatter } = await render(post);
    const references: frontmatterRef[] = remarkPluginFrontmatter.references || [];
    return {
      title: post.data.title,
      colletion: 'posts',
      id: post.id,
      references,
    };
  });
  const specRefData = specs.map(async (spec) => {
    const { remarkPluginFrontmatter } = await render(spec);
    const references: frontmatterRef[] = remarkPluginFrontmatter.references || [];
    return {
      title: spec.data.title || spec.filePath?.split('/').slice(-1)[0],
      colletion: 'spec',
      id: spec.id,
      references,
    };
  });

  const getArticle = (refPath: string): Article | null => {
    let collection = refPath.split('/')[0];
    if (!['posts', 'drafts', 'spec'].includes(collection)) {
      collection = 'posts';
      refPath = `posts/${refPath}`;
    }
    const { id, title } = pathMap[refPath];
    if (id) {
      if (collection === 'spec') {
        const article = specs.find((it) => it.id === id);
        if (article) return { title, collection, id };
      } else {
        const article = posts.find((it) => it.id === id);
        if (article) return { title, collection: 'posts', id };
      }
    }
    return null;
  };

  const references: {
    refBy: Article;
    refTo: Article;
    /** 引用的上下文，即整个 xxxx[[ref|alias]]xxxx 的内容，截取前后 20 个字符 */
    context: string;
    /** 引用的偏移量，即 [[ref|alias]] 在上下文字符串中的起始和结束位置 */
    offset: [number, number];
    /** 引用应该被分配的 id，用于通过 #id 跳转 */
    id: string;
  }[] = [
    ...(await Promise.all(postsRefData)).flatMap((data) => {
      const article: Article = {
        title: data.title,
        collection: data.colletion as 'posts' | 'spec',
        id: data.id,
      };
      return data.references
        .map((ref) => {
          const { reference, context, offset, id } = ref;
          const refTo = getArticle(reference);
          if (refTo) return { refBy: article, refTo, context, offset, id };
          return null;
        })
        .filter((it) => it !== null);
    }),
    ...(await Promise.all(specRefData)).flatMap((data) => {
      const article: Article = {
        title: data.title || data.id,
        collection: data.colletion as 'posts' | 'spec',
        id: data.id,
      };
      return data.references
        .map((ref) => {
          const { reference, context, offset, id } = ref;
          const refTo = getArticle(reference);
          if (refTo) return { refBy: article, refTo, context, offset, id };
          return null;
        })
        .filter((it) => it !== null);
    }),
  ];
  return references;
}
