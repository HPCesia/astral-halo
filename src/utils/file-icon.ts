const imageExtensions = [
  'avif',
  'bmp',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'tiff',
  'webp',
];

const documentExtensions = [
  'doc',
  'docx',
  'equb',
  'log',
  'md',
  'mdoc',
  'mdx',
  'pdf',
  'ppt',
  'pptx',
  'txt',
  'wps',
  'xls',
  'xlsx',
];

const codeExtensions = [
  'astro',
  'bat',
  'c',
  'cjs',
  'cmd',
  'cpp',
  'cs',
  'css',
  'csv',
  'dart',
  'ejs',
  'fish',
  'go',
  'h',
  'hpp',
  'hs',
  'html',
  'ini',
  'java',
  'js',
  'json',
  'kt',
  'kts',
  'less',
  'log',
  'lua',
  'm',
  'makefile',
  'mjs',
  'nu',
  'php',
  'plist',
  'ps1',
  'py',
  'r',
  'rb',
  'rs',
  'scss',
  'sh',
  'styl',
  'svelte',
  'swift',
  'toml',
  'ts',
  'tsx',
  'typ',
  'typst',
  'vue',
  'xml',
  'yml',
  'yaml',
  'zsh',
  'zig',
];

const gitRelatedExtensions = ['gitattributes', 'gitignore', 'gitkeep', 'gitmodules'];

// Map extensions to icons

const iconMap: Record<string, string> = {};

imageExtensions.forEach((ext) => {
  iconMap[ext] = 'mdi:file-image';
});

documentExtensions.forEach((ext) => {
  iconMap[ext] = 'mdi:file-document';
});

codeExtensions.forEach((ext) => {
  iconMap[ext] = 'mdi:file-code';
});

gitRelatedExtensions.forEach((ext) => {
  iconMap[ext] = 'mdi:git';
});

// Default icon
const defaultIcon = 'mdi:file';

export function fileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext && iconMap[ext] ? iconMap[ext] : defaultIcon;
}
