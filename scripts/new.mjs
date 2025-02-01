#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const args = process.argv.slice(2);
let type,
  name,
  isDir = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir') {
    isDir = true;
    continue;
  }
  if (!type) {
    type = args[i];
  } else if (!name) {
    name = args[i];
  }
}

if (!type || !name) {
  console.error('Usage: pnpm new [post|draft] [name] [--dir]');
  process.exit(1);
}

if (type !== 'post' && type !== 'draft') {
  console.error('Type must be either "post" or "draft"');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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

async function findAvailableFilename(basePath, baseName) {
  let counter = 1;
  let filePath = basePath;

  while (await checkFileExists(filePath)) {
    if (isDir) {
      const dirName = `${baseName}-${counter}`;
      filePath = path.join(path.dirname(path.dirname(basePath)), dirName, 'index.md');
    } else {
      filePath = path.join(path.dirname(basePath), `${baseName}-${counter}.md`);
    }
    counter++;
  }

  return filePath;
}

async function handleExistingFile(targetPath) {
  console.log('\nFile already exists:', targetPath);
  console.log('1. Overwrite');
  console.log('2. Use a different name (auto-numbered)');
  console.log('3. Cancel\n');

  const answer = await question('Choose an option: ');

  switch (answer.trim()) {
    case '1':
      return targetPath;
    case '2':
      return await findAvailableFilename(
        targetPath,
        path.basename(isDir ? path.dirname(targetPath) : targetPath, '.md')
      );
    case '3':
      rl.close();
      console.log('\nOperation cancelled');
      process.exit(0);
      break;
    default:
      console.log('\nInvalid option, operation cancelled');
      rl.close();
      process.exit(1);
  }
}

async function main() {
  try {
    const templatePath = path.resolve('scaffolds', `${type}.md`);
    const template = await fs.readFile(templatePath, 'utf-8');

    const now = new Date().toISOString();
    const variables = {
      title: name,
      date: now,
    };

    const content = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return variables[key] || '';
    });

    const targetDir = path.resolve('src', 'content', `${type}s`);
    const sanitizedName = sanitizeFilename(name);
    let targetPath;

    if (isDir) {
      targetPath = path.join(targetDir, sanitizedName, 'index.md');
    } else {
      targetPath = path.join(targetDir, `${sanitizedName}.md`);
    }

    if (await checkFileExists(targetPath)) {
      targetPath = await handleExistingFile(targetPath);
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    await fs.writeFile(targetPath, content, 'utf-8');
    console.log(`\nSuccessfully created ${type}: ${targetPath}`);
    rl.close();
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
