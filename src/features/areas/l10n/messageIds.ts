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
    addFilterButton: m('Add filter'),
    filterButton: m('Filters'),
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
    addHouseholdButton: m('Add household'),
    backButton: m('Back'),
    badRatingLog: m('Bad rating'),
    cancelButton: m('Cancel'),
    closeButton: m('Close'),
    description: m('Description'),
    editButton: m('Edit'),
    editDescription: m('Place description'),
    editPlace: m<{ placeName: string }>('Edit {placeName}'),
    editTitle: m('Place title'),
    empty: {
      description: m('Empty description'),
      title: m('Untitled place'),
    },
    goodRatingLog: m('Good rating'),
    household: {
      empty: {
        title: m('Untitled household'),
      },
    },
    householdsHeader: m<{ numberOfHouseholds: number }>(
      '{numberOfHouseholds, plural, =0 {No households} =1 {Household 1} other {Households #}}'
    ),
    logActivityButton: m('Log activity'),
    logActivityHeader: m<{ title: string }>('Log activity at {title}'),
    logList: m('Log'),
    noActivity: m('No visits have been recorded at this place.'),
    notePlaceholder: m('Note'),
    saveButton: m('Save'),
    selectType: m('Place type'),
    visitButton: m('Log visit'),
    visitLog: m('Visited'),
    visitedButton: m('Visited'),
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
