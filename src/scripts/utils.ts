export function scrollToTop(duration: number = 500): void {
  const start = window.scrollY;
  const startTime = performance.now();
  function scrollStep(timestamp: number) {
    const currentTime = timestamp - startTime;
    const progress = Math.min(currentTime / duration, 1);
    window.scrollTo(0, start * (1 - progress));
    if (currentTime < duration) {
      window.requestAnimationFrame(scrollStep);
    }
  }
  window.requestAnimationFrame(scrollStep);
}

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
