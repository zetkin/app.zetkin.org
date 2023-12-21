import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.files', {
  libraryDialog: {
    title: m('Library'),
  },
  searching: {
    label: m('Search'),
  },
  sorting: {
    label: m('Sort by'),
    options: {
      date: m('Date'),
      originalName: m('Original filename'),
    },
  },
});
