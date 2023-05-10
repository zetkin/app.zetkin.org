import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  createMenu: {
    singleEvent: m('Create single event'),
  },
  lastDayWithEvents: m<{ numEvents: number }>(
    'There {numEvents, plural, one {was one event} other {were {numEvents} events}} on the last active day'
  ),
  showMore: m('Show'),
});
