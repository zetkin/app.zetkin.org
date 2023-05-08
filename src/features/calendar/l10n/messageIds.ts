import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  eventFilter: {
    collapse: m('Collapse'),
    expand: m<{ numOfOptions: number }>(
      '{numOfOptions, plural, one {+ 1 more project activity types} other {+ # more project activity types}}'
    ),
    filter: m('Filter'),
    filterOptions: {
      actionFilters: {
        missing: m('Contact person missing'),
        overbooked: m('Overbooked'),
        pending: m('Signups pending'),
        title: m('Filter on action needed'),
        underbooked: m('Underbooked'),
        unsent: m('Unsent notifications'),
      },
      eventTypes: {
        title: m('Filter on event types'),
      },
      stateFilters: {
        cancelled: m('Cancelled'),
        draft: m('Draft'),
        published: m('Published'),
        scheduled: m('Scheduled'),
        title: m('Filter on publish state'),
      },
    },
    reset: m('Reset Filters'),
    toggle: {
      all: m('All'),
      none: m('None'),
    },
    type: m('Type to filter content'),
  },
  moreEvents: m<{ numEvents: number }>(
    '{numEvents, plural, one {# more event} other {# more events}}'
  ),
  next: m('NEXT'),
  prev: m('PREV'),
  rangeLabel: m('Pick an option'),
  ranges: {
    day: m('Day'),
    month: m('Month'),
    week: m('Week'),
  },
  today: m('Today'),
});
