import type { NamespaceCliTranslation } from '../../i18n-types.js';

const zh_TW_cli = {
  new: {
    prompt: {
      title: '請輸入新文章的標題：',
      category: '請輸入文章分類（可選）：',
      tags: '請輸入文章標籤，以逗號分隔（可選）：',
    },
    action: {
      exit: '退出，不創建草稿',
    },
    info: {
      success_created: '成功創建文章：{filePath}',
      overwrite: '正在覆蓋現有文件：{filePath}',
    },
    error: {
      no_title: '文章標題不能為空。',
    },
  },
  pub: {
    prompt: {
      select: '請選擇要發布的草稿：',
    },
    action: {
      exit: '退出，不發布',
    },
    info: {
      no_drafts_found: '未找到可發布的草稿。',
      success_article_published: "成功將 '{source}' 發布到 '{destination}'。",
      info_empty_dir_removed: '已清理空的源目錄：{dirPath}',
      publish_cancelled: '發布操作已取消。',
    },
    error: {
      publish_article: '發布文章時出錯：{message}',
    },
  },
  prompt: {
    file_exists: '文件 {filePath} 已存在。請選擇操作：',
    enter_new_name: '請輸入新文件名（不帶擴展名）：',
  },
  action: {
    rename: '重命名文件',
    overwrite: '覆蓋現有文件',
  },
  info: {
    cancelled_by_user: '用戶已取消操作。',
    provide_root_dir_guidance: '嘗試使用 {option} 選項運行命令以指定根目錄。',
  },
  error: {
    unexpected: '發生意外錯誤：{message}',
    generic: '發生錯誤：{message}',
    file_exists: '文件已存在：{filePath}',
    create_file: '創建文件時出錯：{message}',
    empty_filename: '文件名不能為空。',
    rename_to_original_conflict: '新文件名與原文件名衝突：{fileName}',
    failed_to_find_root: '無法確定項目根目錄：{message}',
  },
} satisfies NamespaceCliTranslation;

export default zh_TW_cli;
