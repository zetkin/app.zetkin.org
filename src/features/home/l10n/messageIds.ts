import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.home', {
  activityList: {
    actions: {
      call: m('Start calling'),
      canvass: m('Start canvassing'),
      signUp: m('Sign up'),
      undoSignup: m('Undo signup'),
    },
    emptyListMessage: m('You are not signed up for any acitvities'),
    eventStatus: {
      booked: m<{ org: string }>(
        'You have been booked for this event and organizers are expecting you. Contact {org} if you need to cancel.'
      ),
      needed: m('You are needed'),
      signedUp: m('You have signed up'),
    },
    filters: {
      call: m('Call'),
      canvass: m('Canvass'),
      event: m('Events'),
    },
  },
  allEventsList: {
    emptyList: {
      message: m('Could not find any events'),
      removeFiltersButton: m('Clear filters'),
    },
    filterButtonLabels: {
      organizations: m<{ numOrgs: number }>(
        '{numOrgs, plural,=0 {Organizations} =1 {1 organization} other {# organizations}}'
      ),
      thisWeek: m('This week'),
      today: m('Today'),
      tomorrow: m('Tomorrow'),
    },
  },
  defaultTitles: {
    callAssignment: m('Untitled call assignment'),
    canvassAssignment: m('Untitled canvass assignment'),
    event: m('Untitled event'),
    noLocation: m('No physical location'),
  },
  footer: {
    privacyPolicy: m('Privacy policy'),
  },
  tabs: {
    feed: m('All events'),
    home: m('My activities'),
  },
  title: m('My Zetkin'),
});
