import type { BaseTranslation } from '../../i18n-types.js';

const en_cli = {
  new: {
    prompt: {
      title: 'Enter the title of the new article:',
      category: 'Enter the category for the article (optional):',
      tags: 'Enter tags for the article, comma-separated (optional):',
    },
    action: {
      exit: 'Exit without creating draft',
    },
    info: {
      success_created: 'Successfully created article: {filePath:string}',
      overwrite: 'Overwriting existing file: {filePath:string}',
    },
    error: {
      no_title: 'Article title cannot be empty.',
    },
  },
  pub: {
    prompt: {
      select: 'Select the draft to publish:',
    },
    action: {
      exit: 'Exit without publishing',
    },
    info: {
      no_drafts_found: 'No drafts found to publish.',
      success_article_published:
        "Successfully published '{source:string}' to '{destination:string}'.",
      info_empty_dir_removed: 'Cleaned up empty source directory: {dirPath:string}',
      publish_cancelled: 'Publish operation cancelled.',
    },
    error: {
      publish_article: 'Error publishing article: {message:string}',
    },
  },
  prompt: {
    file_exists: 'File {filePath:string} already exists. Choose an action:',
    enter_new_name: 'Enter a new name for the file (without extension):',
  },
  action: {
    rename: 'Rename the file',
    overwrite: 'Overwrite the existing file',
  },
  info: {
    cancelled_by_user: 'Operation cancelled by user.',
    provide_root_dir_guidance:
      'Try running the command with the {option:string} option to specify the root directory.',
  },
  error: {
    unexpected: 'An unexpected error occurred: {message:string}',
    generic: 'An error occurred: {message:string}',
    file_exists: 'File already exists: {filePath:string}',
    create_file: 'Error creating file: {message:string}',
    empty_filename: 'File name cannot be empty.',
    rename_to_original_conflict: 'Cannot rename to original file name: {fileName:string}',
    failed_to_find_root: 'Failed to determine project root: {message:string}',
  },
} satisfies BaseTranslation;

export default en_cli;
