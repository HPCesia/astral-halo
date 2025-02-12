import type { RemarkPlugin } from '@astrojs/markdown-remark';
import type { BlockContent, Data, DefinitionContent } from 'mdast';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

type TextFilter = string | RegExp | ((title: string) => string);
type ClassNames = string | string[];
type ClassNameMap = ClassNames | ((title: string) => ClassNames);

export interface Config {
  titleFilter: TextFilter[];
  titleTextMap: (title: string) => {
    displayTitle: (string | Node)[];
    checkedTitle: string;
  };
  dataMaps: {
    title: (data: Data) => Data;
    block: (data: Data) => Data;
  };
  classNameMaps: {
    title: ClassNameMap;
    block: ClassNameMap;
  };
}

const defaultConfig: Config = {
  titleFilter: [
    /\[!NOTE(:.*?)?\]/,
    /\[!TIP(:.*?)?\]/,
    /\[!IMPORTANT(:.*?)?\]/,
    /\[!CAUTION(:.*?)?\]/,
    /\[!WARNING(:.*?)?\]/,
  ],
  titleTextMap: (title) => {
    const [type, text] = title.substring(2, title.length - 1).split(':');
    let icon: string;
    switch (type) {
      case 'NOTE':
        icon = 'material-symbols--info-outline-rounded';
        break;
      case 'TIP':
        icon = 'ic--outline-tips-and-updates';
        break;
      case 'IMPORTANT':
        icon = 'material-symbols--chat-info-outline-rounded';
        break;
      case 'CAUTION':
        icon = 'mdi--alert-octagon-outline';
        break;
      case 'WARNING':
        icon = 'material-symbols--warning-rounded';
        break;
      default:
        icon = 'material-symbols--info-outline-rounded';
        break;
    }
    return {
      displayTitle: [
        {
          type: 'element',
          data: { hName: 'span', hProperties: { className: `icon-[${icon}]` } },
        } as Node,
        text || type,
      ],
      checkedTitle: type,
    };
  },
  dataMaps: {
    title: (data) => data,
    block: (data) => data,
  },
  classNameMaps: {
    title: 'admonition-title',
    block: (title) => `admonition admonition-${title.toLowerCase()}`,
  },
};

function nameFilter(fliters: TextFilter[]): (title: string) => boolean {
  return (title) => {
    for (const filter of fliters) {
      if (typeof filter == 'string') {
        if (title.startsWith(filter)) return true;
      } else if (filter instanceof RegExp) {
        if (filter.test(title)) return true;
      } else if (typeof filter == 'function') {
        if (filter(title)) return true;
      }
    }
    return false;
  };
}

function classNameMap(gen: ClassNameMap): (title: string) => string {
  return (title) => {
    const classNames = typeof gen == 'function' ? gen(title) : gen;
    return typeof classNames == 'object' ? classNames.join(' ') : classNames;
  };
}

export const remarkGithubBlockquote: RemarkPlugin<Partial<Config>[]> = function (...params) {
  const providedConfig = params.reduce((a, b) => ({ ...a, ...b }), {});
  const config = { ...defaultConfig, ...providedConfig };
  return (tree) => {
    visit(tree, (node) => {
      if (node.type != 'blockquote') return;
      const blockquote = node;
      if (blockquote.children[0]?.type != 'paragraph') return;
      const paragraph = blockquote.children[0];
      if (paragraph.children[0]?.type != 'text') return;
      const text = paragraph.children[0];
      let title;
      const titleEnd = text.value.indexOf('\n');
      if (titleEnd < 0) {
        if (paragraph.children.length > 1) {
          if (paragraph.children.at(1)?.type == 'break') {
            paragraph.children.splice(1, 1);
          } else {
            return;
          }
        }
        title = text.value;
        if (!nameFilter(config.titleFilter)(title)) return;
        paragraph.children.shift();
      } else {
        const textBody = text.value.substring(titleEnd + 1);
        title = text.value.substring(0, titleEnd);
        const m = /[ \t\v\f\r]+$/.exec(title);
        if (m) {
          title = title.substring(0, title.length - m[0].length);
        }
        if (!nameFilter(config.titleFilter)(title)) return;
        text.value = textBody;
      }
      const { displayTitle, checkedTitle } = config.titleTextMap(title);
      const paragraphTitleTexts = displayTitle.map((text) =>
        typeof text == 'string' ? { type: 'text', value: text } : text
      );
      const paragraphTitle = {
        type: 'paragraph',
        children: [...paragraphTitleTexts],
        data: config.dataMaps.title({
          hProperties: { className: classNameMap(config.classNameMaps.title)(checkedTitle) },
        }),
      } as BlockContent | DefinitionContent;
      blockquote.children.unshift(paragraphTitle);
      blockquote.data = config.dataMaps.block({
        ...blockquote.data,
        hProperties: { className: classNameMap(config.classNameMaps.block)(checkedTitle) },
        hName: 'div',
      });
    });
  };
};
