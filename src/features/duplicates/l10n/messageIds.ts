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
    infoMessage: m(
      'All activity history and tags from all people being merged will carry over and will be visible on the merged person.'
    ),
    infoTitle: m('No data will be lost'),
    isDuplicateButton: m('Include'),
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
