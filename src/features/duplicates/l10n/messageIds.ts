import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.duplicates', {
  page: {
    duplicatesExist: m('There are duplicates'),
    duplicatesExistDescription: m('These people look very similar'),
    noDuplicates: m('No duplicates'),
    noDuplicatesDescription: m(
      'Yay! all your members seem to be unique individuals.'
    ),
  },
});
