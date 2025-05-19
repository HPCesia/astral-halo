import L from '../i18n/i18n-node';
import type { Locales } from '../i18n/i18n-types';
import { config as scriptConfig } from './config';
import { changeFrontmatter, findAvailableFileName, slugify } from './utils';
import type { AvailableFileNameInfo } from './utils';
import { Command, OptionValues } from '@commander-js/extra-typings';
import { ExitPromptError } from '@inquirer/core';
import { input, select } from '@inquirer/prompts';
import fs from 'node:fs/promises';
import path from 'node:path';
import { osLocaleSync } from 'os-locale';

// Define CLI options interface
interface CLIOptions extends OptionValues {
  title?: string;
  category?: string;
  tags?: string;
}

const program = new Command<[], CLIOptions>();

// Determine current locale
const availableLocalesForScript: Locales[] = ['en', 'zh-CN'];
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

program
  .name('new-article')
  .description('Create a new draft article')
  .option('-t, --title <titleString>', 'Article title')
  .option('-c, --category <categoryString>', 'Article category (optional)')
  .option('-T, --tags <tagsString>', 'Article tags, comma-separated (optional)')
  .action(async (options: CLIOptions) => {
    const { title: cliTitle, category: cliCategory, tags: cliTags } = options;

    let title = cliTitle;
    let category = cliCategory;
    let tags = cliTags;

    try {
      // Interactive mode
      if (!title) {
        title = await input({ message: L[currentLocale].cli.new.prompt.title() });
      }
      if (category === undefined && title) {
        category = await input({ message: L[currentLocale].cli.new.prompt.category() });
      }
      if (tags === undefined && title) {
        tags = await input({ message: L[currentLocale].cli.new.prompt.tags() });
      }
    } catch (error) {
      if (error instanceof ExitPromptError) {
        console.log(L[currentLocale].cli.info.cancelled_by_user());
        process.exit(0);
      }
      throw error;
    }

    if (!title || title.trim() === '') {
      console.error(L[currentLocale].cli.new.error.no_title());
      process.exit(1);
    }

    let slug = slugify(title, true); // Used for frontmatter
    const baseSlugForFile = slugify(title); // Used for filename generation, might be different from frontmatter slug
    const fileExtension = '.md';
    const currentFileName = `${baseSlugForFile}${fileExtension}`;

    let targetDir = path.resolve(process.cwd(), scriptConfig.draftsDir);
    if (scriptConfig.draftStructure === 'category' && category && category.trim() !== '') {
      const categorySlug = slugify(category);
      targetDir = path.join(targetDir, categorySlug);
    }

    try {
      await fs.mkdir(targetDir, { recursive: true });
      const filePath = path.join(targetDir, currentFileName);
      let finalFilePath = filePath;

      let fileExists = false;
      try {
        await fs.access(filePath);
        fileExists = true;
      } catch {
        // File does not exist, can proceed
      }

      if (fileExists) {
        const action = await select({
          message: L[currentLocale].cli.prompt.file_exists({ filePath }),
          choices: [
            {
              name: L[currentLocale].cli.action.rename(),
              value: 'rename',
            },
            {
              name: L[currentLocale].cli.action.overwrite(),
              value: 'overwrite',
            },
            {
              name: L[currentLocale].cli.new.action.exit(),
              value: 'exit',
            },
          ],
        });

        if (action === 'exit') {
          console.log(L[currentLocale].cli.info.cancelled_by_user());
          process.exit(0);
        } else if (action === 'rename') {
          const suggestedNameInfo: AvailableFileNameInfo = await findAvailableFileName(
            targetDir,
            baseSlugForFile,
            fileExtension
          );
          let userConfirmedNewName = false;
          while (!userConfirmedNewName) {
            try {
              const newNameInput = await input({
                message: L[currentLocale].cli.prompt.enter_new_name(),
                default: suggestedNameInfo.fileName,
              });

              if (!newNameInput || newNameInput.trim() === '') {
                console.error(L[currentLocale].cli.error.empty_filename());
                continue;
              }

              let potentialNewFileName = newNameInput.trim();
              if (!potentialNewFileName.endsWith(fileExtension)) {
                potentialNewFileName += fileExtension;
              }

              const potentialNewFilePath = path.join(targetDir, potentialNewFileName);

              if (potentialNewFilePath === filePath) {
                console.error(
                  L[currentLocale].cli.error.rename_to_original_conflict({
                    fileName: potentialNewFileName,
                  })
                );
                continue;
              }

              try {
                await fs.access(potentialNewFilePath);
                console.error(
                  L[currentLocale].cli.error.file_exists({
                    filePath: potentialNewFileName,
                  })
                );
              } catch {
                finalFilePath = potentialNewFilePath;
                slug = slug + `${suggestedNameInfo.counter}`;
                userConfirmedNewName = true;
              }
            } catch (error) {
              if (error instanceof ExitPromptError) {
                console.log(L[currentLocale].cli.info.cancelled_by_user());
                process.exit(0);
              }
              throw error; // Re-throw other errors
            }
          }
        } else if (action === 'overwrite') {
          // finalFilePath, finalFileName, and finalNameWithoutExt remain as initially calculated
          console.log(L[currentLocale].cli.new.info.overwrite({ filePath }));
        }
      }

      const scaffoldPath = path.resolve(process.cwd(), 'scaffolds/draft.md');
      let content = await fs.readFile(scaffoldPath, 'utf-8');

      const frontmatterChanges: Record<string, unknown> = {
        title: title.replaceAll(/"/g, '\\"'),
        slug: slug,
      };

      if (category && category.trim() !== '') {
        frontmatterChanges.category = category.trim();
      } else {
        frontmatterChanges.category = '';
      }

      if (tags && tags.trim() !== '') {
        const tagsArray = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        if (tagsArray.length > 0) {
          frontmatterChanges.tags = tagsArray;
        } else {
          frontmatterChanges.tags = [];
        }
      } else {
        frontmatterChanges.tags = [];
      }

      content = changeFrontmatter(content, frontmatterChanges);

      await fs.writeFile(finalFilePath, content);
      console.log(L[currentLocale].cli.new.info.success_created({ filePath: finalFilePath }));
    } catch (error) {
      console.error(
        L[currentLocale].cli.error.create_file({ message: (error as Error).message })
      );
      process.exit(1);
    }
  });

async function main() {
  try {
    await program.parseAsync(process.argv);
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
