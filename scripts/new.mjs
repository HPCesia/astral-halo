import { t } from './locale/index.js';
import { checkFileExists, getFilePath, parseTimezoneOffset, sanitizeTitle } from './utils.mjs';
import { Command } from 'commander';
import dayjs from 'dayjs';
import { promises as fs } from 'fs';
import path from 'path';
import { createInterface } from 'readline/promises';

const program = new Command();
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 处理文件名冲突
async function handleFileConflict(contentDir, sanitizedTitle, isDir) {
  console.log(t('fileExist', { title: sanitizedTitle }));
  console.log(t('chooseAction'));
  console.log('1. ', t('actions.useNewName'));
  console.log('2. ', t('actions.overwrite'));
  console.log('3. ', t('actions.exit'));

  const answer = await rl.question(t('inputOption', { countStart: 1, countEnd: 3 }));

  switch (answer.trim()) {
    case '1': {
      let counter = 1;
      while ((await checkFileExists(contentDir, sanitizedTitle, counter)).exists) {
        counter++;
      }
      const newTitle = `${sanitizedTitle}-${counter}`;
      return getFilePath(contentDir, newTitle, isDir);
    }
    case '2':
      return getFilePath(contentDir, sanitizedTitle, isDir);
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

// 格式化时间
function formatDateTime(offset) {
  const now = offset ? dayjs().utcOffset(offset) : dayjs();
  return now.format('YYYY-MM-DDTHH:mm:ssZ');
}

// 创建文章
async function createArticle(type, title, options) {
  const template = await fs.readFile(`scaffolds/${type}.md`, 'utf-8');
  const sanitizedTitle = sanitizeTitle(title);
  const contentDir = path.join('src/content', type === 'post' ? 'posts' : 'drafts');

  await fs.mkdir(contentDir, { recursive: true });
  const { exists } = await checkFileExists(contentDir, sanitizedTitle);
  let filepath = getFilePath(contentDir, sanitizedTitle, options.dir);

  // 如果文件已存在，处理冲突
  if (exists) {
    filepath = await handleFileConflict(contentDir, sanitizedTitle, options.dir);
  }

  // 如果需要创建目录，确保目录存在
  if (options.dir) {
    await fs.mkdir(path.dirname(filepath), { recursive: true });
  }

  // 处理模板
  let content = template.replace('{{ title }}', title);

  // 对于文章类型，添加发布时间
  if (type === 'post') {
    let formattedDate;
    if (options.timezone) {
      try {
        const offset = parseTimezoneOffset(options.timezone);
        formattedDate = formatDateTime(offset);
      } catch (error) {
        console.error(t('timezoneError'), error.message);
        rl.close();
        process.exit(1);
      }
    } else {
      formattedDate = formatDateTime();
    }
    content = content.replace('{{ date }}', formattedDate);
  }

  // 写入文件
  await fs.writeFile(filepath, content);
  console.log(t(`created.${type}`, { path: filepath }));
  rl.close();
}

program
  .name('new')
  .description(t('cli.description'))
  .argument('<type>', t('cli.typeArg'))
  .argument('<title>', t('cli.titleArg'))
  .option('-d, --dir', t('cli.dirOption'), false)
  .option('-t, --timezone <tz>', t('cli.timezoneOption'))
  .helpOption('-h, --help', t('cli.helpOption'))
  .showHelpAfterError(t('cli.showHelp'))
  .addHelpText('after', t('cli.examples'));

// 在解析之前添加错误处理
program.showHelpAfterError();

try {
  program.parse();
} catch (error) {
  console.error(t('cli.error'), error.message);
  program.help();
}

const options = program.opts();
const [type, title] = program.args;

if (!['post', 'draft'].includes(type)) {
  console.error(t('cli.typeError'));
  program.help();
  process.exit(1);
}

if (type === 'draft' && options.timezone) {
  console.log(t('cli.timezoneWarning'));
}

// 执行创建
createArticle(type, title, options).catch((error) => {
  console.error(t('cli.error'), error.message);
  process.exit(1);
});
