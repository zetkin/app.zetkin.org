import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.areas', {
  areas: {
    areaSettings: {
      delete: m('Delete'),
      edit: {
        cancelButton: m('Cancel'),
        editButton: m('Edit'),
        saveButton: m('Save'),
      },
      tags: {
        title: m('Area tags'),
      },
    },
    controlLabels: {
      filters: m('Filters'),
      layers: m('Data visualization'),
      select: m('Select'),
    },
    default: {
      description: m('Empty description'),
      title: m('Untitled area'),
    },
    draw: {
      cancelButton: m('Cancel'),
      saveButton: m('Save'),
      startButton: m('Draw'),
    },
    filter: {
      addFilterButton: m('Add filter'),
      openFiltersButton: m('Filter'),
      ungroupedTagsLabel: m('Ungrouped tags'),
    },
  },
  page: {
    title: m('Geography'),
  },
});
