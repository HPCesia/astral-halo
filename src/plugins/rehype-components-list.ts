/**
 * All components in this file should sync with the components in `src/components/user`
 */
import { fileIcon } from '../utils/file-icon.ts';
import { getLinkPreview } from '../utils/link-preview.ts';
import type { IconifyJSON } from '@iconify/types';
import { getIconData, iconToHTML, iconToSVG, stringToIcon } from '@iconify/utils';
import type { Element, ElementContent, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { h } from 'hastscript';
import type { Child } from 'hastscript';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

async function detectInstalledCollections(root: string) {
  try {
    const packages = [];
    const text = await readFile(path.resolve(root, './package.json'), {
      encoding: 'utf8',
    });
    const { dependencies = {}, devDependencies = {} } = JSON.parse(text);
    packages.push(...Object.keys(dependencies));
    packages.push(...Object.keys(devDependencies));
    const collections = packages
      .filter((name) => name.startsWith('@iconify-json/'))
      .map((name) => name.replace('@iconify-json/', ''));
    return collections;
  } catch (err) {
    console.error(err);
  }
  return [];
}

const iconSets = await detectInstalledCollections(process.cwd());

async function loadCollection(name: string) {
  if (!iconSets.find((it) => it === name)) return;
  const icons: IconifyJSON = JSON.parse(
    await readFile(
      path.resolve(process.cwd(), `./node_modules/@iconify-json/${name}/icons.json`),
      {
        encoding: 'utf8',
      }
    )
  );
  return icons;
}

const collections: Record<string, IconifyJSON> = {};
for (const set of iconSets) {
  const icons = await loadCollection(set);
  if (icons) collections[set] = icons;
}

const Collapse = function (
  props: {
    title: string;
    open?: true;
  },
  children: Child
) {
  const { title, open } = props;
  const wrapperClassName =
    'bg-base-100 border-base-content/25 collapse-arrow collapse my-4 border';
  const titleClassName = 'collapse-title font-semibold';
  const contentClassName = 'collapse-content min-w-0';

  const inputNode = h('input', {
    type: 'checkbox',
    ...(open && { checked: true }),
  });
  const titleNode = h('div', { class: titleClassName }, title);
  const contentNode = h('div', { class: contentClassName }, children);
  return h('div', { class: wrapperClassName }, [inputNode, titleNode, contentNode]);
};

type ParsedFileNode =
  | string
  | {
      name: string;
      children: ParsedFileNode[];
    };

function isElementNode(value: ElementContent): value is Element {
  return value.type === 'element';
}

function isTextNode(value: ElementContent): value is Text {
  return value.type === 'text';
}

function extractText(value: ElementContent): string {
  if (isTextNode(value)) {
    return value.value;
  }

  if (isElementNode(value)) {
    if (value.tagName === 'ul') return '';
    return (value.children ?? []).map(extractText).join('');
  }

  return '';
}

function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

function parseListElement(list: Element): ParsedFileNode[] {
  const items: ParsedFileNode[] = [];

  for (const child of list.children ?? []) {
    if (!isElementNode(child) || child.tagName !== 'li') continue;

    let nested: ParsedFileNode[] = [];
    const nameParts: string[] = [];

    for (const itemChild of child.children ?? []) {
      if (isElementNode(itemChild) && itemChild.tagName === 'ul') {
        nested = parseListElement(itemChild);
        continue;
      }

      const piece = extractText(itemChild);
      if (piece.trim().length > 0) {
        nameParts.push(piece);
      }
    }

    const name = normalizeName(nameParts.join(' '));
    if (!name) continue;

    if (nested.length > 0) {
      items.push({ name, children: nested });
    } else {
      items.push(name);
    }
  }

  return items;
}

function renderFileNode(node: ParsedFileNode, open: boolean): Child {
  if (typeof node === 'string') {
    return h(
      'li',
      h('span', { class: 'cursor-auto' }, Icon({ name: fileIcon(node) }), ' ', node)
    );
  }

  const nestedChildren =
    node.children.length > 0
      ? [h('ul', ...node.children.map((child) => renderFileNode(child, open)))]
      : [];

  return h(
    'li',
    h(
      'details',
      { ...(open ? { open: '' } : {}) },
      h('summary', Icon({ name: 'mdi:folder' }), ' ', node.name),
      ...nestedChildren
    )
  );
}

const FileTree = function (props: { open?: boolean }, children: ElementContent[]) {
  const listElement = children.find(
    (child): child is Element => isElementNode(child) && child.tagName === 'ul'
  );

  if (!listElement) {
    console.warn('[WARN] FileTree directive expects a nested list as its content.');
    return children;
  }

  const parsed = parseListElement(listElement);

  if (parsed.length === 0) {
    console.warn('[WARN] FileTree directive content is empty.');
    return children;
  }

  return h(
    'ul',
    { class: 'menu menu-sm rounded-box border-base-content/25 w-full border' },
    ...parsed.map((node) => renderFileNode(node, props.open ?? false))
  );
};

const Icon = function (props: {
  name: string;
  size?:
    | string
    | {
        width: string;
        height: string;
      };
}) {
  const { name, size } = props;
  let width = '1.25em';
  let height = '1.25em';
  if (size) {
    if (typeof size === 'string') {
      width = size;
      height = size;
    } else {
      width = size.width;
      height = size.height;
    }
  }
  const className = 'inline align-text-bottom';

  const { prefix, name: iconName } = stringToIcon(name, true)!;
  const collection = collections[prefix];
  if (!collection) {
    console.error(`'Icon set not found: '${prefix}'`);
    return h('span', `'Icon set not found: '${prefix}'`);
  }
  const iconData = getIconData(collection, iconName);
  if (!iconData) {
    console.error(`Icon "${iconName}" not found in icon set '${prefix}'`);
    return h('span', `Icon "${iconName}" not found in icon set '${prefix}'`);
  }
  const { attributes, body } = iconToSVG(iconData);
  attributes.width = width;
  attributes.height = height;
  const iconHtml = iconToHTML(body, { class: className, ...attributes });
  return h(
    'span',
    {},
    {
      type: 'raw',
      value: iconHtml,
    }
  );
};

const LinkCard = async function (props: {
  url: string;
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
  favicon?: string;
}) {
  if (!props.url) {
    console.error('LinkCard requires a "url" property.');
    return h(
      'a',
      { class: 'card border-base-content/25 my-4 overflow-hidden border' },
      'Link card error'
    );
  }

  const preview = await getLinkPreview(props.url, {
    title: props.title,
    description: props.description,
    siteName: props.siteName,
    image: props.image,
    favicon: props.favicon,
  });

  const contentNodes: Child[] = [];

  if (preview.image) {
    contentNodes.push(
      h('figure', { class: 'flex-shrink-0' }, [
        h('img', {
          src: preview.image,
          alt: preview.title || 'Link preview image',
          class: 'h-24 w-32 object-cover',
          loading: 'lazy',
        }),
      ])
    );
  }

  const metaRowChildren: Child[] = [];
  if (preview.favicon) {
    metaRowChildren.push(
      h('img', {
        src: preview.favicon,
        alt: preview.siteName || preview.title,
        class: 'h-6 w-6 rounded object-cover',
        loading: 'lazy',
      })
    );
  }

  metaRowChildren.push(
    h('span', { class: 'card-title truncate' }, preview.title || preview.url)
  );
  metaRowChildren.push(
    h(
      'span',
      { class: 'text-base-content/60 text-sm' },
      preview.siteName || new URL(preview.url).hostname
    )
  );

  const infoColumn = h(
    'div',
    { class: 'grid grid-rows-2 gap-2' },
    h('div', { class: 'flex items-center gap-2' }, ...metaRowChildren),
    h('p', { class: 'text-base-content/50 truncate' }, preview.description || '')
  );

  const collection = collections['material-symbols'];
  if (!collection) {
    console.error('LinkCard icon set not found: material-symbols');
    const bodyNode = h('div', { class: 'card-body p-4' }, infoColumn);
    contentNodes.push(bodyNode);
    return h(
      'a',
      {
        class: 'card card-side border-base-content/25 my-4 overflow-hidden border',
        href: preview.url,
        title: preview.title,
        'data-link-card': '',
        'data-url': preview.url,
        'data-fetched-at': preview.fetchedAt,
        rel: 'noopener noreferrer',
      },
      ...contentNodes
    );
  }

  const iconData = getIconData(collection, 'arrow-right-alt-rounded');
  if (!iconData) {
    console.error('LinkCard icon not found: material-symbols:arrow-right-alt-rounded');
    const bodyNode = h('div', { class: 'card-body p-4' }, infoColumn);
    contentNodes.push(bodyNode);
    return h(
      'a',
      {
        class: 'card card-side border-base-content/25 my-4 overflow-hidden border',
        href: preview.url,
        title: preview.title,
        'data-link-card': '',
        'data-url': preview.url,
        'data-fetched-at': preview.fetchedAt,
        rel: 'noopener noreferrer',
      },
      ...contentNodes
    );
  }

  const { attributes, body } = iconToSVG(iconData);
  const svgAttributes: Record<string, string> = {
    ...attributes,
    width: '1.875rem',
    height: '1.875rem',
    'aria-hidden': 'true',
    focusable: 'false',
  };

  const parsed = fromHtml(body, { fragment: true });
  const svgNode = h('svg', svgAttributes, ...(parsed.children as Child[]));

  const iconNode = h(
    'div',
    { class: 'flex items-center justify-center text-base-content/60' },
    svgNode
  );

  const bodyNode = h(
    'div',
    { class: 'card-body grid grid-cols-[minmax(0,1fr)_auto] items-center p-4' },
    [infoColumn, iconNode]
  );

  contentNodes.push(bodyNode);

  return h(
    'a',
    {
      class: 'card card-side border-base-content/25 my-4 overflow-hidden border',
      href: preview.url,
      title: preview.title,
      'data-link-card': '',
      'data-url': preview.url,
      'data-fetched-at': preview.fetchedAt,
      rel: 'noopener noreferrer',
    },
    ...contentNodes
  );
};

const Ruby = function (props: { base: string; text: string }) {
  const pairs = (() => {
    const { base, text } = props;
    const pattern = /(?<!\\)\|/g;
    const baseGroups = base.split(pattern);
    let textGroups = text.split(pattern);
    if (baseGroups.length > textGroups.length) {
      console.warn('[WARN] Invalid ruby, base splitter number should lesser than text.');
      console.warn(`         base: "${base}"`);
      console.warn(`         text: "${text}"`);
      return [{ base, text }];
    }
    textGroups[baseGroups.length - 1] = textGroups.slice(baseGroups.length - 1).join(' ');
    textGroups = textGroups.slice(0, baseGroups.length);
    return baseGroups.map((b, i) => ({ base: b, text: textGroups[i] }));
  })();
  return h(
    'ruby',
    {},
    pairs.flatMap(
      ({ base, text }) =>
        [
          { type: 'text', value: base },
          h('rp', {}, '('),
          h('rt', {}, text),
          h('rp', {}, ')'),
        ] as Child
    )
  );
};

const Tooltip = function (
  props: {
    tip: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  },
  children: Child
) {
  const { tip, position } = props;
  const wrapperClassName = 'tooltip tooltip-' + (position || 'top');
  return h('div', { class: wrapperClassName, 'data-tip': tip }, children);
};

export const rehypeComponentsList = {
  collapse: Collapse,
  filetree: FileTree,
  icon: Icon,
  linkcard: LinkCard,
  rubyc: Ruby,
  tooltip: Tooltip,
};
