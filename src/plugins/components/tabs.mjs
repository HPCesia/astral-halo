/// <reference types="mdast" />
import { h } from 'hastscript';

/**
 * Create a Tabs component.
 *
 * @param {Object} props - The properties of the component.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Tabs component.
 */
export function componentTabs(props, children) {
  if (!Array.isArray(children) || children.length === 0) {
    return h(
      'div',
      { class: 'hidden' },
      'Invalid directive. ("tabs" directive must container type and have at least one tab.)'
    );
  }
  if (children[0].tagName !== 'tab') {
    return h(
      'div',
      { class: 'hidden' },
      'Invalid directive. ("tabs" directive must container type with "tab" leaf directive as first child.)'
    );
  }

  const { result: tabs } = children.reduce(
    (acc, child, index) => {
      if (child.tagName === 'tab') {
        if (acc.temp.title !== '') {
          acc.result.push(acc.temp);
          acc.temp = { title: '', content: [] };
        }
        acc.temp.title =
          child.children.length > 0 ? child.children[0].value : `Tab ${acc.result.length + 1}`;
        if ('active' in child.properties) {
          acc.temp.active = true;
        }
        return acc;
      }
      acc.temp.content.push(child);
      if (index === children.length - 1) acc.result.push(acc.temp);

      return acc;
    },
    {
      temp: {
        title: '',
        active: false,
        content: [],
      },
      result: [],
    }
  );

  const tabsId = `tabs-${Math.random().toString(36).substring(2, 15)}`;
  const tabsContent = tabs.flatMap((tab) => {
    const tabTitle = h('input', {
      class: 'tab',
      type: 'radio',
      name: tabsId,
      'aria-label': tab.title,
      checked: tab.active ? 'checked' : undefined,
    });
    const tabContent = h('div', { class: 'tab-content p-4' }, ...tab.content);
    return [tabTitle, tabContent];
  });

  return h('div', { class: 'tabs tabs-box bg-base-200/15 my-4' }, tabsContent);
}
