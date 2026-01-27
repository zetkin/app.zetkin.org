import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('zui', {
  accessList: {
    added: m<{ sharer: string; updated: ReactElement }>(
      'Added by {sharer} {updated}'
    ),
    removeAccess: m('Remove access'),
  },
  autocomplete: {
    noOptionsDefaultText: m('No option matches your search'),
  },
  breadcrumbs: {
    showMore: m<{ number: number }>('{number} more...'),
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
      assignToAreaAssignment: m<{ areaAss: string }>(
        'Create person and assign to {areaAss}'
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
    placeholder: m<{ minSearchLength: number }>(
      'Type to search (min {minSearchLength} chars)'
    ),
    placeholderWithIdSearch: m<{ minSearchLength: number }>(
      'Search - use # for IDs, e.g. type #123 (min {minSearchLength} chars)'
    ),
    title: m('Search'),
  },
  dataTableSorting: {
    addButton: m('Add sorting column'),
    ascending: m('Ascending'),
    button: m('Sort'),
    descending: m('Descending'),
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
  drawerModal: {
    close: m('Close'),
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
  ellipsisMenu: {
    ariaLabel: m('More options'),
  },
  eventWarningIcons: {
    contact: m('No contact person has been assigned'),
    reminders: m<{ numMissing: number }>(
      '{numMissing, plural, =1 {One participant} other {# participants}} have not yet received reminders'
    ),
    signUps: m('There are pending signups'),
  },
  expandableText: {
    showLess: m('Show less'),
    showMore: m('Show more'),
  },
  footer: {
    privacyPolicy: m('Privacy policy'),
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
  mobileOrganizeHeader: {
    sideBarMenuButtonDescription: m('Open sidebar menu'),
    userMenuButtonDescription: m('Open user menu'),
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
    collapse: m('Collapse sidebar'),
    expand: m('Expand sidebar'),
    filter: m('Type to filter'),
    filterLabel: m('Filter organizations'),
    geography: m('Geography'),
    home: m('Home'),
    journeys: m('Journeys'),
    myPagesInfoText: m('Go to my pages'),
    myPagesMenuItemLabel: m('My pages'),
    mySettingsMenuItemLabel: m('My settings'),
    organizationAvatarAltText: m('Organization icon'),
    organizationSwitcher: {
      hide: m('Hide organization switcher'),
      show: m('Show organization switcher'),
    },
    overview: m('Overview'),
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
    bulkAdd: {
      backButton: m('Back'),
      cancelButton: m('Cancel'),
      confirmMessage: m<{ count: number; entityToAddTo?: string }>(
        '{entityToAddTo, select, undefined {You are about to add {count, number, integer} people. Are you sure you want to continue?} other {You are about to add {count, number, integer} people to ‘{entityToAddTo}’. Are you sure you want to continue?}}'
      ),
      confirmTitle: m('Confirm adding people'),
      fromView: m<{ viewTitle: string }>('From  ‘{viewTitle}’'),
      openButton: m('Bulk add'),

      submitButton: m<{ numSelected: number }>(
        '{numSelected, plural, =0 {Select} =1 {Select 1 person} other {Select {numSelected, number, integer} people}}'
      ),
      title: m<{ entityToAddTo?: string }>(
        '{entityToAddTo, select, undefined {Add people} other {Add people to ‘{entityToAddTo}’}}'
      ),
    },
    keepTyping: m('Keep typing to start searching'),
    noResult: m('No matching person found'),
    search: m('Type to start searching'),
    searching: m('Searching...'),
  },
  privacyPolicyLink: m('https://zetkin.org/privacy'),
  publicFooter: {
    hostingOrganization: m<{ name: string }>(
      'This instance of Zetkin is hosted and managed by {name}.'
    ),
    links: {
      foundation: m('Zetkin Foundation'),
      privacy: m('Privacy Policy'),
    },
    text: m(
      'Zetkin is a platform for organizing activism. Zetkin is developed by Zetkin Foundation, with a mission to work for radical change in society in a socialist, feminist, antiracist and sustainable direction.'
    ),
  },
  signUpChip: {
    booked: m('You are booked'),
    callSignUp: m<{ name: string }>('{name} has signed up'),
    needed: m('You are needed'),
    signedUp: m('You have signed up'),
  },
  snackbar: {
    error: m('Oh dear, something went wrong'),
    info: m(''),
    success: m('Success!'),
    warning: m('Warning!'),
  },
  statusChip: {
    cancelled: m('Cancelled'),
    closed: m('Closed'),
    draft: m('Draft'),
    ended: m('Ended'),
    published: m('Published'),
    scheduled: m('Scheduled'),
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
      end: string | ReactElement;
      endDate: string | ReactElement;
      start: string | ReactElement;
      startDate: string | ReactElement;
    }>('{startDate}, {start} - {endDate}, {end}'),
    multiDayEndsToday: m<{
      end: string | ReactElement;
      start: string | ReactElement;
      startDate: string | ReactElement;
    }>('{startDate}, {start} - Today, {end}'),
    multiDayToday: m<{
      end: string | ReactElement;
      endDate: string | ReactElement;
      start: string | ReactElement;
    }>('Today, {start} - {endDate}, {end}'),
    singleDay: m<{
      date: string | ReactElement;
      end: string | ReactElement;
      start: string | ReactElement;
    }>('{date}, {start} - {end}'),
    singleDayAllDay: m('All day today'),
    singleDayToday: m<{
      end: string | ReactElement;
      start: string | ReactElement;
    }>('Today, {start} - {end}'),
  },
  timeZonePicker: {
    gmt: m('GMT'),
    noOptionsText: m('No location matches your search'),
    placeholder: m('Type to search for a location'),
    timeZone: m('Time zone'),
  },
});
