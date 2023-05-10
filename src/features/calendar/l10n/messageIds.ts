import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  event: {
    differentLocations: m<{ numLocations: number }>(
      '{numLocations} different locations'
    ),
    events: m('Events'),
    noContactSelected: m('No contact selected'),
    remindersNotSent: m<{ numNotSent: number }>(
      '{numNotSent} Reminders not sent'
    ),
    unbookedSignups: m<{ numUnbooked: number }>(
      '{numUnbooked} Unbooked signups'
    ),
    underbooked: m<{ numUnderbooked: number }>(
      '{numUnderbooked} Underbooked events'
    ),
    withSignups: m<{ numWithSignups: number }>('{numWithSignups} With signups'),
    withoutContact: m<{ numWithoutContact: number }>(
      '{numWithoutContact} Without contact'
    ),
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
