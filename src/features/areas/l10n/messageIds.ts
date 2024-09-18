import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areas', {
  addNewPlaceButton: m('Add new place'),
  canvassAssignment: {
    addAssignee: m('Add assignee'),
    assigneesTitle: m('Assignees'),
    empty: {
      title: m('Untitled canvass assignment'),
    },
    tabs: {
      overview: m('Overview'),
    },
  },
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
    empty: {
      description: m('Empty description'),
      title: m('Untitled place'),
    },
    logActivityButton: m('Log activity'),
    logActivityHeader: m<{ title: string }>('Log activity at {title}'),
    noActivity: m('No visits have been recorded at this place.'),
    saveButton: m('Save'),
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
