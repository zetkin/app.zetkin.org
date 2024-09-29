import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.views', {
  actions: {
    create: m('Create'),
    createFolder: m('Create folder'),
    createJoinForm: m('Create join form'),
    createPerson: m('Create person'),
    createView: m('Create list'),
    importPeople: m('Import people'),
  },
  browser: {
    backToFolder: m<{ folder: ReactElement }>('Back to {folder}'),
    backToRoot: m('Back to all lists'),
    confirmDelete: {
      folder: {
        title: m('Delete folder and content'),
        warning: m(
          'Deleting this folder and all lists within is a permanent action that cannot be undone. Are you sure you want to continue?'
        ),
      },
      view: {
        title: m('Delete list'),
        warning: m(
          "Deleting this list is a permanent action which can't be undone. Are you sure you want to continue?"
        ),
      },
    },
    menu: {
      delete: m('Delete'),
      move: m('Move'),
      rename: m('Rename'),
    },
    moveToFolder: m<{ folder: ReactElement }>('Move to {folder}'),
    moveToRoot: m('Move to all lists'),
  },
  browserLayout: {
    tabs: {
      duplicates: m('Duplicates'),
      incoming: m('Incoming'),
      joinForms: m('Join forms'),
      views: m('Lists'),
    },
    title: m('People'),
  },
  cells: {
    localPerson: {
      alreadyInView: m('Already in list'),
      clearLabel: m('Unassign'),
      otherPeople: m('Other people'),
      restrictedMode: m("Can't be edited in shared lists."),
      searchLabel: m('Select a person'),
    },
    organizerAction: {
      actionNeeded: m('Organizer action needed'),
      showDetails: m('Show details'),
      solvedIssues: m<{ count: number }>(
        '{count, plural, =1 {1 solved issue} other {# solved issues}}'
      ),
    },
    personTag: {
      emptyValue: m('Empty value'),
    },
  },
  columnDialog: {
    categories: {
      basic: {
        description: m('Simple fields of information about people.'),
        title: m('Basic information'),
      },
      categorizing: {
        description: m(
          'For grouping, categorizing or shortlisting people, arbitrarily or based on data in Zetkin.'
        ),
        title: m('Categorizing'),
      },
      crossReferencing: {
        description: m(
          'Cross-reference with data in Zetkin using Smart Search.'
        ),
        title: m('Cross-referencing'),
      },
      outreach: {
        description: m(
          "Plan, delegate and execute outreach work, and report back when you're done"
        ),
        title: m('Outreach'),
      },
      surveys: {
        description: m(
          "Explore, search and filter based on people's responses to surveys."
        ),
        title: m('Surveys'),
      },
      utility: {
        description: m(
          "Trusty columns that you'll want to reuse in many situations"
        ),
        title: m('Utility'),
      },
    },
    choices: {
      delegate: {
        columnTitleAssignee: m('Assignee'),
        columnTitleContacted: m('Contacted'),
        columnTitleNotes: m('Notes'),
        columnTitleResponded: m('Responded'),
        description: m(
          'Adds a set of columns commonly used to delegate outreach work to some assignee.'
        ),
        keywords: m(''),
        title: m('Delegate'),
      },
      email: {
        description: m('Add a column containing email addresses'),
        keywords: m('email e-mail'),
        title: m('E-mail address'),
      },
      firstName: {
        description: m('Add a column containing first names'),
        keywords: m('first name'),
        title: m('First name'),
      },
      followUp: {
        columnTitleCheckbox: m('Checkbox'),
        columnTitleNotes: m('Notes'),
        description: m('Adds a checkbox column and a notes column'),
        keywords: m(''),
        title: m('Follow-up'),
      },
      fullName: {
        description: m('Two columns containing first and last name'),
        keywords: m('surname'),
        title: m('Full name'),
      },
      lastName: {
        description: m('Add a column containing last names'),
        keywords: m('last name surname'),
        title: m('Last name'),
      },
      localPerson: {
        columnTitle: m('Assignee'),
        description: m("Let's you pick an assignee on every row"),
        keywords: m(''),
        title: m('Assigned Person'),
      },
      localQuery: {
        columnTitle: m('In Smart Search?'),
        description: m('See if each person matches a Smart Search query'),
        keywords: m(''),
        title: m('Custom cross-reference'),
      },
      localText: {
        columnTitle: m('Notes'),
        description: m('Add a column to write notes about a person.'),
        keywords: m(''),
        title: m('Notes'),
      },
      personFields: {
        description: m(
          'Add your choice of columns like email, phone number, etc.'
        ),
        keywords: m('address zip city country'),
        title: m('Pick fields'),
      },
      phone: {
        description: m('Add a column containing phone numbers'),
        keywords: m('phone number'),
        title: m('Phone number'),
      },
      queryBooked: {
        columnTitle: m('Booked'),
        description: m('Are they booked on any future events?'),
        keywords: m('active booked'),
        title: m('Has future bookings'),
      },
      queryParticipated: {
        columnTitle: m('Participated'),
        description: m('Were they ever booked on an event?'),
        keywords: m('active booked'),
        title: m('Ever participated'),
      },
      queryReached: {
        columnTitle: m('Reached'),
        description: m('Have we ever reached them when phonebanking?'),
        keywords: m('phone'),
        title: m('Reached on phone'),
      },
      surveyResponse: {
        allOptions: m('All Options (Single Column)'),
        allOptionsHeader: m('All Options'),
        allOptionsSeparated: m('All Options (Separate Columns)'),
        description: m('Include response to a question from any survey.'),
        keywords: m('field multiple'),
        oneOption: m('One Option'),
        optionsLabel: m('What columns do you want to add?'),
        questionField: m('Questions'),
        surveyField: m('Surveys'),
        textField: m(
          'The answers are free text answers and will be displayed in a single column'
        ),
        title: m('Single survey question'),
      },
      surveyResponses: {
        description: m('Include responses from multiple survey questions.'),
        keywords: m('field multiple'),
        questionField: m('Questions'),
        surveyField: m('Surveys'),
        title: m('Multiple questions'),
      },
      surveySubmitDate: {
        description: m('See whether a person submitted a survey, and when'),
        keywords: m(''),
        noSurveys: m('Your organisation does not have any surveys.'),
        title: m('Survey submit date'),
      },
      tag: {
        description: m('Toggle a tag for each person in the list'),
        keywords: m(''),
        title: m('Tag'),
      },
      toggle: {
        columnTitle: m('Toggle'),
        description: m('Checkbox column'),
        keywords: m(''),
        title: m('Toggle'),
      },
    },
    commonHeaders: {
      email: m('Email address'),
      first_name: m('First Name'),
      last_name: m('Last Name'),
      phone: m('Phone number'),
    },
    editor: {
      alreadyInView: m('Already in list'),
      buttonLabels: {
        addColumns: m<{ columns: number }>(
          'Add {columns, plural, one {1 column} other {{columns} columns}}'
        ),
        change: m('Change column type'),
      },
      defaultTitle: m('New Column'),
      fieldLabels: {
        field: m('Field'),
        question: m('Question'),
        smartSearch: m('Smart Search'),
        survey: m('Survey'),
        tag: m('Tag'),
      },
    },
    gallery: {
      add: m('Add'),
      alreadyInView: m('Already in list'),
      columns: m('Columns'),
      configure: m('Configure'),
      header: m('Add column to list'),
      noSearchResults: m<{ searchString: string }>(
        'There are no column choices that match "{searchString}"'
      ),
      searchPlaceholder: m('Find a column'),
      searchResults: m<{ searchString: string }>(
        'Results for "{searchString}"'
      ),
    },
  },
  columnMenu: {
    configure: m('Configure column'),
    confirmDelete: m(
      'Are you sure you want to remove this column? It contains data  that will be permanently deleted. This action can not be undone.'
    ),
    delete: m('Delete column'),
    rename: m('Rename column'),
  },
  columnRenameDialog: {
    save: m('Save'),
    title: m('Title'),
  },
  dataTableErrors: {
    create_column: m('There was an error creating the column'),
    delete_column: m('There was an error deleting the column'),
    modify_column: m('There was an error editing the column'),
    remove_rows: m('There was an error removing one or more rows'),
  },
  defaultColumnTitles: {
    journey_assignee: m('Assigned journeys'),
    local_bool: m('Toggle'),
    local_person: m('Person reference'),
    organizer_action: m('Flagged calls'),
    person_notes: m('Notes'),
  },
  defaultViewTitles: {
    organizer_action: m('Organizer action needed'),
  },
  deleteDialog: {
    error: m('There was an error deleting the list'),
    title: m('Delete list?'),
    warningText: m(
      'Do you really want to delete this list? This will delete any data stored in the list such as notes and toggles (but will not delete the people from the database)?'
    ),
  },
  editViewTitleAlert: {
    error: m('Error. Title not updated'),
    success: m('Updated title!'),
  },
  empty: {
    dynamic: {
      configureButton: m('Configure'),
      description: m(
        'Create a dynamic list where people are added and removed automatically using Smart Search.'
      ),
      headline: m('Configure Smart Search list'),
    },
    notice: {
      dynamic: m('This is a Smart Search list but no people match the query'),
      static: m("You haven't added any rows yet"),
    },
    static: {
      description: m(
        'Add the first person to create a static list where people are added and removed manually.'
      ),
      headline: m('Add people manually'),
    },
  },
  folder: {
    summary: {
      empty: m('Empty'),
      folderCount: m<{ count: number }>(
        '{count, plural, =1 {1 folder} other {# folders}}'
      ),
      viewCount: m<{ count: number }>(
        '{count, plural, =1 {1 list} other {# lists}}'
      ),
    },
  },
  footer: {
    addPlaceholder: m('Start typing to add person to list'),
    alreadyInView: m('Already in list'),
  },
  moveViewDialog: {
    cancel: m('Cancel'),
    emptyFolder: m('Empty folder'),
    moveHere: m('Move here'),
  },
  newFolderTitle: m('New Folder'),
  newViewFields: {
    title: m('New list'),
  },
  removeDialog: {
    action: m('Are you sure you want to remove these rows from this list?'),
    title: m('Remove people from list'),
  },
  shareDialog: {
    download: {
      buttons: {
        csv: m('Download CSV file'),
        xlsx: m('Download Excel file'),
      },
      shareLink: m('share data securely'),
      tabLabel: m('Download'),
      warning1: m(
        'Avoid exporting data from Zetkin when you can, to ensure that all data is kept in order.'
      ),
      warning2: m<{ shareLink: ReactElement }>(
        'You can {shareLink} within Zetkin. Exporting makes sense when you want to copy data to another system.'
      ),
    },
    share: {
      addPlaceholder: m('Add collaborator'),
      collabInstructions: m<{ viewLink: ReactElement }>(
        'After adding collaborators, copy and send them the {viewLink}'
      ),
      showOfficials: m('Show officials'),
      statusLabel: m<{ collaborators: number; officials: number }>(
        'Shared with {collaborators, plural, =1 {1 collaborator} other {# collaborators}}, {officials, plural, =1 {1 official} other {# officials}} can access all lists.'
      ),
      tabLabel: m('Share'),
      viewLink: m('restricted link'),
    },
    title: m<{ title: string }>('Share "{title}"'),
  },
  suggested: {
    created: m('Created by {name}'),
    sectionTitle: m('Suggested'),
  },
  surveyOptionCell: {
    notSelected: m('Not selected'),
    selected: m('Selected'),
  },
  surveyPreview: {
    mostRecent: {
      header: m('Most recent'),
      openButton: m('Show full submission'),
    },
    older: {
      header: m('Older submissions'),
      openButton: m('Show'),
    },
  },
  toolbar: {
    createColumn: m('New column'),
    createFromSelection: m('Create list from selection'),
    removeFromSelection: m<{ numSelected: number }>(
      'Remove {numSelected, plural, one {1 person} other {{numSelected} people} } from list'
    ),
    removeTooltip: m(
      'Smart search lists do not currently support removing rows'
    ),
  },
  viewLayout: {
    actions: {
      share: m('Share'),
    },
    ellipsisMenu: {
      delete: m('Delete list'),
      editQuery: m('Edit Smart Search query'),
      makeDynamic: m('Convert to Smart Search list'),
      makeStatic: m('Convert to static list'),
    },
    jumpMenu: {
      placeholder: m('Start typing to find list'),
    },
    subtitle: {
      collaborators: m<{ count: number }>(
        '{count, plural, =1 {1 outside collaborator} other {# outside collaborators}}'
      ),
      columns: m<{ count: number }>(
        '{count, plural, =0 {No columns} =1 {1 column} other {# columns}}'
      ),
      people: m<{ count: number }>(
        '{count, plural, =0 {Empty} =1 {1 person} other {# people}}'
      ),
    },
  },
  viewsList: {
    columns: {
      created: m('Date created'),
      owner: m('Owner'),
      title: m('Title'),
    },
    empty: m("You haven't created any lists yet."),
  },
});
