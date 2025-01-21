export function getReadingProgress(): number {
  const docEl = document.documentElement;
  const bodyEl = document.body;
  const totalHeight =
    Math.max(
      bodyEl.clientHeight,
      bodyEl.scrollHeight,
      bodyEl.offsetHeight,
      docEl.clientHeight,
      docEl.scrollHeight,
      docEl.offsetHeight
    ) - docEl.clientHeight;
  const scrollY = window.scrollY;
  return Math.round((scrollY / totalHeight) * 100);
}
