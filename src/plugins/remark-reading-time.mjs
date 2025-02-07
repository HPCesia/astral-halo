import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

/**
 * Remark plugin to calculate reading time and word count
 *
 * Remark 插件，用于计算阅读时间和字数
 *
 * @returns {import('unified').Plugin}
 */
export function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutes = Math.max(1, Math.round(readingTime.minutes));
    data.astro.frontmatter.words = readingTime.words;
  };
}
