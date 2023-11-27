import { ReactElement } from 'react';
import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.import', {
  back: m('Back'),
  close: m('Close'),
  configuration: {
    title: m('Import people'),
  },
  done: m('Done'),
  import: m('Import'),
  importStatus: {
    completed: {
      desc: m('Your data has been imported to Zetkin'),
      title: m('Import completed'),
    },
    completedChanges: m('Completed changes'),
    error: {
      desc: m('No data was imported to Zetkin'),
      title: m('Import failed'),
    },
    scheduled: {
      desc: m(
        'You can safely close this dialog and we will send you an email when the import is done.'
      ),
      title: m(
        'This is a big import that will take a while to get into Zetkin!'
      ),
    },
  },
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
    instructions: m<{ link: ReactElement }>('{link} or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    selectClick: m('Click to upload'),
    types: m('CSV, XLS or XLSX'),
    unsupportedFile: m('Unsupported file.'),
  },
  validate: m('Validate'),
  validation: {
    alerts: {
      back: m('Go back'),
      checkbox: m('I understand'),
      error: {
        desc: m(
          'Nothing will be imported. Please go back and check that the configurations you made are correct or select a new file to upload.'
        ),
        title: m('Something went wrong and the import was interrupted.'),
      },
      info: {
        desc: m('The data you want to upload looks good!'),
        title: m('Ready for import'),
      },
      warning: {
        manyChanges: {
          desc: m(
            'Sometimes this is a result of a misconfiguration of the import.'
          ),
          title: m<{ fieldName: string }>(
            "This import will change a lot of people's {fieldName}"
          ),
        },
        unselectedId: {
          desc: m(
            'This can make updating people in Zetkin difficult and is not recommended.'
          ),
          title: m('You have not chosen an ID column'),
        },
      },
    },
    messages: m('Messages'),
    pendingChanges: m('Pending changes'),
    updateOverview: {
      created: m<{ numPeople: number; number: ReactElement }>(
        '{number} new {numPeople, plural, =1 {person} other {people}} will be created'
      ),
      defaultDesc: m<{ field: ReactElement; numPeople: ReactElement }>(
        '{numPeople} will recieve changes to their {field}'
      ),
      organization: m('Organization'),
      orgs: m<{ numPeople: ReactElement; org: ReactElement }>(
        '{numPeople} will be added to an {org}'
      ),
      people: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}}'
      ),
      tags: m('Tags'),
      tagsDesc: m<{ numPeople: ReactElement; tags: ReactElement }>(
        '{numPeople} will have {tags} added'
      ),
      updated: m<{ numPeople: number; number: ReactElement }>(
        '{number} {numPeople, plural, =1 {person} other {people}} will be updated'
      ),
    },
  },
});
