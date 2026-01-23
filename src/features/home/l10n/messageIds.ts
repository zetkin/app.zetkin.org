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
    emptyListMessage: m('You are not signed up for any activities'),
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
  newLandingPageAlert: {
    description: m(
      'If you are looking for the organizer pages, you can find them from now on by clicking the button in the header below.'
    ),
    title: m('This is your new landing page'),
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
    feed: m('All events'),
    home: m('My activities'),
    myOrganisations: m('My organizations'),
    settings: m('Settings'),
  },
  myOrganisations: {
    emptyState: m(
      'You are not a member of any organizations yet. Join an organization to see it here.'
    ),
    drawer: {
      title: m('Notification settings'),
      subtitle: m<{ orgName: string }>('Settings for {orgName}'),
    },
    notifications: {
      follow: {
        label: m('Following'),
        description: m('Show activities from this organization in your feed'),
      },
      email: {
        label: m('Email notifications'),
        description: m('Coming soon'),
      },
      calls: {
        label: m('Call notifications'),
        description: m('Coming soon'),
      },
    },
    role: m<{ role: string }>('Role: {role}'),
    viewOrganisation: m('View organization'),
    settingsUpdated: m('Settings updated'),
    settingsError: m('Failed to update settings'),
  },
  title: m('My Zetkin'),
});
