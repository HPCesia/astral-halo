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

export async function getRandomPost() {
  // Use rss.xml to get random post
  // 使用 rss.xml 获取随机文章
  const site = import.meta.env.SITE;
  try {
    const response = await fetch('/rss.xml');
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item link');
    const links = Array.from(items).map((item) => item.textContent || '');

    if (links.length > 0) {
      const randomLink = links[Math.floor(Math.random() * links.length)].replace(site, '/');
      window.location.href = randomLink;
    }
  } catch (error) {
    console.error('Failed to get random post:', error);
  }
}
