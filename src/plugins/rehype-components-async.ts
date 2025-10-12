import { isElement } from 'hast-util-is-element';
import type { Element, ElementContent, Parent, Properties, Root, RootContent } from 'hast';

interface ComponentContext {
  tree: Root;
  vfile: unknown;
  processor: unknown;
}

type ComponentResult =
  | ElementContent
  | ElementContent[]
  | null
  | undefined
  | void
  | Promise<ElementContent | ElementContent[] | null | undefined | void>;

type ComponentFn = (
  props: Properties,
  children: ElementContent[],
  context: ComponentContext
) => ComponentResult;

interface Options {
  components?: Record<string, ComponentFn>;
}

export function rehypeComponentsAsync(options: Options = {}) {
  const { components = {} } = options;

  return async function transformer(this: unknown, tree: Root, vfile: unknown) {
    const context: ComponentContext = {
      tree,
      vfile,
      processor: this,
    };

    await transformNode(tree, components, context);
  };
}

async function transformNode(
  node: Parent,
  components: Record<string, ComponentFn>,
  context: ComponentContext
): Promise<void> {
  if (!Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index++) {
  const child = node.children[index] as RootContent;
    if (!child) continue;

    if (isElement(child)) {
      const element = child as Element;
      const component = components[element.tagName];

      if (component) {
        const props = (element.properties ?? {}) as Properties;
        const originalChildren = (element.children ?? []) as ElementContent[];

        let returned = component(props, originalChildren, context);
        if (isPromiseLike(returned)) {
          returned = await returned;
        }

        const normalized = normalizeElementContent(returned);

        if (!normalized.every(isElementContentValue)) {
          throw new Error(
            `rehype-components: Component function is expected to return ElementContent or an array of ElementContent, but got ${JSON.stringify(normalized)}.`
          );
        }

        node.children.splice(index, 1, ...normalized);
        index += normalized.length - 1;
        continue;
      }
    }

    if (hasChildren(child)) {
      await transformNode(child, components, context);
    }
  }
}

function normalizeElementContent(
  value: ElementContent | ElementContent[] | null | undefined | void
): ElementContent[] {
  if (value == null) return [];

  return Array.isArray(value)
    ? value.filter((item): item is ElementContent => item != null)
    : [value];
}

function isPromiseLike<T>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as Promise<T>).then === 'function';
}

function hasChildren(value: RootContent): value is Parent & RootContent {
  if (typeof value !== 'object' || value == null) return false;
  return Array.isArray((value as Parent).children);
}

function isElementContentValue(value: unknown): value is ElementContent {
  if (isElement(value)) return true;

  if (typeof value === 'object' && value !== null && 'type' in value) {
    const type = (value as { type: string }).type;
    return type === 'text' || type === 'comment';
  }

  return false;
}
