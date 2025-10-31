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
    descriptionCheck: m(
      'If an account exists with this email address, you will receive reset instructions at '
    ),
    emailFieldLabel: m('Email'),
    errors: {
      invalidEmail: m('Please enter a valid email address.'),
      unknownError: m('Something went wrong. Please try again later.'),
      unknownErrorTitle: m('Unexpected error'),
    },
    footer: {
      readPolicy: m('Read our privacy policy'),
    },
    title: m('Recover your Zetkin account'),
  },
  resetPassword: {
    actions: {
      labelPassword: m('Password'),
      save: m('Save password'),
    },
    description: m('Set a new password that you wish to use going forward.'),
    descriptionUpdated: m(
      'Your password was updated. You can sign in using your new password.'
    ),
    title: m('Reset password'),
    validation: m('Password must be at least 6 characters long.'),
  },
});
