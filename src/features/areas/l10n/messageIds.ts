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
    stats: {
      households: m<{ numHouseholds: number }>(
        '{numHouseholds, plural, one {Household in selected area} other {Households in selected area}}'
      ),
      locations: m<{ numLocations: number }>(
        '{numLocations, plural, one {Location in selected area} other {Locations in selected area}}'
      ),
    },
  },
  page: {
    title: m('Geography'),
  },
});
