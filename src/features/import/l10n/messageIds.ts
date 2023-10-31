import { ReactElement } from 'react';
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
  validation: {
    alerts: {
      back: m('Go back'),
      checkbox: m('I understand'),
    },
    title: m('Pending changes'),
    trackers: {
      created: m('new people will be created'),
      defaultDesc: m('people will recieve changes to their'),
      orgs: m('people will be added to an'),
      tags: m<{ count: ReactElement; fieldName: ReactElement }>(
        '{count} people will have {fieldName} added'
      ),
      updated: m('people will be updated'),
    },
  },
});
