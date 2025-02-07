import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin to extract the first paragraph as excerpt
 *
 * 提取第一个段落作为摘要的 Remark 插件
 *
 * @returns {import('unified').Plugin}
 */
export function remarkExcerpt() {
  return (tree, { data }) => {
    let excerpt = '';
    for (let node of tree.children) {
      if (node.type !== 'paragraph') {
        continue;
      }
      excerpt = toString(node);
      break;
    }
    data.astro.frontmatter.excerpt = excerpt;
  };
}
