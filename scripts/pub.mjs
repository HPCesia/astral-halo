#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

function parseArgs(args) {
  const result = {
    name: null,
    timezone: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--timezone=')) {
      result.timezone = arg.split('=')[1];
      continue;
    }
    if (!result.name) {
      result.name = arg;
    }
  }
  return result;
}

function validateTimezone(timezone) {
  if (!timezone) return null;

  // 验证时区偏移格式 (+/-HH:mm)
  if (/^[+-]\d{2}:\d{2}$/.test(timezone)) {
    const [hours, minutes] = timezone.slice(1).split(':').map(Number);
    if (hours <= 23 && minutes <= 59) {
      return { type: 'offset', value: timezone };
    }
  }

  // 验证时区名称格式
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return { type: 'timezone', value: timezone };
  } catch {
    console.error(`Invalid timezone: ${timezone}`);
    console.error('Example formats:');
    console.error('  Offset: +08:00, -05:30');
    console.error('  Name: Asia/Shanghai, America/New_York');
    process.exit(1);
  }
}

const { name, timezone } = parseArgs(process.argv.slice(2));

if (!name) {
  console.error('Usage: pnpm publish [name] [--timezone=offset|locale]');
  console.error('Examples:');
  console.error('  pnpm publish "My Post" --timezone=+08:00');
  console.error('  pnpm publish "My Post" --timezone=Asia/Shanghai');
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

    let targetDate = new Date();
    let offsetStr;

    if (timezone) {
      const validTimezone = validateTimezone(timezone);
      if (validTimezone.type === 'offset') {
        // 如果是时区偏移，需要根据偏移调整时间
        // 解析偏移
        const [, sign, hours, minutes] = validTimezone.value
          .match(/([+-])(\d{2}):(\d{2})/)
          .map((v, i) => (i > 1 ? parseInt(v) : v));

        // 将本地时间转换为 UTC
        const utcTime = targetDate.getTime() + targetDate.getTimezoneOffset() * 60000;

        // 从 UTC 调整到目标时区
        const targetTime = utcTime + (sign === '+' ? 1 : -1) * (hours * 60 + minutes) * 60000;
        targetDate = new Date(targetTime);
        offsetStr = validTimezone.value;
      } else {
        // 如果是时区名称，使用该时区的时间
        const utcDate = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000);
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: validTimezone.value,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        });

        const localeDateParts = formatter.formatToParts(utcDate);
        const timezonePart = localeDateParts.find((part) => part.type === 'timeZoneName').value;
        const match = timezonePart.match(/GMT([+-]\d{1,2})(?::?(\d{2})?)?/);
        if (match) {
          const [, hours, minutes = '00'] = match;
          offsetStr = `${hours.padStart(2, '0')}:${minutes}`;
          if (!offsetStr.startsWith('+') && !offsetStr.startsWith('-')) {
            offsetStr = '+' + offsetStr;
          }
        }

        targetDate = new Date(
          targetDate.toLocaleString('en-US', { timeZone: validTimezone.value })
        );
      }
    } else {
      // 使用系统默认时区
      const offset = -targetDate.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offset) / 60)
        .toString()
        .padStart(2, '0');
      const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
      offsetStr = `${offset >= 0 ? '+' : '-'}${offsetHours}:${offsetMinutes}`;
    }

    const now = targetDate.toLocaleString('sv').replace(' ', 'T') + offsetStr;
    const updatedContent = content.replace(/^(---[\s\S]*?)(---)/, (match, front, end) => {
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
