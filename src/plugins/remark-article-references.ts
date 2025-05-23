import type { RemarkPlugin } from '@astrojs/markdown-remark';
import crypto from 'crypto';
import { visit } from 'unist-util-visit';

export const remarkArticleReferences: RemarkPlugin = function () {
  return (tree, { data }) => {
    visit(tree, 'text', (node) => {
      const references: {
        reference: string;
        context: string;
        offset: [number, number];
        id: string;
      }[] = [];
      // \[\[ - 匹配开始的 [[
      // ((?:\\.|[^\|\]])*？) - 第一个捕获组($1)，匹配:
      //   \\. - 任何转义字符(包括\|)
      //   或 [^|\]] - 任何不是|和]的字符
      // (?:\|(.*?))? - 非捕获组，可选的，匹配:
      //   \| - 分隔符|
      //   (.*?) - 第二个捕获组($2)，非贪婪匹配任意字符
      // \]\] - 匹配结束的 ]]
      const linkPattern = /\[\[((?:\\.|[^|\]])*?)(?:\|(.*?))?\]\]/g;
      node.value = node.value.replaceAll(
        linkPattern,
        (match, reference: string, alias: string | undefined, offset) => {
          const startOffset = Math.max(0, offset - 40);
          const endOffset = Math.min(node.value.length, offset + match.length + 40);
          const matchOffsetStart = offset - startOffset + 3;
          const matchOffsetEnd = match.length + matchOffsetStart;
          const context = `...${node.value
            .replaceAll(
              linkPattern,
              (_, ref: string, alias) =>
                alias || ref.split('/').at(-1)?.split('.').slice(0, -1).join('') || ref
            )
            .substring(startOffset, endOffset)
            .trim()}...`;
          references.push({
            reference,
            context,
            offset: [matchOffsetStart, matchOffsetEnd],
            id: crypto.randomUUID(),
          });
          if (alias) return `%%%%${reference}%%${alias}%%%%`;
          return `%%%%${reference}%%%%`;
        }
      );
      if (references.length) data.astro!.frontmatter!.references = references;
    });
  };
};
