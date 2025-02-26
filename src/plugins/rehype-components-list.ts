/**
 * All components in this file should sync with the components in `src/components/user`
 */
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
  const contentClassName = 'collapse-content';

  const inputNode = h('input', {
    type: 'checkbox',
    ...(open && { checked: true }),
  });
  const titleNode = h('div', { class: titleClassName }, title);
  const contentNode = h('div', { class: contentClassName }, children);
  return h('div', { class: wrapperClassName }, [inputNode, titleNode, contentNode]);
};

export const rehypeComponentsList = { collapse: Collapse };
