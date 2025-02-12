import type { RehypePlugin } from '@astrojs/markdown-remark';
import type { ElementContent } from 'hast';
import { visit } from 'unist-util-visit';

export const rehypeWrapTables: RehypePlugin = function () {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: { class: 'overflow-auto' },
          children: [node],
        };
        parent.children[index] = wrapper as ElementContent;
      }
    });
  };
};
