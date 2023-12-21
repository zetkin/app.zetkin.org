import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.files', {
  libraryDialog: {
    preview: {
      backButton: m('Back to library'),
      useButton: m('Use'),
    },
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
  typeFilter: {
    anyOption: m('Any type'),
    label: m('Type'),
    options: {
      image: m('Images'),
    },
  },
});
