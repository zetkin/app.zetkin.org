import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.files', {
  imageUpload: {
    dialogButtons: {
      configure: m('Configure'),
      restart: m('Restart'),
    },
    instructions: m(' or drag and drop'),
    loading: m('Loading file...'),
    release: m('Release the file here'),
    selectClick: m('Click to upload'),
    types: m('JPG, PNG or GIF'),
    unsupportedFile: m('Unsupported file format.'),
  },
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
  typeFilter: {
    anyOption: m('Any type'),
    label: m('Type'),
    options: {
      image: m('Images'),
    },
  },
});
