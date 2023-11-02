import { ReactElement } from 'react';
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
  validate: m('Validate'),
  validation: {
    alerts: {
      back: m('Go back'),
      checkbox: m('I understand'),
      error: {
        desc: m(
          'No people have been imported. You can go back and check the import settings or choose a new file to import. There were errors in the form you submitted. Please try again and make sure you fill in all the required information.'
        ),
        title: m('Something went wrong, and the import was interrupted.'),
      },
      info: {
        desc: m('Data for the uploaded file looks ready'),
        title: m('Ready for import'),
      },
      warning: {
        unselectedId: {
          desc: m(
            'This may result in difficulty in updating people in Zetkin. This is not recommended.'
          ),
          title: m('You have not chosen an ID column'),
        },
      },
    },
    messages: m('Messages'),
    pendingChanges: m('Pending changes'),
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
