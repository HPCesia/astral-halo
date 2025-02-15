import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { promises as fs } from 'fs';
import path from 'path';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 将不同格式的时区字符串转换为标准时区偏移量
 * @param {string} timezone - 时区字符串，支持以下格式：
 *   1. 标准时区名称 (如 "Asia/Shanghai")
 *   2. 仅小时偏移 (如 "+8", "-10", "+08")
 *   3. 完整偏移 (如 "+08:00", "-7:30")
 * @returns {string} 标准时区偏移量 (如 "+08:00", "-07:30")
 */
export function parseTimezoneOffset(timezone) {
  // 尝试匹配完整的时区偏移格式 (+08:00)
  const fullOffsetMatch = timezone.match(/^([+-])(\d{1,2}):(\d{2})$/);
  if (fullOffsetMatch) {
    const [, sign, hours, minutes] = fullOffsetMatch;
    const paddedHours = hours.padStart(2, '0');
    return `${sign}${paddedHours}:${minutes}`;
  }

  // 尝试匹配仅小时的偏移格式 (+8, +08)
  const hourOffsetMatch = timezone.match(/^([+-])(\d{1,2})$/);
  if (hourOffsetMatch) {
    const [, sign, hours] = hourOffsetMatch;
    const paddedHours = hours.padStart(2, '0');
    return `${sign}${paddedHours}:00`;
  }

  // 处理标准时区名称 (如 "Asia/Shanghai")
  try {
    // 使用 dayjs 获取指定时区的偏移量
    const date = dayjs().tz(timezone);
    if (!date.isValid()) {
      throw new Error('Invalid timezone');
    }

    const offset = date.utcOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch {
    throw new Error(`Invalid timezone format: ${timezone}`);
  }
}

/**
 * 将标题转换为合法的文件名
 * @param {string} title - 原始标题
 * @returns {string} 转换后的合法文件名，只包含小写字母、数字和连字符
 */
export function sanitizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 获取文件路径
 * @param {string} contentDir - 内容目录路径
 * @param {string} title - 文件名
 * @param {boolean} isDir - 是否创建为目录形式
 * @returns {string} 完整的文件路径
 */
export function getFilePath(contentDir, title, isDir) {
  return isDir
    ? path.join(contentDir, title, 'index.md')
    : path.join(contentDir, `${title}.md`);
}

/**
 * 检查文件是否存在，同时检查单文件和目录两种形式
 * @param {string} contentDir - 内容目录路径
 * @param {string} sanitizedTitle - 已转换的合法文件名
 * @param {number} [counter] - 可选的编号，用于检查带编号的文件名
 * @returns {Promise<{exists: boolean, filePath: string|null}>} 文件存在状态和路径
 */
export async function checkFileExists(contentDir, sanitizedTitle, counter) {
  const title = counter ? `${sanitizedTitle}-${counter}` : sanitizedTitle;
  const filePath = getFilePath(contentDir, title, false);
  const dirPath = getFilePath(contentDir, title, true);

  try {
    const results = await Promise.all([
      fs
        .access(filePath)
        .then(() => true)
        .catch(() => false),
      fs
        .access(dirPath)
        .then(() => true)
        .catch(() => false),
    ]);
    return {
      exists: results[0] || results[1],
      filePath: results[0] ? filePath : results[1] ? dirPath : null,
    };
  } catch {
    return { exists: false, filePath: null };
  }
}
