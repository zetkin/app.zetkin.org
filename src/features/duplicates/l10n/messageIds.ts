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
    isDuplicateButton: m('Add to merge'),
    mergeButton: m('Merge'),
    notDuplicateButton: m('Remove from merge'),
    peopleNotBeingMerged: m('People not being merged'),
    peopleToMerge: m('People to merge'),
    possibleDuplicatesColumns: {
      email: m('E-mail'),
      name: m('Name'),
      phone: m('Phone'),
    },
    title: m('Merge duplicates'),
  },
  page: {
    dismiss: m('Dismiss'),
    noDuplicates: m('No duplicates'),
    noDuplicatesDescription: m(
      'Yay! all your members seem to be unique individuals.'
    ),
    possibleDuplicates: m('Possible duplicates'),
    possibleDuplicatesDescription: m<{ numPeople: number }>(
      'These {numPeople} people look very similar'
    ),
    resolve: m('Resolve'),
  },
});
