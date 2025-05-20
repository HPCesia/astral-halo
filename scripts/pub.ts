import L from '../i18n/i18n-node';
import type { Locales } from '../i18n/i18n-types';
import { config as scriptConfig } from './config';
import { findAvailableFileName, slugify } from './utils';
import type { AvailableFileNameInfo } from './utils';
import { ExitPromptError } from '@inquirer/core';
import { input, select } from '@inquirer/prompts';
import dayjs from 'dayjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { osLocaleSync } from 'os-locale';

const availableLocalesForScript: Locales[] = ['en', 'zh-CN', 'zh-TW'];
let detectedSystemLocale: string = 'en';
try {
  detectedSystemLocale = osLocaleSync().replace('_', '-');
} catch {
  console.warn('Failed to detect system locale, defaulting to en.');
}
const currentLocale: Locales = availableLocalesForScript.includes(
  detectedSystemLocale as Locales
)
  ? (detectedSystemLocale as Locales)
  : 'en';

async function listDrafts(draftsDirPath: string): Promise<string[]> {
  try {
    const dirents = await fs.readdir(draftsDirPath, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const res = path.resolve(draftsDirPath, dirent.name);
        if (dirent.isDirectory()) {
          const subFiles = await listDrafts(res);
          return subFiles.map((sf) => path.join(dirent.name, sf));
        }
        return dirent.isFile() && dirent.name.endsWith('.md') ? dirent.name : null;
      })
    );
    return files.flat().filter((file) => file !== null) as string[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function updateFrontmatterWithPublishedDate(filePath: string): Promise<void> {
  let content = await fs.readFile(filePath, 'utf-8');
  const publishedDate = dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

  const frontmatterRegex = /^---([\s\S]*?^---\s*)/m;
  const match = content.match(frontmatterRegex);

  if (match) {
    let fmString = match[1];
    const publishedLineRegex = /^published:.*$/m;

    if (publishedLineRegex.test(fmString)) {
      fmString = fmString.replace(publishedLineRegex, `published: ${publishedDate}`);
    } else {
      fmString = fmString.replace(/^(---)$/m, `published: ${publishedDate}\n---`);
    }
    content = content.replace(frontmatterRegex, '---' + fmString);
  } else {
    throw new Error('Frontmatter not found in the file.');
  }
  await fs.writeFile(filePath, content, 'utf-8');
}

async function run() {
  const draftsDir = path.resolve(process.cwd(), scriptConfig.draftsDir);
  let postsDir = path.resolve(process.cwd(), scriptConfig.postsDir); // Made postsDir mutable

  let selectedDraftRelativePath: string | undefined;

  try {
    const draftFiles = await listDrafts(draftsDir);

    if (draftFiles.length === 0) {
      console.log(L[currentLocale].cli.pub.info.no_drafts_found());
      return;
    }

    selectedDraftRelativePath = await select({
      message: L[currentLocale].cli.pub.prompt.select(),
      choices: draftFiles.map((file) => ({ name: file, value: file })),
    });

    let fileName = path.basename(selectedDraftRelativePath);
    const finalSourcePath = path.join(draftsDir, selectedDraftRelativePath);
    const fileExtension = path.extname(fileName);
    const baseNameWithoutExt = path.basename(fileName, fileExtension);

    let finalDestinationPath = path.join(postsDir, fileName);

    if (scriptConfig.postStructure === 'category') {
      try {
        const draftContent = await fs.readFile(finalSourcePath, 'utf-8');
        // Basic frontmatter parsing to find category
        const fmRegex = /^---([\s\S]*?)^---/m;
        const fmMatch = draftContent.match(fmRegex);
        let category: string | undefined;
        if (fmMatch && fmMatch[1]) {
          const fmLines = fmMatch[1].split('\n');
          const categoryLine = fmLines.find((line) => line.trim().startsWith('category:'));
          if (categoryLine) {
            // Extract category value, remove potential quotes, and trim whitespace
            category = categoryLine
              .substring(categoryLine.indexOf(':') + 1)
              .trim()
              .replace(/^['"]|['"]$/g, '');
          }
        }

        if (slugify(category || '') !== '') {
          postsDir = path.join(postsDir, slugify(category || ''));
          finalDestinationPath = path.join(postsDir, fileName);
        }
      } catch (e) {
        console.warn(
          L[currentLocale].cli.error.generic({
            message: `Failed to read or parse category from draft: ${(e as Error).message}`,
          })
        );
        // Proceed with flat structure if category parsing fails
      }
    }

    await fs.mkdir(postsDir, { recursive: true });

    let proceedWithPublish = false;
    try {
      await fs.access(finalDestinationPath); // Check if destination file exists

      const action = await select({
        message: L[currentLocale].cli.prompt.file_exists({
          filePath: finalDestinationPath,
        }),
        choices: [
          {
            name: L[currentLocale].cli.action.rename(), // Reusing from 'new' script i18n
            value: 'rename',
          },
          {
            name: L[currentLocale].cli.action.overwrite(), // Reusing from 'new' script i18n
            value: 'overwrite',
          },
          {
            name: L[currentLocale].cli.pub.action.exit(), // Reusing from 'new' script i18n
            value: 'exit',
          },
        ],
      });

      if (action === 'exit') {
        console.log(L[currentLocale].cli.pub.info.publish_cancelled());
        return;
      } else if (action === 'overwrite') {
        proceedWithPublish = true;
      } else if (action === 'rename') {
        const suggestedNameInfo: AvailableFileNameInfo = await findAvailableFileName(
          postsDir, // Target directory for posts
          baseNameWithoutExt,
          fileExtension
        );

        let userConfirmedNewName = false;
        while (!userConfirmedNewName) {
          try {
            const newNameInput = await input({
              message: L[currentLocale].cli.prompt.enter_new_name(), // Reusing
              default: suggestedNameInfo.fileName,
            });

            if (!newNameInput || newNameInput.trim() === '') {
              console.error(L[currentLocale].cli.error.empty_filename()); // Reusing
              continue;
            }

            let potentialNewFileName = newNameInput.trim();
            if (path.extname(potentialNewFileName) !== fileExtension) {
              potentialNewFileName =
                path.basename(potentialNewFileName, path.extname(potentialNewFileName)) +
                fileExtension;
            }

            const potentialNewDestPath = path.join(postsDir, potentialNewFileName);

            if (potentialNewDestPath === finalDestinationPath) {
              console.error(
                L[currentLocale].cli.error.rename_to_original_conflict({
                  // Reusing
                  fileName: potentialNewFileName,
                })
              );
              continue;
            }

            try {
              await fs.access(potentialNewDestPath);
              console.error(
                L[currentLocale].cli.error.file_exists({
                  // Reusing
                  filePath: potentialNewDestPath,
                })
              );
            } catch {
              // File does not exist, this name is good
              fileName = potentialNewFileName; // Update fileName for the destination
              finalDestinationPath = potentialNewDestPath;
              proceedWithPublish = true;
              userConfirmedNewName = true;
            }
          } catch (error) {
            if (error instanceof ExitPromptError) {
              console.log(L[currentLocale].cli.info.cancelled_by_user());
              process.exit(0);
            }
            throw error;
          }
        }
      }
    } catch {
      // File does not exist at destination, can proceed directly
      proceedWithPublish = true;
    }

    if (!proceedWithPublish) {
      console.log(L[currentLocale].cli.pub.info.publish_cancelled());
      return;
    }

    await fs.rename(finalSourcePath, finalDestinationPath);
    await updateFrontmatterWithPublishedDate(finalDestinationPath);

    console.log(
      L[currentLocale].cli.pub.info.success_article_published({
        source: selectedDraftRelativePath,
        destination: finalDestinationPath,
      })
    );

    const sourceDir = path.dirname(finalSourcePath);
    if (sourceDir !== draftsDir) {
      try {
        const filesInSourceDir = await fs.readdir(sourceDir);
        if (filesInSourceDir.length === 0) {
          await fs.rmdir(sourceDir);
          console.log(
            L[currentLocale].cli.pub.info.info_empty_dir_removed({ dirPath: sourceDir })
          );
        }
      } catch (err) {
        // Ignore if directory removal fails (e.g. not empty, permissions)
        console.warn(`Could not remove directory ${sourceDir}:`, err);
      }
    }
  } catch (error) {
    if (error instanceof ExitPromptError) {
      console.log(L[currentLocale].cli.info.cancelled_by_user());
      process.exit(0);
    } else {
      console.error(
        L[currentLocale].cli.pub.error.publish_article({ message: (error as Error).message })
      );
      process.exit(1);
    }
  }
}

async function main() {
  try {
    await run();
  } catch (error) {
    if (!(error instanceof ExitPromptError)) {
      console.error(
        L[currentLocale].cli.error.unexpected({
          message: (error as Error).message || String(error),
        }),
        error
      );
    }
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log(L[currentLocale].cli.info.cancelled_by_user());
  process.exit(0);
});

main();
