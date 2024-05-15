import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.settings', {
  administrators: {
    columns: {
      inheritance: m('Role inheritance'),
      name: m('Name'),
    },
    description: m(
      'Administrators have full access to creating, editing and deleting any type of content.'
    ),
    title: m('Administrators'),
  },
  save: m('Save'),
  settingsLayout: {
    access: m('Access'),
    title: m('Settings'),
  },
});
