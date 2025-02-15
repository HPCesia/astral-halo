import { t } from './locale/index.js';
import { checkFileExists, getFilePath } from './utils.mjs';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import { createInterface } from 'readline/promises';

const program = new Command();
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const DRAFTS_DIR = 'src/content/drafts';
const POSTS_DIR = 'src/content/posts';

// 列出文件并分页显示
async function listDraftsWithPagination(drafts, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const totalPages = Math.ceil(drafts.length / pageSize);

  console.log(t('draftsTitle', { current: page, total: totalPages }));
  drafts.slice(start, end).forEach((draft, index) => {
    console.log(`${start + index + 1}. ${draft}`);
  });

  if (totalPages > 1) {
    console.log(t('paginationTip'));
  }

  return totalPages;
}

// 处理文件冲突
async function handleFileConflict(title, isDir) {
  console.log(t('fileExist', { path: title }));
  console.log(t('chooseAction'));
  console.log('1. ', t('actions.useNewName'));
  console.log('2. ', t('actions.overwrite'));
  console.log('3. ', t('actions.exit'));

  const answer = await rl.question(t('inputOption', { countStart: 1, countEnd: 3 }));

  switch (answer.trim()) {
    case '1': {
      let counter = 1;
      while ((await checkFileExists(POSTS_DIR, title, counter)).exists) {
        counter++;
      }
      return getFilePath(POSTS_DIR, `${title}-${counter}`, isDir);
    }
    case '2':
      return getFilePath(POSTS_DIR, title, isDir);
    case '3':
      rl.close();
      process.exit(0);
      break;
    default:
      console.log(t('invalidOption'));
      rl.close();
      process.exit(1);
  }
}

// 获取所有草稿文件
async function getAllDrafts() {
  const drafts = [];

  try {
    const files = await fs.readdir(DRAFTS_DIR, { withFileTypes: true });

    for (const file of files) {
      const title = file.name.endsWith('.md') ? file.name.slice(0, -3) : file.name;
      // 使用 checkFileExists 检查文件
      const { exists, filePath } = await checkFileExists(DRAFTS_DIR, title);
      if (exists && filePath) {
        drafts.push(path.relative(DRAFTS_DIR, filePath));
      }
    }

    return drafts;
  } catch (error) {
    console.error(t('readDraftsError'), error);
    process.exit(1);
  }
}

// 发布文章
async function publishDraft(draftPath) {
  const fullDraftPath = path.join(DRAFTS_DIR, draftPath);
  let destPath = path.join(POSTS_DIR, draftPath);
  const isDir = draftPath.includes('index.md');
  const title = isDir
    ? path.basename(path.dirname(draftPath))
    : path.basename(draftPath, '.md');

  const { exists } = await checkFileExists(POSTS_DIR, title);
  if (exists) {
    destPath = await handleFileConflict(title, isDir);
    if (!destPath) {
      console.log(t('invalidOption'));
      process.exit(1);
    }
  }
  try {
    // 确保目标目录存在
    await fs.mkdir(path.dirname(destPath), { recursive: true });

    // 如果是目录形式,需要复制整个目录
    if (isDir) {
      const draftDir = path.dirname(fullDraftPath);
      const destDir = path.dirname(destPath);

      // 复制目录内所有文件
      const files = await fs.readdir(draftDir);
      for (const file of files) {
        const srcFile = path.join(draftDir, file);
        const destFile = path.join(destDir, file);
        await fs.copyFile(srcFile, destFile);
      }

      // 删除源目录
      await fs.rm(draftDir, { recursive: true });
    } else {
      // 移动单个文件
      await fs.copyFile(fullDraftPath, destPath);
      await fs.unlink(fullDraftPath);
    }

    console.log(t('publishSuccess', { path: destPath }));
  } catch (error) {
    console.error(t('publishError', { path: draftPath }), error);
    process.exit(1);
  }
}

async function main() {
  // 获取所有草稿
  const drafts = await getAllDrafts();

  if (drafts.length === 0) {
    console.log(t('noDrafts'));
    rl.close();
    return;
  }

  let currentPage = 1;
  const totalPages = await listDraftsWithPagination(drafts, currentPage);

  while (true) {
    const answer = await rl.question(t('selectDraft'));

    if (answer.toLowerCase() === 'n' && currentPage < totalPages) {
      currentPage++;
      await listDraftsWithPagination(drafts, currentPage);
      continue;
    }

    if (answer.toLowerCase() === 'p' && currentPage > 1) {
      currentPage--;
      await listDraftsWithPagination(drafts, currentPage);
      continue;
    }

    const selection = parseInt(answer);
    if (isNaN(selection) || selection < 1 || selection > drafts.length) {
      console.log(t('invalidSelection'));
      continue;
    }

    const selectedDraft = drafts[selection - 1];
    await publishDraft(selectedDraft);
    break;
  }

  rl.close();
}

program
  .name('pub')
  .description(t('cli.pubDescription'))
  .helpOption('-h, --help', t('cli.helpOption'))
  .showHelpAfterError(t('cli.showHelp'));

program.parse();

main().catch((error) => {
  console.error(t('cli.error'), error);
  process.exit(1);
});
