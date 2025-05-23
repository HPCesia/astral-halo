import { ParseFrontmatterOptions, parseFrontmatter } from '@astrojs/markdown-remark';
import { slug as githubSlug } from 'github-slugger';
import yaml, { type DumpOptions } from 'js-yaml';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Converts a string into a URL-friendly slug.
 *
 * - Converts to lowercase.
 * - Replaces spaces and non-alphanumeric characters (excluding hyphens) with hyphens.
 * - Removes leading/trailing hyphens.
 * - Collapses multiple consecutive hyphens into a single hyphen.
 * @param text The string to slugify.
 * @param hard A boolean indicating the type of slugification.
 *   - `true`: Use github-slugger to create a github-like slug.
 *   - `false`: Only replaces invalid path characters (e.g., `\ / : * ? " < > |`) with hyphens.
 * @returns The slugified string.
 */
export function slugify(text: string, hard: boolean = false): string {
  if (!text) {
    return '';
  }
  const newText = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[\\/:*?"<>|]/g, '-') // Replace invalid path characters with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  if (hard) return githubSlug(newText);
  return newText;
}

/**
 * Change the frontmatter of a given markdown string and returns the changed string.
 *
 * @param code The markdown string to be changed.
 * @param changedPairs The KV pairs to be changed in the frontmatter.
 * @param parseOption The option for parsing the frontmatter.
 * @param dumpOption The option for dumping the frontmatter.
 * @returns The changed markdown string.
 */
export function changeFrontmatter(
  code: string,
  changedPairs: Record<string, unknown>,
  parseOption?: ParseFrontmatterOptions,
  dumpOption?: DumpOptions
): string {
  const { frontmatter, content } = parseFrontmatter(code, parseOption);
  const newFrontmatter = { ...frontmatter, ...changedPairs };
  const raw = `---\n${yaml.dump(newFrontmatter, dumpOption)}---${content}`;
  return raw;
}

/**
 * Information about an available file name.
 */
export interface AvailableFileNameInfo {
  /** The full file name including extension and counter if used (e.g., 'my-article-1.md') */
  fileName: string;
  /** The file name without extension, including counter if used (e.g., 'my-article-1') */
  nameWithoutExt: string;
  /** The counter used, or null if the original name was available. */
  counter: number | null;
}

/**
 * Finds an available filename in a directory by appending a counter if the base name already exists.
 * e.g., if 'file.md' exists, it will try 'file-1.md', 'file-2.md', and so on.
 * The baseName is the initial slug, and the counter is appended to this slug.
 * @param directory The directory to check for the file.
 * @param baseSlug The initial slug of the file (without extension or counter, e.g., 'my-article').
 * @param extension The file extension (e.g., '.md').
 * @returns A promise that resolves to an object containing the available full file name, name without extension, and the counter used.
 */
export async function findAvailableFileName(
  directory: string,
  baseSlug: string,
  extension: string
): Promise<AvailableFileNameInfo> {
  let counter = 0;
  let currentNameWithoutExt = baseSlug;
  let currentFileName = baseSlug + extension;
  let filePath = path.join(directory, currentFileName);
  let usedCounter: number | null = null;

  // Check if the initial name (without counter) is available
  try {
    await fs.access(filePath);
    // File exists, start counter from 1
    counter = 1;
    usedCounter = counter;
    currentNameWithoutExt = `${baseSlug}-${counter}`;
    currentFileName = currentNameWithoutExt + extension;
    filePath = path.join(directory, currentFileName);
  } catch {
    // Initial file does not exist, return it
    return { fileName: currentFileName, nameWithoutExt: currentNameWithoutExt, counter: null };
  }

  // If initial name was taken, find next available
  while (true) {
    try {
      await fs.access(filePath);
      counter++;
      usedCounter = counter;
      currentNameWithoutExt = `${baseSlug}-${counter}`;
      currentFileName = currentNameWithoutExt + extension;
      filePath = path.join(directory, currentFileName);
    } catch {
      // File does not exist, this name is available
      return {
        fileName: currentFileName,
        nameWithoutExt: currentNameWithoutExt,
        counter: usedCounter,
      };
    }
  }
}

/**
 * Finds the monorepo root directory by searching upwards for a 'pnpm-workspace.yaml' file.
 * @param startDir The directory to start searching from. Defaults to the current working directory of the script.
 * @returns The path to the monorepo root directory.
 * @throws Error if 'pnpm-workspace.yaml' is not found after searching up to the filesystem root.
 */
export async function findMonorepoRoot(
  startDir: string = path.dirname(new URL(import.meta.url).pathname)
): Promise<string> {
  let currentDir = startDir;
  // Adjust for Windows if path starts with /C: -> C:
  if (process.platform === 'win32' && currentDir.match(/^\/[A-Za-z]:/)) {
    currentDir = currentDir.substring(1);
  }

  while (true) {
    const workspaceFilePath = path.join(currentDir, 'pnpm-workspace.yaml');
    try {
      await fs.access(workspaceFilePath);
      return currentDir; // Found the file, this is the root
    } catch {
      // File not found, move up one directory
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached the filesystem root and haven't found the file
        throw new Error("Could not find 'pnpm-workspace.yaml'.");
      }
      currentDir = parentDir;
    }
  }
}
