import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to wrap tables with a div for overflow auto
 *
 * Rehype 插件，为表格包裹一个带有 overflow auto 样式的 div
 *
 * @returns {import('unified').Plugin}
 */
export function rehypeWrapTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['overflow-auto'] },
          children: [node],
        };
        parent.children[index] = wrapper;
      }
    });
  };
}
