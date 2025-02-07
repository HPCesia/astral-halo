import { visit } from 'unist-util-visit';

/**
 * Remark plugin to shift all heading levels down by one (starting from h2)
 *
 * Remark 插件，将所有标题层级下移一级（从 h2 开始）
 *
 * @type {import('unified').Plugin}
 */
export default function remarkHeadingShift() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      // 将所有标题层级加1（最大到6）
      node.depth = Math.min(node.depth + 1, 6);
    });
  };
}
