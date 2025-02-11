/// <reference types="mdast" />
import { h } from 'hastscript';

/**
 * Create a Tabs component.
 *
 * @param {Object} props - The properties of the component.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Tabs component.
 */
export function componentInline(props, children) {
  if (!Array.isArray(children)) {
    return h(
      'span',
      { class: 'hidden' },
      'Invalid directive. ("inline" directive must be a text directive with child.)'
    );
  }
  if (children.length !== 1) {
    return h(
      'span',
      { class: 'hidden' },
      'Invalid directive. ("inline" directive must be a text directive with child.)'
    );
  }
  const child = children[0];

  if (child.tagName === 'img') {
    delete child.properties['data-zoom'];
  }

  const classes = [
    ...new Set([
      ...('class' in child.properties ? child.properties.class : '').split(' '),
      'inline',
    ]),
  ].join(' ');
  child.properties.class = classes;

  return h(child.tagName, child.properties, child.children);
}
