import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.settings', {
  email: {
    themes: {
      addTheme: m('Create new theme'),
      delete: {
        action: m('Delete'),
        confirmDialog: {
          confirmButton: m<{ themeId: number }>('Yes, delete Theme {themeId}'),
          title: m<{ themeId: number }>('Delete Theme {themeId}?'),
          warningText: m<{ themeId: number }>(
            'Are you sure you want to delete Theme {themeId}? It cannot be undone.'
          ),
        },
      },
      duplicateTheme: m('Duplicate theme'),
      overview: {
        description: m(
          'A theme sets the overall look and layout of your emails, from colours and fonts to spacing, buttons and content blocks.'
        ),
        title: m('Themes'),
      },
      themeCard: {
        duplicate: m('Duplicate'),
        edit: m('Edit'),
        title: m<{ themeId: number }>('Theme {themeId}'),
      },
      themeEditor: {
        jsonError: m('Invalid JSON'),
        previewTitle: m('Preview'),
        saveButton: m('Save'),
        tabs: {
          block: m('Block'),
          css: m('CSS'),
          frame: m('Frame'),
        },
        title: m<{ themeId: number }>('Theme {themeId}'),
      },
      themePreview: {
        button: m('Register here'),
        heading: {
          paragraphPart1: m('Hello'),
          paragraphPart2: m(
            'We are pleased to invite you to a panel on May 1st'
          ),
          paragraphPart3: m('Here is what to expect:'),
        },
        paragraph: {
          paragraph1: m(
            'A specter is haunting Europe—the specter of Communism. All the powers of old Europe have entered into a holy alliance to exorcise this specter; Pope and Czar, Metternich and Guizot, French radicals and German police spies.'
          ),
          paragraph2: m(
            'Where is the party in opposition that has not been decried as Communistic by its opponents in power? Where the opposition that has not hurled back the branding reproach of Communism, against the more advanced opposition parties, as well as against its reactionary adversaries?'
          ),
          paragraph3: m('Two things result from this fact:'),
          paragraph4: m(
            'Communism is already acknowledged by all European powers to be in itself a power.'
          ),
          paragraph5: m(
            'It is high time that Communists should openly, in the face of the whole world, publish their views, their aims, their tendencies, and meet this nursery tale of the Specter of Communism with a Manifesto of the party itself.'
          ),
          paragraph6: m('To read the full manifesto, click '),
          paragraph7: m('here'),
        },
      },
      title: m('Themes'),
      unsavedChanges: {
        confirmLeaving: m('Leave without saving'),
        warning: m('You have unsaved changes, are you sure you want to leave?'),
      },
    },
  },
  fields: {
    access: {
      onlyThisOrg: m('Only this organization'),
      suborgRead: m('Suborganizations can see'),
      suborgReadAndWrite: m('Suborganizations can edit'),
    },
    accessTypes: {
      onlyThisOrg: m('No'),
      suborgRead: m('Yes, they can see the data'),
      suborgReadAndWrite: m('Yes, they can both see and edit the data'),
    },
    confirmDeletion: {
      confirmButton: m<{ fieldTitle: string }>('Yes, delete {fieldTitle}'),
      title: m<{ fieldTitle: string }>('Delete {fieldTitle}?'),
      warningText: m<{ fieldTitle: string }>(
        'Are you sure you want to delete {fieldTitle}? This cannot be undone.'
      ),
    },
    create: {
      accessInput: m('Share with suborganizations?'),
      accessInputHelper: m(
        'Admins in this organization will always be able to both see and edit this data on people.'
      ),
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
        access: m('Access'),
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
  settingsLayout: {
    access: m('Access'),
    email: m('Email'),
    fields: m('Fields'),
    title: m('Settings'),
  },
});
