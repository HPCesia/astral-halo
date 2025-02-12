import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export const remarkReadingTime: RemarkPlugin = function () {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    // @ts-expect-error data.astro.frontmatter must be defined
    data.astro.frontmatter.minutes = Math.max(1, Math.round(readingTime.minutes));

    // @ts-expect-error data.astro.frontmatter must be defined
    data.astro.frontmatter.words = readingTime.words;
  };
};
