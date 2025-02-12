import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';

export const remarkImageProcess: RemarkPlugin = function () {
  return (tree) => {
    visit(tree, 'image', (node) => {
      // 添加 data-zoom 属性到图片节点
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties['data-zoom'] = '';
      // lazyload
      node.data.hProperties.loading = 'lazy';
      // async decode
      node.data.hProperties.decoding = 'async';
    });
  };
};
