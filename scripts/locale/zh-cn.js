export default {
  fileExist: '文件 {path} 已存在',
  chooseAction: '请选择操作：',
  actions: {
    useNewName: '使用新的文件名',
    overwrite: '覆盖原文件',
    exit: '退出程序',
  },
  draftsTitle: '草稿列表 (第 {current}/{total} 页):',
  paginationTip: '输入 n(下一页) 或 p(上一页) 翻页，或输入编号选择草稿',
  noDrafts: '没有找到任何草稿',
  selectDraft: '请选择要发布的草稿编号: ',
  readDraftsError: '读取草稿文件出错:',
  publishSuccess: '已发布到: {path}',
  publishError: '发布 {path} 时出错:',
  invalidSelection: '无效的选择，请输入正确的编号',
  inputOption: '请输入选项 ({countStart}-{countEnd}): ',
  invalidOption: '无效的选项，退出程序',
  timezoneError: '时区格式错误:',
  created: {
    post: '已创建文章: {path}',
    draft: '已创建草稿: {path}',
  },
  cli: {
    description: '创建新的文章或草稿',
    typeArg: '创建类型 (post 或 draft)',
    titleArg: '文章标题',
    dirOption: '创建目录形式的文章',
    timezoneOption: '指定时区',
    helpOption: '显示帮助信息',
    showHelp: '(使用 --help 查看更多信息)',
    examples: `
示例:
  $ new post "My First Post" -t "+08:00"       创建一篇新文章，使用东八区时间
  $ new draft "Draft Post" -d -t "asia/tokyo"  创建一篇草稿，使用目录形式与东京时区
  $ new post "Second Post"                     创建一篇文章，使用本地时区`,
    error: '错误:',
    typeError: '错误: 类型必须是 post 或 draft',
    timezoneWarning: '警告：草稿模式下 timezone 参数无效',
    pubDescription: '发布草稿到文章',
  },
};
