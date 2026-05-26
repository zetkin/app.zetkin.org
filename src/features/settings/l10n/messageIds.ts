import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.settings', {
  fields: {
    confirmDeletion: {
      confirmButton: m<{ fieldTitle: string }>('Yes, delete {fieldTitle}'),
      title: m<{ fieldTitle: string }>('Delete {fieldTitle}?'),
      warningText: m<{ fieldTitle: string }>(
        'Are you sure you want to delete {fieldTitle}? This cannot be undone.'
      ),
    },
    create: {
      createButton: m('Create'),
      optionsInput: m('Options (comma separated)'),
      slugInput: m('Slug'),
      title: m('Create new field'),
      titleInput: m('Title'),
      typeInput: m('Type'),
    },
    customFieldTypes: {
      date: m('Date'),
      enum: m('Options'),
      json: m('JSON'),
      lnglat: m('Longitude & latitude'),
      text: m('Text'),
      url: m('URL'),
    },
    edit: {
      cancelButton: m('Cancel'),
      deleteButton: m('Delete field'),
      errorMessage: m(
        'There was an unexpected error when updating this field. If it keeps failing, contact support.'
      ),
      optionsInput: m('Options (comma separated)'),
      saveButton: m('Save'),
      slugInput: m('Slug'),
      title: m<{ fieldTitle: string }>('Editing {fieldTitle}'),
      titleInput: m('Title'),
      typeInput: m('Type'),
    },
    list: {
      editButton: m('Edit'),
      headers: {
        slug: m('Slug'),
        title: m('Title'),
        type: m('Type'),
      },
      title: m('Fields'),
    },
  },
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
      empty: m('You have not added any administrators yet.'),
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
      empty: m('You have not added any organizers yet.'),
      roleInheritance: m('Organizer in'),
      title: m('Organizers'),
    },
    settingsLayout: {
      access: m('Access'),
      fields: m('Fields'),
      title: m('Settings'),
    },
    tableButtons: {
      demote: m('Demote'),
      promote: m('Promote'),
      remove: m('Remove'),
    },
    urlCard: {
      linkToPub: m('Link to public organization'),
      subTitle: m(
        'Users must connect to the organization before they can access Zetkin as officials.'
      ),
    },
    you: m('You'),
  },
  themes: {
    overview: {
      description: m(
        'A theme sets the overall look and layout of your emails, from colours and fonts to spacing, buttons and content blocks.'
      ),
    },
  },
});
