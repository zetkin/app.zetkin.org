import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  back: m('Back'),
  configuration: {
    title: m('Import people'),
  },
  done: m('Done'),
  import: m('Import'),
  restart: m('Restart'),
  steps: {
    configure: m('Configure'),
    import: m('Import'),
    upload: m('Upload'),
    validate: m('Validate'),
  },
  uploadDialog: {
    dataDetected: m('Identical data detected'),
    dialogButtons: {
      configure: m('Configure'),
      restart: m('Restart'),
    },
    infoDetected: m('This file was used in an import done 5 days ago'),
    instructions: m('Click to upload'),
    instructionsEnd: m(' or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    types: m('CSV, XLS or XLSX'),
    unsupportedFile: m('Unsupported file.'),
  },
  validate: m('Validate'),
});
