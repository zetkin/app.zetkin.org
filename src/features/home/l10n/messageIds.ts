import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.home', {
  activityList: {
    actions: {
      areaAssignment: m('Join'),
      call: m('Start calling'),
      connectAndSignUp: m('Connect & sign up'),
      details: m('Read more'),
      loginToSignUp: m('Log in to sign up'),
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
    accountSettings: {
      email: {
        addInstructions: m(
          'Add an email address to your account to be able to log in using a password.'
        ),
        changeInstructions: m(
          'If you need to change your email address, you must reach out to info@zetkin.org.'
        ),
        errorText: m(
          'An error ocurred. Try again or contact Zetkin Foundation for support.'
        ),
        label: m('E-mail address'),
        saveButton: m('Save'),
      },
      header: m('Account settings'),
    },
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
    feed: m('Events'),
    home: m('My activities'),
    organizations: m('Organizations'),
    settings: m('Settings'),
  },
  title: m('My Zetkin'),
});
