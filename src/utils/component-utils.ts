import type { AstroGlobal } from 'astro';

const renderedInstance = new Set<string>();

export function isFirstInstance(id: string, url: AstroGlobal['url']): boolean {
  const key = `${id}-${url.pathname}`;
  if (renderedInstance.has(key)) {
    return false;
  }
  renderedInstance.add(key);
  return true;
}
