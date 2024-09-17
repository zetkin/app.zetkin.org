import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areas', {
  addNewPlaceButton: m('Add new place'),
  empty: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  overlay: {
    buttons: {
      cancel: m('Cancel'),
      delete: m('Delete'),
      edit: m('Edit'),
      save: m('Save'),
    },
  },
  place: {
    activityHeader: m('Activity'),
    cancelButton: m('Cancel'),
    closeButton: m('Close'),
    description: m('Description'),
    editButton: m('Edit'),
    editDescription: m('Place description'),
    editPlace: m('Edit place'),
    editTitle: m('Place title'),
    empty: {
      description: m('Empty description'),
      title: m('Untitled place'),
    },
    logActivityButton: m('Log activity'),
    logActivityHeader: m<{ title: string }>('Log activity at {title}'),
    noActivity: m('No visits have been recorded at this place.'),
    saveButton: m('Save'),
    selectType: m('Place type'),
  },
  placeCard: {
    address: m('Address'),
    cancel: m('Cancel'),
    createPlace: m('Create place'),
    inputLabel: m('Type of place'),
    misc: m('Misc'),
    placeholderAddress: m('Enter address here'),
    placeholderTitle: m('Enter title here'),
  },
  tools: {
    cancel: m('Cancel'),
    draw: m('Draw'),
    save: m('Save'),
  },
  viewPlaceButton: m('View place'),
});
