import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.manage', {
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
      checkboxes: {
        email_is_verified: m('Email verified'),
        is_verified: m('Verified'),
        phone_is_verified: m('Phone verified'),
      },
      editButton: m('Edit details'),
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
  },
});
