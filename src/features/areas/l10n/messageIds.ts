import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.areas', {
  areas: {
    areaDetails: {
      households: m('Households'),
      locations: m('Locations'),
      title: m('Area details'),
    },
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
    assignmentStats: {
      percentSuccessfulHouseholdVisits: m(
        'of household visits were successful'
      ),
      percentVisited: m('of locations visited'),
      successfulVisits: m('successful visits'),
      title: m('Visits'),
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
