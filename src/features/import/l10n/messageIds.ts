import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  configuration: {
    title: m('Import people'),
  },
  restart: m('Restart'),
  steps: {
    configure: m('Configure'),
    import: m('Import'),
    upload: m('Upload'),
    validate: m('Validate'),
  },
});
