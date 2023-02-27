import { m, makeMessages } from 'core/i18n';

export default makeMessages('core', {
  err404: {
    backToHomePage: m('Back to home page'),
    pageNotFound: m('Page not found'),
  },
  home: {
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
