import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('core', {
  err404: {
    assignmentNotFound: m('Assignment not found'),
    backToHomePage: m('Back to home page'),
    eventNotFound: m('Event not found'),
    goToMyZetkin: m('Go to My Zetkin'),
    goToOrganization: m('Go to organization'),
    loggedInOrgText: m(
      'Try finding the organization in your list of organizations.'
    ),
    loggedOutOrgText: m(
      'If you are a Zetkin user you can log in and try to find the organization in your list of organizations.'
    ),
    orgNotFound: m('Organization not found'),
    pageNotFound: m('Page not found'),
  },
  home: {
    redirecting: m('Redirecting...'),
    welcome: m('This will become Zetkin'),
  },
  legacy: {
    continueButton: m('Continue to old Zetkin'),
    header: m('You are being redirected'),
    info: m(
      "You are using a prerelease version of Zetkin which doesn't support the feature you want to use. You are being redirected to the older version of Zetkin which supports that feature."
    ),
  },
});
