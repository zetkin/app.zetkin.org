import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.organizations', {
  allEventsList: {
    emptyList: {
      message: m('Could not find any events'),
      removeFiltersButton: m('Clear filters'),
    },
    filterButtonLabels: {
      locations: m<{ count: number }>('{count} locations'),
      organizations: m<{ numOrgs: number }>(
        '{numOrgs, plural,=0 {Organizations} =1 {1 organization} other {# organizations}}'
      ),
      thisWeek: m('This week'),
      today: m('Today'),
      tomorrow: m('Tomorrow'),
    },
  },
  authDialog: {
    cancelButton: m('Cancel'),
    content: m('You need a Zetkin account to sign up for events.'),
    label: m('Sign up'),
    loginButton: m('Log in & come back'),
  },
  eventPage: {
    cancelSignup: m('Cancel signup'),
    cancelledHeader: m('This event has been cancelled'),
    cancelledParagraph: m(
      'You can no longer sign up for it and if you were signed up, you are no longer expected to attend.'
    ),
    contactPerson: {
      default: m<{ name: string }>('{name} is the contact person'),
      you: m('You are the contact person'),
    },
    defaultTitle: m('Untitled event'),
    haveAccount: m('I have an account'),
    loading: m('Loading...'),
    noDescription: m('This event has no description'),
    noLocation: m('No physical location'),
    partOfProject: m<{ projectLink: ReactElement }>('Part of {projectLink}'),
    participatingInfo: m<{ participatingCount: number }>(
      '{participatingCount, plural, =1 {# person is} other {# persons are}} participating'
    ),
    today: m('Today'),
  },
  gen3: {
    description: m(
      'This is the new (generation 3) organizer web app. If you are used to the old one, you will find lots of new features and an improved user interface here. But if you want, you can still use the old organizer app for a while longer.'
    ),
    gen2Button: m('Go to the old interface'),
    title: m('Welcome to the new Zetkin!'),
  },
  home: {
    footer: {
      privacyPolicy: m('Privacy policy'),
    },
    header: {
      calendarLinkCopied: m('Successfully copied calendar link'),
      connect: m('Connect'),
      copyIcsUrl: m('Copy calendar subscription URL'),
      follow: m('Follow'),
      login: m('Login & connect'),
      organize: m('Organize'),
      unfollow: m('Unfollow'),
    },
    map: {
      viewInList: m('View in list'),
      viewInMap: m('View in map'),
    },
    menu: {
      allEvents: m('All events'),
      logout: m('Logout'),
      myActivities: m('My activities'),
      myZetkin: m('My Zetkin'),
      settings: m('Settings'),
    },
    tabs: {
      calendar: m('Calendar'),
      suborgs: m('Explore'),
    },
  },
  noEventsBlurb: {
    description: m<{ org: string }>('{org} has no upcoming events.'),
    headline: m('There are no upcoming events'),
  },
  notOrganizer: {
    description: m(
      'This part of Zetkin is only available to users who have been granted organizer access by another organization official. You do not currently have the sufficient level of access. If you believe that this is a mistake, please reach out to your local Zetkin officials or to Zetkin Foundation.'
    ),
    myPageButton: m('Go to activist portal'),
    title: m('You do not have organizer access'),
  },
  overview: {
    suborgs: {
      title: m('Sub-organizations'),
    },
  },
  page: {
    title: m('Select organization:'),
  },
  sidebar: {
    allOrganizations: m('All organizations'),
    filter: {
      noResults: m('No organizations matching this filter'),
      topLevel: m('Top level organization'),
    },
    filtered: m('Filtered'),
    recent: {
      clear: m('Clear'),
      title: m('Recent organizations'),
    },
  },
  signupChoiceModal: {
    description: m(
      "Use your Zetkin account to sign up to an event. If you don't have an account, don't worry you can still sign up without one."
    ),
    title: m('How do you want to sign up?'),
    withAccount: m('With an account'),
    withoutAccount: m('Without an account'),
  },
  subOrgEventBlurb: {
    description: m<{
      eventsElem: ReactElement;
      numEvents: number;
      numOrgs: number;
      orgsElem: ReactElement;
    }>(
      'There are {eventsElem} {numEvents, plural, =1 {additional event} other {additional events}} in {orgsElem} {numOrgs, plural, =1 {suborganization} other {suborganizations}}.'
    ),
    headline: m('Dig deeper'),
    showButton: m('Show all events'),
  },
});
