import { visit } from 'unist-util-visit';

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
