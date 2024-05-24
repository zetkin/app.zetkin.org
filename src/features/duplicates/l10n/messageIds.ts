import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.duplicates', {
  page: {
    noDuplicates: m('No duplicates'),
    noDuplicatesDescription: m(
      'Yay! all your members seem to be unique individuals.'
    ),
    possibleDuplicates: m('Possible duplicates'),
    possibleDuplicatesDescription: m<{ numPeople: number }>(
      'These {numPeople} people look very similar'
    ),
  },
});
