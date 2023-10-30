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
  editTextInPlace: {
    tooltip: {
      edit: m('Click to edit'),
      noEmpty: m('This cannot be empty'),
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
  imageSelectDialog: {
    instructions: m('Drag and drop an image file, or click to select'),
  },
  lists: {
    showMore: m('Show more...'),
  },
  organizeSidebar: {
    areas: m('Areas'),
    filter: m('Type to filter'),
    home: m('Home'),
    journeys: m('Journeys'),
    people: m('People'),
    projects: m('Projects & Activities'),
    search: m('Search'),
    signOut: m('Sign out'),
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
  snackbar: {
    error: m('Oh dear, something went wrong'),
    info: m(''),
    success: m('Success!'),
    warning: m('Warning!'),
  },
  speedDial: {
    createCampaign: m('Create campaign'),
    createEvent: m('Create event'),
    createTask: m('Create task'),
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
    singleDayToday: m<{ end: ReactElement; start: ReactElement }>(
      'Today, {start} - {end}'
    ),
  },
});
