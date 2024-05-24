import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.duplicates', {
  modal: {
    cancelButton: m('Cancel'),
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
