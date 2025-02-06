#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

function parseArgs(args) {
  const result = {
    type: null,
    name: null,
    isDir: false,
    timezone: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dir') {
      result.isDir = true;
      continue;
    }
    if (arg.startsWith('--timezone=')) {
      result.timezone = arg.split('=')[1];
      continue;
    }
    if (!result.type) {
      result.type = arg;
    } else if (!result.name) {
      result.name = arg;
    }
  }
  return result;
}

const { type, name, isDir, timezone } = parseArgs(process.argv.slice(2));

if (!type || !name) {
  console.error('Usage: pnpm new [post|draft] [name] [--dir] [--timezone=offset|locale]');
  console.error('Examples:');
  console.error('  pnpm new post "My Post" --timezone=+08:00');
  console.error('  pnpm new post "My Post" --timezone=Asia/Shanghai');
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

async function main() {
  try {
    const templatePath = path.resolve('scaffolds', `${type}.md`);
    const template = await fs.readFile(templatePath, 'utf-8');

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
