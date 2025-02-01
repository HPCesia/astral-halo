#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const [, , name] = process.argv;

if (!name) {
  console.error('Usage: pnpm publish [name]');
  process.exit(1);
}

function sanitizeFilename(filename) {
  const basename = filename.replace(/\.md$/, '');
  return basename
    .replace(/[<>:"/\\|?*.,\s]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findDraftPath(draftDir, sanitizedName) {
  // 检查常规文件
  const regularPath = path.join(draftDir, `${sanitizedName}.md`);
  const dirPath = path.join(draftDir, sanitizedName, 'index.md');

  // 记录找到的所有匹配路径
  const foundPaths = [];

  if (await checkFileExists(regularPath)) {
    foundPaths.push(regularPath);
  }
  if (await checkFileExists(dirPath)) {
    foundPaths.push(dirPath);
  }

  if (foundPaths.length === 0) {
    return null;
  }

  if (foundPaths.length === 1) {
    return foundPaths[0];
  }

  console.log('\nMultiple drafts found with the same name:');
  foundPaths.forEach((p, i) => {
    console.log(`${i + 1}. ${p}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
    rl.question('\nChoose which draft to publish (enter number): ', resolve);
  });
  rl.close();

  const choice = parseInt(answer.trim()) - 1;
  if (choice >= 0 && choice < foundPaths.length) {
    return foundPaths[choice];
  }

  console.error('\nInvalid choice');
  process.exit(1);
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    const sanitizedName = sanitizeFilename(name);
    const draftDir = path.resolve('src', 'content', 'drafts');
    const postsDir = path.resolve('src', 'content', 'posts');

    const draftPath = await findDraftPath(draftDir, sanitizedName);
    if (!draftPath) {
      console.error(`\nError: Draft not found: ${sanitizedName}`);
      process.exit(1);
    }

    const isDirDraft = path.basename(draftPath) === 'index.md';
    let targetPath;

    if (isDirDraft) {
      targetPath = path.join(postsDir, path.basename(path.dirname(draftPath)), 'index.md');
    } else {
      targetPath = path.join(postsDir, `${sanitizedName}.md`);
    }

    const content = await fs.readFile(draftPath, 'utf-8');

    const now = new Date().toISOString();
    const updatedContent = content.replace(/^(---\n(?:.*\n)*?)(---)/, (match, front, end) => {
      if (!front.includes('published:')) {
        return `${front}published: ${now}\n${end}`;
      }
      return match;
    });

    if (isDirDraft) {
      const srcDir = path.dirname(draftPath);
      const destDir = path.dirname(targetPath);
      await copyDirectory(srcDir, destDir);
      await fs.writeFile(targetPath, updatedContent, 'utf-8');
      await fs.rm(srcDir, { recursive: true });
    } else {
      await fs.mkdir(postsDir, { recursive: true });
      await fs.writeFile(targetPath, updatedContent, 'utf-8');
      await fs.unlink(draftPath);
    }

    console.log(`\nSuccessfully published: ${targetPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
