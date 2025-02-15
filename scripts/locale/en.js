export default {
  fileExist: 'File {path} already exists',
  chooseAction: 'Please choose an action:',
  actions: {
    useNewName: 'Use a new file name',
    overwrite: 'Overwrite existing file',
    exit: 'Exit program',
  },
  draftsTitle: 'Draft List (Page {current}/{total}):',
  paginationTip:
    'Enter n(next) or p(previous) to navigate pages, or enter a number to select draft',
  noDrafts: 'No drafts found',
  selectDraft: 'Please select a draft number to publish: ',
  readDraftsError: 'Error reading draft files:',
  publishSuccess: 'Published to: {path}',
  publishError: 'Error publishing {path}:',
  invalidSelection: 'Invalid selection, please enter a valid number',
  inputOption: 'Enter option ({countStart}-{countEnd}): ',
  invalidOption: 'Invalid option, exiting program',
  timezoneError: 'Timezone format error:',
  created: {
    post: 'Created article: {path}',
    draft: 'Created draft: {path}',
  },
  cli: {
    description: 'Create a new article or draft',
    typeArg: 'Creation type (post or draft)',
    titleArg: 'Article title',
    dirOption: 'Create article in directory format',
    timezoneOption: 'Specify timezone',
    helpOption: 'Display help information',
    showHelp: '(use --help for more information)',
    examples: `
Examples:
  $ new post "My First Post" -t "+08:00"       Create a new article using UTC+8 timezone
  $ new draft "Draft Post" -d -t "asia/tokyo"  Create a draft using directory format and Tokyo timezone
  $ new post "Second Post"                     Create an article using local timezone`,
    error: 'Error:',
    typeError: 'Error: type must be post or draft',
    timezoneWarning: 'Warning: timezone parameter is ignored in draft mode',
    pubDescription: 'Publish draft to article',
  },
};
