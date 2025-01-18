import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('zui', {
  accessList: {
    added: m<{ sharer: string; updated: ReactElement }>(
      'Added by {sharer} {updated}'
    ),
    removeAccess: m('Remove access'),
  },
  collapse: {
    collapse: m('Collapse'),
    expand: m('Expand'),
  },
  confirmDialog: {
    button: m('Confirm'),
    defaultTitle: m('Confirm'),
    defaultWarningText: m(
      'Are you sure you want to do this action? It can not be undone.'
    ),
  },
  copyToClipboard: {
    copied: m('Copied'),
    copiedValue: m<{ value: string }>('Copied "{value}"'),
    copy: m('Copy'),
  },
  createPerson: {
    cancel: m('Cancel'),
    createBtn: m('Create'),
    defaultitle: m('Create person'),
    enumFields: {
      noneOption: m('None'),
    },
    genders: {
      f: m('Female'),
      m: m('Male'),
      o: m('Other'),
      unknown: m('Unknown'),
    },
    showAllFields: m('Show all fields'),
    submitLabel: {
      add: m('Create & add'),
      assign: m('Create & assign'),
      default: m('Create'),
    },
    tagCreateAndApplyLabel: m('Create and apply'),
    title: {
      addToJourney: m<{ journey: string }>(
        'Create person and add to {journey}'
      ),
      addToList: m<{ list: string }>('Create person and add to {list}'),
      assignToCanvassAssignment: m<{ canvassAss: string }>(
        'Create person and assign to {canvassAss}'
      ),
      assignToJourney: m<{ journey: string }>(
        'Create person and assign to {journey}'
      ),
      caller: m('Create person and add as caller'),
      contact: m('Create person and assign as contact'),
      default: m('Create person'),
      participant: m('Create person and add as participant'),
    },
    validationWarning: {
      email: m('Please add a valid email address'),
      name: m('This field cannot be empty'),
      phone: m('Please add a valid phone number'),
      url: m('Please add a valid URL'),
    },
  },
  dataTableSearch: {
    button: m('Search'),
    helpText: m<{ minSearchLength: number }>(
      'Type at least {minSearchLength} characters'
    ),
    idSearchHelpText: m('Type an ID (numbers only)'),
    placeholder: m('Search this table'),
    placeholderWithIdSearch: m('Search - use # for IDs, e.g. type #123'),
    title: m('Search'),
  },
  dataTableSorting: {
    addButton: m('Add sorting column'),
    button: m('Sort'),
    hint: m<{ shiftKeyIcon: ReactElement }>(
      'Hint: hold down {shiftKeyIcon} while clicking multiple columns'
    ),
    title: m('Sort'),
  },
  dateRange: {
    draft: m('No start date'),
    end: m('End'),
    finite: m<{ end: string; start: string }>('Visible from {start} to {end}'),
    indefinite: m<{ start: string }>('Visible from {start} onwards'),
    invisible: m('Not visible or scheduled'),
    start: m('Start'),
  },
  dateSpan: {
    multiDay: m<{
      endDate: ReactElement;
      startDate: ReactElement;
    }>('{startDate} - {endDate}'),
    multiDayEndsToday: m<{
      startDate: ReactElement;
    }>('{startDate} - Today'),
    multiDayToday: m<{
      endDate: ReactElement;
    }>('Today - {endDate}'),
    singleDay: m<{
      date: ReactElement;
    }>('{date}'),
    singleDayToday: m('Today'),
  },
  duration: {
    days: m<{ n: number }>('{n, plural, =1 {1 day} other {# days}}'),
    h: m<{ n: number }>('{n}h'),
    m: m<{ n: number }>('{n}m'),
    ms: m<{ n: number }>('{n}ms'),
    s: m<{ n: number }>('{n}s'),
  },
  editTextInPlace: {
    tooltip: {
      edit: m('Click to edit'),
      noEmpty: m('This cannot be empty'),
    },
  },
  editableImage: {
    add: m('Click to add image'),
  },
  editor: {
    blockLabels: {
      heading: m('Heading'),
      zbutton: m('Button'),
      zimage: m('Image'),
    },
    extensions: {
      link: {
        apply: m('Apply'),
        cancel: m('Cancel'),
        remove: m('Remove'),
        textPlaceholder: m('Add link text here'),
      },
    },
    placeholder: {
      label: m<{ link: ReactElement }>(
        'Type / or {link} to insert block, or just type some text'
      ),
      link: m('click here'),
    },
    variables: {
      firstName: m('First Name'),
      fullName: m('Full Name'),
      lastName: m('Last Name'),
    },
  },
  futures: {
    errorLoading: m('There was an error loading the data.'),
  },
  header: {
    collapseButton: {
      collapse: m('Collapse'),
      expand: m('Expand'),
    },
  },
  lists: {
    showMore: m('Show more...'),
  },
  orgScopeSelect: {
    orgPlaceholder: m('Select organizations'),
    orgSelectionLabel: m<{ count: number }>('{count} selected'),
    scope: {
      all: m<{ org: string }>('{org} and all sub-organizations'),
      specific: m('Specific organizations'),
      suborgs: m('Only sub-organizations'),
      this: m<{ org: string }>('Only {org}'),
    },
  },
  organizeSidebar: {
    areas: m('Areas'),
    filter: m('Type to filter'),
    home: m('Home'),
    journeys: m('Journeys'),
    people: m('People'),
    projects: m('Projects & Activities'),
    search: m('Search'),
    settings: m('Settings'),
    signOut: m('Sign out'),
    tags: m('Tags'),
    userSettings: m('User settings'),
  },
  personGridEditCell: {
    keepTyping: m('Keep typing..'),
    noResult: m('No matching person found'),
    otherPeople: m('Other people'),
    restrictedMode: m("Can't be edited in shared lists."),
    searchResults: m('Search results'),
  },
  personSelect: {
    keepTyping: m('Keep typing to start searching'),
    noResult: m('No matching person found'),
    search: m('Type to start searching'),
    searching: m('Searching...'),
  },
  publicFooter: {
    hostingOrganization: m<{ name: string }>(
      'This instance of Zetkin is hosted and managed by {name}.'
    ),
    links: {
      foundation: m('Zetkin Foundation'),
      privacy: m('Privacy Policy'),
    },
    privacyPolicyLink: m('https://zetkin.org/privacy'),
    text: m(
      'Zetkin is a platform for organizing activism. Zetkin is developed by Zetkin Foundation, with a mission to work for radical change in society in a socialist, feminist, antiracist and sustainable direction.'
    ),
  },
  snackbar: {
    error: m('Oh dear, something went wrong'),
    info: m(''),
    success: m('Success!'),
    warning: m('Warning!'),
  },
  submitOrCancel: {
    cancel: m('Cancel'),
    submit: m('Submit'),
  },
  suffixedNumber: {
    thousands: m<{ num: number }>('{num}K'),
  },
  timeSpan: {
    multiDay: m<{
      end: ReactElement;
      endDate: ReactElement;
      start: ReactElement;
      startDate: ReactElement;
    }>('{startDate}, {start} - {endDate}, {end}'),
    multiDayEndsToday: m<{
      end: ReactElement;
      start: ReactElement;
      startDate: ReactElement;
    }>('{startDate}, {start} - Today, {end}'),
    multiDayToday: m<{
      end: ReactElement;
      endDate: ReactElement;
      start: ReactElement;
    }>('Today, {start} - {endDate}, {end}'),
    singleDay: m<{
      date: ReactElement;
      end: ReactElement;
      start: ReactElement;
    }>('{date}, {start} - {end}'),
    singleDayAllDay: m('All day today'),
    singleDayToday: m<{ end: ReactElement; start: ReactElement }>(
      'Today, {start} - {end}'
    ),
  },
  timezonePicker: {
    gmt: m('GMT'),
    placeholder: m('Type to search location'),
    timezone: m('Timezone'),
  },
});
