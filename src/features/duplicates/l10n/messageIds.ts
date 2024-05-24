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
      noData: m('No data'),
    },
    mergeButton: m('Merge'),
    title: m('Merge duplicates'),
  },
  page: {
    noDuplicates: m('No duplicates'),
    noDuplicatesDescription: m(
      'Yay! all your members seem to be unique individuals.'
    ),
  },
});
