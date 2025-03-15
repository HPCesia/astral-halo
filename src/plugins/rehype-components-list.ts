/**
 * All components in this file should sync with the components in `src/components/user`
 */
import { icons as MaterialSymbols } from '@iconify-json/material-symbols';
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils';
import { h } from 'hastscript';
import type { Child } from 'hastscript';

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

const LinkCard = function (props: { title: string; description: string; url: string }) {
  const { title, description, url } = props;
  const wrapperClassName = 'card border-base-content/25 my-4 overflow-hidden border';
  const bodyClassName = 'card-body flex flex-row items-center justify-between p-4';
  const titleClassName = 'card-title';
  const descClassName = 'card-desc text-base-content/50';

  const titleNode = h('div', { class: titleClassName }, title);
  const descNode = h('div', { class: descClassName }, description);
  const contentNode = h('div', null, [titleNode, descNode]);

  const iconData = getIconData(MaterialSymbols, 'arrow-right-alt-rounded');
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
  linkcard: LinkCard,
  tooltip: Tooltip,
};
