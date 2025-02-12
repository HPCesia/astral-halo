import { wrapperTagName } from './shiki-transformers';
import type { RehypePlugin } from '@astrojs/markdown-remark';
import type { ElementContent } from 'hast';
import { visit } from 'unist-util-visit';

export const rehypePrettierCodes: RehypePlugin = function () {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== wrapperTagName) return;
      node.tagName = 'div';
      const originalClass = (node.properties?.class as string) || '';
      const additionalClass = ['group'];
      const newClass = originalClass.split(' ').concat(additionalClass).join(' ');
      node.properties = { ...node.properties, class: newClass };

      const language = node.properties?.dataLanguage as string;
      const languageTag: ElementContent = {
        type: 'element',
        tagName: 'span',
        properties: {
          class:
            'badge badge-outline absolute top-2 right-2 group-hover:opacity-0 duration-200',
        },
        children: [
          {
            type: 'text',
            value: language,
          },
        ],
      };

      const copyIcon: ElementContent = {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'icon-[material-symbols--file-copy-rounded]',
        },
        children: [],
      };
      const copyBtn: ElementContent = {
        type: 'element',
        tagName: 'button',
        properties: {
          class:
            'badge badge-outline tooltip tooltip-left absolute top-2 right-3 group-hover:opacity-100 duration-200 opacity-0',
          onclick: `navigator.clipboard.writeText(this.parentElement.children[0].textContent);
          this.dataset.tip = 'Copied!'; setTimeout(() => this.dataset.tip = 'Copy', 1000);`,
          'data-tip': 'Copy',
        },
        children: [copyIcon],
      };

      node.children.push(languageTag, copyBtn);
    });
  };
};
