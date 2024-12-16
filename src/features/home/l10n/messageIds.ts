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
    filters: {
      call: m('Call'),
      canvass: m('Canvass'),
      event: m('Events'),
    },
    needed: m('You are needed'),
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
