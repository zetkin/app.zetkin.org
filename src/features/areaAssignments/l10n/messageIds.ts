import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areaAssignments', {
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
  default: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  tabs: {
    assignees: m('Assignees'),
    map: m('Map'),
    overview: m('Overview'),
    report: m('Report'),
  },
});
