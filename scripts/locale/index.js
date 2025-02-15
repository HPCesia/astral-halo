import en from './en.js';
import zhCN from './zh-cn.js';
import os from 'os';

function getSystemLanguage() {
  // 按照优先级尝试不同的方式获取系统语言
  const lang =
    process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || os.locale() || 'en-US';

  return lang.toLowerCase();
}

function format(str, params) {
  return str.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
}

export function t(key, params = {}) {
  const lang = getSystemLanguage();
  const messages = lang.startsWith('zh') ? zhCN : en;

  // 支持嵌套键值，如 'cli.description'
  const value = key.split('.').reduce((obj, k) => obj?.[k], messages);

  if (value === undefined) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return params ? format(value, params) : value;
}
