import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  createMenu: {
    singleEvent: m('Create single event'),
  },
  moreEvents: m<{ numEvents: number }>(
    '{numEvents, plural, one {# more event} other {# more events}}'
  ),
  next: m('NEXT'),
  prev: m('PREV'),
  rangeLabel: m('Pick an option'),
  ranges: {
    month: m('Month'),
    week: m('Week'),
  },
});
