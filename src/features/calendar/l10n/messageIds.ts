import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  eventFilter: {
    filter: m('Filter'),
    reset: m('Reset Filters'),
    type: m('Type to filter content'),
    onAction: {
      title: m('Filter on action needed'),
    },
    toggle: {
      all: m('All'),
      none: m('None'),
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
