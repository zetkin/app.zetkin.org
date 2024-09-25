import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areas', {
  addNewPlaceButton: m('Add new place'),
  canvassAssignment: {
    addAssignee: m('Add assignee'),
    assigneesTitle: m('Assignees'),
    canvassers: {
      areasColumn: m('Areas'),
      nameColumn: m('Name'),
    },
    canvassing: {
      goToMapButton: m('Go to map'),
      title: m('Canvassing'),
    },
    empty: {
      title: m('Untitled canvass assignment'),
    },
    overview: {
      areas: {
        defineButton: m('Plan now'),
        editButton: m('Edit plan'),
        subtitle: m('This assignment has not been planned yet.'),
        title: m('Areas'),
      },
    },
    planFilters: {
      assigned: m('Assigned'),
      unassigned: m('Unassigned'),
    },
    tabs: {
      canvassers: m('Canvassers'),
      overview: m('Overview'),
      plan: m('Plan'),
    },
  },
  empty: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  filters: {
    filterButton: m('Add filter'),
    tagGroup: m<{ label: string }>('{label} (tag group)'),
    tagsWithoutGroup: m('Tags without group'),
  },
  overlay: {
    buttons: {
      cancel: m('Cancel'),
      delete: m('Delete'),
      edit: m('Edit'),
      save: m('Save'),
    },
    tags: {
      header: m('Tags'),
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
  planOverlay: {
    addAssignee: m('Add assignee'),
    assignees: m('Assignees'),
    noAssignees: m('No assignees'),
  },
  tools: {
    cancel: m('Cancel'),
    draw: m('Draw'),
    save: m('Save'),
  },
  viewPlaceButton: m('View place'),
});
