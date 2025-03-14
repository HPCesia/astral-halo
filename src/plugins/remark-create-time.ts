import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { statSync } from 'fs';

export const remarkCreateTime: RemarkPlugin = function () {
  return function (_, file) {
    const filepath = file.history[0];
    const result = statSync(filepath);
    file.data!.astro!.frontmatter!.createAt = result.birthtime.toISOString();
    file.data!.astro!.frontmatter!.modifiedAt = result.mtime.toISOString();
  };
};
