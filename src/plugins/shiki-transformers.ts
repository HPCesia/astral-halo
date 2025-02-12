import { h } from 'hastscript';
import type { ShikiTransformer } from 'shiki';

export const wrapperTagName = 'code-block';

export const wrapCode = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-wrap-code',
    pre(node) {
      const container = h('pre', node.children);
      node.children = [container];
      node.tagName = wrapperTagName;
    },
  };
};
