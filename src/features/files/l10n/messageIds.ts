import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.files', {
  fileUpload: {
    dropToUpload: m('Drop file here to upload it'),
    instructions: m(' or drag and drop'),
    selectClick: m('Click to upload'),
  },
  image: {
    dimensions: m<{ height: number; width: number }>(
      '{width} × {height} pixels'
    ),
  },
  libraryDialog: {
    preview: {
      backButton: m('Back to library'),
      cropLandscape: m('Landscape crop'),
      cropSquare: m('Square crop'),
      cropWarning: m(
        'In some cases Zetkin will crop your image in roughly these ratios when displaying it.'
      ),
      cropWide: m('Wide crop'),
      previewsSection: m('Previews'),
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
