import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
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
    dialogButtons: {
      configure: m('Configure'),
      restart: m('Restart'),
    },
    instructions: m<{ link: ReactJSXElement }>('{link} or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    selectClick: m('Click to upload'),
    types: m('CSV, XLS or XLSX'),
    unsupportedFile: m('Unsupported file.'),
  },
  validate: m('Validate'),
});
