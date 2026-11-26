import { ReactElement } from 'react';

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
  ics: {
    joinEvent: m<{ eventLink: ReactElement }>('Join event here: {eventLink}'),
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
  subscriptionTokenRequest: {
    emailInputLabel: m('Email'),
    emailValidationError: m('Email is invalid'),
    error: {
      description: m(
        'Something went wrong when requesting an email, please try again!'
      ),
      title: m('Error'),
    },
    submitButton: {
      requestLink: m('Request link'),
      wasRequested: m('Link requested'),
    },
    subtitle: m(
      'Enter your email address to get a link to manage your subscriptions.'
    ),
    success: {
      description: m<{ email: string }>(
        'If {email} exists, you will recieve a link to manage your subscription. Please allow a few minutes to recieve the link before trying again'
      ),
      retryButton: m('Try again'),
      title: m('Submitted!'),
    },
    title: m('Email settings'),
  },
  tabs: {
    feed: m('All events'),
    home: m('My activities'),
    settings: m('Settings'),
  },
  title: m('My Zetkin'),
});
