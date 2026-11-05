import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.manage', {
  dialog: {
    cancel: m('Cancel'),
    save: m('Save'),
    send: m('Send'),
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
      disconnect: {
        actionButton: m('Disconnect from organization'),
        failed: m('Failed to disconnect user.'),
        modalDescription: m(
          'Disconnecting also disconnects the user from all sub-organization.'
        ),
        modalTitle: m('Disconnect from organization'),
        success: m('Successfully disconnected user.'),
      },
      editRole: {
        actionButton: m('Edit role'),
        failed: m('Failed to update user role.'),
        modalDescription: m(
          'Updating a role also updates inherited roles in sub-organizations.'
        ),
        modalTitle: m('Edit role'),
        roleToUpdate: m('Role'),
        success: m('Successfully updated user role.'),
      },
      goToProfile: m('Go to profile'),
      noneConnected: m('User not connected to any organization'),
      roles: {
        admin: m('Admin'),
        inheritedBadge: m<{ role: string }>('{role} (inherited)'),
        noRole: m('No official role'),
        organizer: m('Organizer'),
      },
      title: m('Connected organizations'),
    },
    passwordReset: {
      actionButton: m('Send password reset'),
      failed: m('Failed to send password reset.'),
      modalTitle: m('Send password reset'),
      sendSuccess: m('Password reset email has been sent.'),
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
