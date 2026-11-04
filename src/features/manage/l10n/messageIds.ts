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
    manage: m('Manage'),
  },
});
