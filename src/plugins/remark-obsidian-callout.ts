import type { RemarkPlugin } from '@astrojs/markdown-remark';
import type { IconifyJSON } from '@iconify/types';
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils';
import type { BlockContent, DefinitionContent } from 'mdast';
import { visit } from 'unist-util-visit';

const calloutRegex = /^\[!(\w+)\]([+-]?)/;

const callouts: Record<string, string> = {
  note: 'mingcute:pencil-line',
  abstract: 'mdi:clipboard-list-outline',
  summary: 'mdi:clipboard-list-outline',
  tldr: 'mdi:clipboard-list-outline',
  info: 'material-symbols:info-outline-rounded',
  todo: 'material-symbols:check-circle-outline-rounded',
  tip: 'mdi:flame',
  hint: 'mdi:flame',
  important: 'mdi:flame',
  success: 'material-symbols:check-rounded',
  check: 'material-symbols:check-rounded',
  done: 'material-symbols:check-rounded',
  question: 'material-symbols:help-outline-rounded',
  help: 'material-symbols:help-outline-rounded',
  faq: 'material-symbols:help-outline-rounded',
  warning: 'mingcute:alert-fill',
  attention: 'mingcute:alert-fill',
  caution: 'mingcute:alert-fill',
  failure: 'mingcute:close-fill',
  missing: 'mingcute:close-fill',
  fail: 'mingcute:close-fill',
  danger: 'mdi:lightning-bolt-outline',
  error: 'mdi:lightning-bolt-outline',
  bug: 'mingcute:bug-line',
  example: 'mingcute:list-check-line',
  quote: 'mdi:format-quote-close-outline',
  cite: 'mdi:format-quote-close-outline',
};

const iconNameRegex = /([\w-]+):([\w-]+)/;

const iconSets = await (async () => {
  const sets: Record<string, IconifyJSON> = {};
  await Promise.all(
    Object.values(callouts).map(async (name) => {
      const matched = name.match(iconNameRegex);
      if (!matched) throw new Error(`Invalid icon name: "${name}"`);
      const [, set] = matched;
      if (set in sets) return;
      const { icons } = (await import(/* @vite-ignore */ `@iconify-json/${set}`)) as {
        icons: IconifyJSON;
      };
      sets[set] = icons;
    })
  );
  return sets;
})();

const iconCache = new Map<string, string | null>(
  Object.keys(callouts).map((key) => [key, null])
);

function getIconSvg(name: string) {
  const matched = name.match(iconNameRegex);
  if (!matched) return `<div class="hidden">Invalid Icon: ${name}</div>`;
  const [, iconSetName, iconName] = matched;
  try {
    const data = getIconData(iconSets[iconSetName], iconName);
    if (!data)
      return `<div class="hidden">Import Icon: ${name} failed: Icon not found in set ${iconSetName}</div>`;
    const { attributes, body } = iconToSVG(data);
    const svgHtml = iconToHTML(body, attributes);
    return svgHtml;
  } catch (err) {
    return `<div class="hidden">Import Icon: ${name} failed: ${err}</div>`;
  }
}

export const remarkObsidianCallout: RemarkPlugin = function () {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type != 'blockquote') return;

      const blockquote = node;
      if (blockquote.children[0]?.type != 'paragraph') return;

      const paragraph = blockquote.children[0];
      if (paragraph.children[0]?.type != 'text') return;

      const [firstLine, ...remainLines] = paragraph.children[0].value.split('\n');
      const remainContents = remainLines.join('\n');
      const matched = firstLine.match(calloutRegex);
      if (!matched) return;

      const [, calloutType, expandCollapseSign] = matched;
      if (!calloutType) return;
      const validCalloutType = calloutType.toLowerCase();
      const expandable = Boolean(expandCollapseSign);
      const expanded = expandCollapseSign === '+';

      let svg: string | null = null;
      const calloutKey = validCalloutType in callouts ? validCalloutType : 'note';
      svg = iconCache.get(calloutKey)!;
      if (svg === null) {
        const iconName = callouts[calloutKey];
        svg = getIconSvg(iconName);
        iconCache.set(calloutKey, svg);
      }
      let titleText = firstLine.slice(matched[0].length).trim();
      if (titleText.length === 0) titleText = validCalloutType;

      const titleNode: BlockContent | DefinitionContent = {
        type: 'paragraph',
        children: [
          {
            type: 'html',
            value: svg,
          },
          {
            type: 'text',
            value: titleText,
            data: {
              hName: 'span',
            },
          },
        ],
        data: {
          hProperties: { className: `callout-title${expandable ? ' collapse-title' : ''}` },
          hName: 'div',
        },
      };

      blockquote.children = [
        {
          type: 'html',
          value: expandable
            ? `<input type="checkbox" ${expanded ? 'checked="true"' : ''}>`
            : '',
        },
        titleNode,
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: remainContents,
                },
              ],
            },
          ],
          data: {
            hName: 'div',
            hProperties: {
              ...(expandable ? { class: 'collapse-content' } : {}),
            },
          },
        },
      ];

      blockquote.data = {
        ...blockquote.data,
        hProperties: {
          'data-callout': validCalloutType,
          ...(expandable ? { class: 'collapse-arrow collapse' } : {}),
        },
      };
    });
  };
};
