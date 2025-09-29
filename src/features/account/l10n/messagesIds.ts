import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.account', {
  lostPassword: {
    actions: {
      sendEmail: m('Send email'),
      sendLink: m('Send link again'),
      signIn: m('Sign in'),
    },
    checkEmail: m('Check your email'),
    description: m(
      'Have you forgotten your password for Zetkin? Give us your e-mail address and we will send out a link where you can pick a new password.'
    ),
    descriptionCheck: m<{ email: string }>(
      'A message with instructions has been sent to {email}'
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
