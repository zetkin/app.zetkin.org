import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.files', {
  fileUpload: {
    dropToUpload: m('Drop file here to upload it'),
    instructions: m(' or drag and drop'),
    selectClick: m('Click to upload'),
  },
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
