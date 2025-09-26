import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.account', {
  lostPassword: {
    actions: {
      sendEmail: m('Send email'),
      signIn: m('Sign in'),
    },
    description: m(
      'Have you forgotten your password for Zetkin? Give us your e-mail address and we will send out a link where you can pick a new password.'
    ),
    errors: {
      invalidEmail: m('Please enter a valid email address.'),
      invalidEmailTitle: m('Invalid email'),
      noUser: m('No user exists with that e-mail address.'),
      unknownError: m('Something went wrong. Please try again later.'),
      unknownErrorTitle: m('Unexpected error'),
    },
    footer: {
      readPolicy: m('Read our privacy policy'),
    },
    title: m('Recover your Zetkin account'),
  },
});
