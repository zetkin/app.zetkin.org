import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.manage', {
  dialog: {
    cancel: m('Cancel'),
    save: m('Save'),
  },
  manageSidebar: {
    items: {
      users: m('Users'),
    },
  },
  noAccess: {
    backHomeCta: m('Back to home'),
    title: m("You don't have access to this page"),
  },
  users: {
    columns: {
      email: m('Email'),
      name: m('Name'),
    },
    details: {
      autoLanguage: m('Automatic (configured in  browser)'),
      checkboxes: {
        email_is_verified: m('Email verified'),
        is_verified: m('Verified'),
        phone_is_verified: m('Phone verified'),
      },
      edit: {
        button: m('Edit details'),
        title: m('Edit details'),
        updateError: m('Failed to update details!'),
        updateSuccess: m('Updated details!'),
      },
      fields: {
        email: m('Email'),
        first_name: m('First name'),
        lang: m('Language'),
        last_name: m('Last name'),
        phone: m('Phone'),
        username: m('Username'),
      },
      title: m('Details'),
    },
    errorLoadingPage: m('Error loading page. Please try again.'),
    manage: m('Manage'),
    orgs: {
      add: {
        button: m('Connect'),
      },
    },
    verifyEmail: {
      actionButton: m('Send email verification'),
      alsoResetEmailVerification: m('Reset "email verified"'),
      failed: m('Failed to send verification code.'),
      modalTitle: m('Send email verification'),
      sendSuccess: m('Verification code has been sent.'),
    },
  },
});
