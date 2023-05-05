import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  eventFilter: {
    filter: m('Filter'),
    reset: m('Reset Filters'),
    type: m('Type to filter content'),

    toggle: {
      all: m('All'),
      none: m('None'),
    },
    filterOptions: {
      actionFilters: {
        missing: m('Contact person missing'),
        overbooked: m('Overbooked'),
        pending: m('Signups pending'),
        title: m('Filter on action needed'),
        underbooked: m('Underbooked'),
        unsent: m('Unsent notifications'),
      },
      stateFilters: {
        cancelled: m('Cancelled'),
        draft: m('Draft'),
        published: m('Published'),
        scheduled: m('Scheduled'),
        title: m('Filter on publish State'),
      },
    },
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
