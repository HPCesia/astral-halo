import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';

export const remarkImageProcess: RemarkPlugin = function () {
  return (tree) => {
    visit(tree, 'image', (node) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      // lazyload
      node.data.hProperties.loading = 'lazy';
      // async decode
      node.data.hProperties.decoding = 'async';
    });
  };
};
