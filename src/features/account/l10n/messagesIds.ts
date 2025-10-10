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
  register: {
    actions: {
      createAccount: m('Create account'),
    },
    description: m('Start organizing with Zetkin right away'),
    error: {
      conflictError: m(
        'An account with this email or phone number already exists.'
      ),
      invalidParameter: m(
        'Some details seem incorrect. Please review and try again.'
      ),
      phoneError: m('Please enter a valid phone number.'),
      unkownError: m('Registration failed. Try again later.'),
    },
    instructions: m('A message with instructions has been sent to '),
    labels: {
      checkBox: m(
        'I approve that my information is processed in order to maintain a user account for Zetkin'
      ),
      email: m('Email address'),
      firstName: m('First name'),
      lastName: m('Last name'),
      mobile: m('Mobile phone number'),
      password: m('Password'),
    },
    title: m('Create new account'),
    welcome: m<{ userName: string }>('Welcome, {userName}'),
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
  verify: {
    description: m(
      'Before you can continue using Zetkin you have to verify your email address. We have sent a message to your email containing a verification link. Click the link to verify your email address. Be sure to check your spam folder if you cannot find the email, or re-send it using the button below.'
    ),
    sendVerification: m('Send a new verification'),
    title: m('Verify your email address'),
  },
});
