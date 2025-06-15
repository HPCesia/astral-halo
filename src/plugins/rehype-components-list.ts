/**
 * All components in this file should sync with the components in `src/components/user`
 */
import type { IconifyJSON } from '@iconify/types';
import { getIconData, iconToHTML, iconToSVG, stringToIcon } from '@iconify/utils';
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
iconSets.forEach(async (set) => {
  const icons = await loadCollection(set);
  if (icons) collections[set] = icons;
});

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

const LinkCard = function (props: { title: string; description: string; url: string }) {
  const { title, description, url } = props;
  const wrapperClassName = 'card border-base-content/25 my-4 overflow-hidden border';
  const bodyClassName = 'card-body flex flex-row items-center justify-between p-4';
  const titleClassName = 'card-title';
  const descClassName = 'card-desc text-base-content/50';

  const titleNode = h('div', { class: titleClassName }, title);
  const descNode = h('div', { class: descClassName }, description);
  const contentNode = h('div', null, [titleNode, descNode]);

  const collection = collections['material-symbols'];
  if (!collection) {
    console.error('LinkCard icon set found: material-symbols');
    return h('a', { class: wrapperClassName, href: url, title }, 'Link card error');
  }
  const iconData = getIconData(collection, 'arrow-right-alt-rounded');
  if (!iconData) {
    console.error('LinkCard icon not found: material-symbols:arrow-right-alt-rounded');
    return h('a', { class: wrapperClassName, href: url, title }, 'Link card error');
  }
  const { attributes, body } = iconToSVG(iconData);
  const iconHtml = iconToHTML(body, attributes);
  const iconNode = h(
    'span',
    {
      class: 'text-3xl',
    },
    {
      type: 'raw',
      value: iconHtml,
    }
  );
  const bodyNode = h('div', { class: bodyClassName }, [contentNode, iconNode]);

  return h('a', { class: wrapperClassName, href: url, title }, bodyNode);
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
  icon: Icon,
  linkcard: LinkCard,
  rubyc: Ruby,
  tooltip: Tooltip,
};
