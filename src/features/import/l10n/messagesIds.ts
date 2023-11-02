import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  importDialog: {
    dialogButtons: {
      configure: m('Configure'),
      restart: m('Restart'),
    },
    instructions: m('Click to upload'),
    instructionsEnd: m(' or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    types: m('CSV, XLS or XLSX'),
    unsupportedFile: m('Unsupported file.'),
  },
});
