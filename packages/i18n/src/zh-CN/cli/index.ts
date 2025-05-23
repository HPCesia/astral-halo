import type { NamespaceCliTranslation } from '../../i18n-types.js';

const zh_CN_cli = {
  new: {
    prompt: {
      title: '请输入新文章的标题：',
      category: '请输入文章分类（可选）：',
      tags: '请输入文章标签，以逗号分隔（可选）：',
    },
    action: {
      exit: '退出，不创建草稿',
    },
    info: {
      success_created: '成功创建文章：{filePath}',
      overwrite: '正在覆盖现有文件：{filePath}',
    },
    error: {
      no_title: '文章标题不能为空。',
    },
  },
  pub: {
    prompt: {
      select: '请选择要发布的草稿：',
    },
    action: {
      exit: '退出，不发布',
    },
    info: {
      no_drafts_found: '未找到可发布的草稿。',
      success_article_published: "成功将 '{source}' 发布到 '{destination}'。",
      info_empty_dir_removed: '已清理空的源目录：{dirPath}',
      publish_cancelled: '发布操作已取消。',
    },
    error: {
      publish_article: '发布文章时出错：{message}',
    },
  },
  prompt: {
    file_exists: '文件 {filePath} 已存在。请选择操作：',
    enter_new_name: '请输入新文件名（不带扩展名）：',
  },
  action: {
    rename: '重命名文件',
    overwrite: '覆盖现有文件',
  },
  info: {
    cancelled_by_user: '用户已取消操作。',
  },
  error: {
    unexpected: '发生意外错误：{message}',
    generic: '发生错误：{message}',
    file_exists: '文件已存在：{filePath}',
    create_file: '创建文件时出错：{message}',
    empty_filename: '文件名不能为空。',
    rename_to_original_conflict: '新文件名与原文件名冲突：{fileName}',
  },
} satisfies NamespaceCliTranslation;

export default zh_CN_cli;
