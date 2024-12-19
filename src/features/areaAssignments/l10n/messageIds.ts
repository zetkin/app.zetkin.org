import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areaAssignments', {
  default: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  layout: {
    actions: {
      delete: m('Delete'),
      deleteWarningText: m<{ title: string }>(
        'Are you sure you want to delete {title}?'
      ),
      end: m('End assignment'),
      start: m('Start assignment'),
    },
    basicAssignmentStats: {
      areas: m<{ numAreas: number }>(
        '{numAreas, plural, =0 {No areas} one {1 area} other {# areas}}'
      ),
      assignees: m<{ numAssignees: number }>(
        '{numAssignees, plural, =0 {No assignees} one {1 assignee} other {# assignees}}'
      ),
    },
    tabs: {
      assignees: m('Assignees'),
      map: m('Map'),
      overview: m('Overview'),
      report: m('Report'),
    },
  },
  map: {
    areaInfo: {
      assignees: {
        add: m('Add assignee'),
        none: m('No assignees'),
        title: m('Assignees'),
      },
      stats: {
        households: m('Households'),
        locations: m('Locations'),
        successful: m('Successful visits'),
        visited: m('Visited'),
      },
    },
    findArea: {
      filterPlaceHolder: m('Filter'),
      title: m('Find area'),
    },
  },
  overview: {
    empty: {
      description: m('This assignment has not been planned yet'),
      startPlanningButton: m('Plan now'),
    },
    progress: {
      headers: {
        households: m('Households visited'),
        locations: m('Locations visited'),
        successful: m('Successful visits'),
      },
      statsTitle: m('Progress'),
      unassignedVisits: {
        description: m(
          'This graph shows visits made outside the assigned areas'
        ),
        title: m('Unassigned visits'),
      },
    },
  },
  report: {},
});
