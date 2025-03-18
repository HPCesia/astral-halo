export function joinUrl(...parts: string[]): string {
  const joined = parts.join('/');
  return joined.replace(/\/+/g, '/');
}

export function pathsEqual(path1: string, path2: string) {
  const normalizedPath1 = path1.replace(/^\/|\/$/g, '').toLowerCase();
  const normalizedPath2 = path2.replace(/^\/|\/$/g, '').toLowerCase();
  return normalizedPath1 === normalizedPath2;
}

export function pathMatch(regex: RegExp, path: string) {
  return regex.test(path) || regex.test(getRelativeUrl(path));
}

export function getRelativeUrl(path: string) {
  return joinUrl('/', path.replace(import.meta.env.BASE_URL, ''));
}

export function url(path: string) {
  return joinUrl('', import.meta.env.BASE_URL, path);
}
