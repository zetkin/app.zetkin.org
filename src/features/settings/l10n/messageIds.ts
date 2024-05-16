import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.settings', {
  addPerson: {
    administrators: m('administrators'),
    alreadyInList: m('Already in list'),
    button: m('Add person'),
    organizers: m('organizers'),
    placeholder: m<{ list: string }>('Type to add person to {list}'),
  },
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
  organizers: {
    columns: {
      inheritance: m('Role inheritance'),
      name: m('Name'),
    },
    description: m(
      'Organizers have enough privileges to do things like organizing campaigns and managing existing call assignments.'
    ),
    title: m('Organizers'),
  },
  save: m('Save'),
  settingsLayout: {
    access: m('Access'),
    title: m('Settings'),
  },
  tableButtons: {
    demote: m('Demote'),
    promote: m('Promote'),
    remove: m('Remove'),
  },
  you: m('You'),
});
