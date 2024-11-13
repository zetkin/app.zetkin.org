import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.duplicates', {
  modal: {
    cancelButton: m('Cancel'),
    fieldSettings: {
      data: m('Data'),
      field: m('Field'),
      gender: {
        f: m('Female'),
        m: m('Male'),
        o: m('Other'),
      },
      noValue: m('No value'),
      title: m('Data to merge'),
    },
    findCandidateManually: m('Type to find a potential duplicate'),
    isDuplicateButton: m('Include'),
    lists: {
      hideManual: m('Hide manual search'),
      showManual: m('Show manual search'),
    },
    mergeButton: m('Merge'),
    notDuplicateButton: m('Exclude'),
    peopleNotBeingMerged: m('People not being merged'),
    peopleToMerge: m('People to merge'),
    possibleDuplicatesColumns: {
      email: m('E-mail'),
      name: m('Name'),
      phone: m('Phone'),
    },
    title: m('Merge duplicates'),
    warningMessage: m(
      'All data related to any of the person records will transfer to the merged person. This includes event participation, survey submissions, tags etc. But the values you discard in the fields above will be lost.'
    ),
    warningTitle: m('Risk of data loss'),
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
