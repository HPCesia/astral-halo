import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';

export const remarkHeadingShift: RemarkPlugin = function () {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      // 将所有标题层级加1（最大到6）
      node.depth = Math.min(node.depth + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6;
    });
  };
};
