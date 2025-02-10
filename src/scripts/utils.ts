import { navigate } from 'astro:transitions/client';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
      navigate(randomLink);
    }
  } catch (error) {
    console.error('Failed to get random post:', error);
  }
}

export function convertTimeToRelative(): void {
  // 获取页面语言
  const lang = document.documentElement.lang || 'en';
  // 设置 dayjs 语言
  const localeMap: { [key: string]: string } = {
    'zh-CN': 'zh-cn',
    'zh-TW': 'zh-tw',
    en: 'en',
  };
  dayjs.locale(localeMap[lang] || 'en');

  // 获取所有 time 标签
  const timeElements = document.getElementsByTagName('time');
  const now = dayjs();
  const sevenDaysAgo = now.subtract(7, 'day');

  Array.from(timeElements).forEach((timeElement) => {
    // 检查是否禁用相对时间转换
    if (timeElement.dataset.noRelative) return;

    const datetime = timeElement.getAttribute('datetime');
    if (!datetime) return;

    const date = dayjs(datetime);
    // 检查是否在7天内
    if (date.isAfter(sevenDaysAgo)) {
      // 转换为相对时间
      timeElement.textContent = date.fromNow();
    }
  });
}
