import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { toString } from 'mdast-util-to-string';

export const remarkExcerpt: RemarkPlugin = function () {
  return (tree, { data }) => {
    let excerpt = '';
    for (const node of tree.children) {
      if (node.type !== 'paragraph') {
        continue;
      }
      excerpt = toString(node);
      break;
    }
    // @ts-expect-error data.astro.frontmatter must be defined
    data.astro.frontmatter.excerpt = excerpt;
  };
};
