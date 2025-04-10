import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.home', {
  activityList: {
    actions: {
      areaAssignment: m('Join'),
      call: m('Start calling'),
      connectAndSignUp: m('Connect & sign up'),
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
      canvass: m('Areas'),
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
    areaAssignment: m('Untitled area assignment'),
    callAssignment: m('Untitled call assignment'),
    event: m('Untitled event'),
    noLocation: m('No physical location'),
  },
  footer: {
    privacyPolicy: m('Privacy policy'),
  },
  settings: {
    appPreferences: {
      header: m('App preferences'),
      lang: {
        auto: m('Automatic (configured in  browser)'),
        label: m('Language'),
        saveButton: m('Save & reload'),
      },
    },
  },
  tabs: {
    feed: m('All events'),
    home: m('My activities'),
    settings: m('Settings'),
  },
  title: m('My Zetkin'),
});
