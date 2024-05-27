import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.settings', {
  officials: {
    addPerson: {
      addAdmin: m('Add administrator'),
      addOrganizer: m('Add organizer'),
      administrators: m('administrators'),
      alreadyInList: m('Already in list'),
      organizers: m('organizers'),
      placeholder: m<{ list: string }>('Type to add person to {list}'),
    },
    administrators: {
      columns: {
        name: m('Name'),
      },
      description: m(
        'Administrators have full access to creating, editing and deleting any type of content.'
      ),
      roleInheritance: m('Administrator in'),
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
      roleInheritance: m('Organizer in'),
      title: m('Organizers'),
    },
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
  },
});
