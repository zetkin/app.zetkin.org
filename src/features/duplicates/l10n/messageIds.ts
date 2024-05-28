import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.duplicates', {
  modal: {
    cancelButton: m('Cancel'),
    fieldSettings: {
      gender: {
        f: m('Female'),
        m: m('Male'),
        o: m('Other'),
      },
      noValue: m('No value'),
    },
    isDuplicateButton: m('Merge'),
    mergeButton: m('Merge'),
    notDuplicateButton: m('Not Merge'),
    peopleNotBeingMerge: m('People not being merged'),
    peopleToMerge: m('People to merge'),
    possibleDuplicatesColumns: {
      email: m('E-mail'),
      name: m('Name'),
      phone: m('Phone'),
    },
    title: m('Merge duplicates'),
  },
  page: {
    noDuplicates: m('No duplicates'),
    noDuplicatesDescription: m(
      'Yay! all your members seem to be unique individuals.'
    ),
  },
});
