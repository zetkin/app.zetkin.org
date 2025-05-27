import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

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
    filter: m('Type to filter'),
    geography: m('Geography'),
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
  report: {
    steps: {
      callBack: {
        question: {
          anyTimeOptionLabel: m('Any time of day'),
          callBackButtonLabel: m<{ date: JSX.Element }>(
            'Call back after {date}'
          ),
          dateLabel: m('On what date'),
          examples: {
            nextWeek: m('Next week'),
            title: m('Examples:'),
            today: m('Later today'),
            tomorrow: m('Tomorrow'),
          },
          timeLabel: m('After what time'),
          title: m('When should we call back?'),
        },
        summary: {
          afterSpecificTime: m<{ time: JSX.Element }>('Call back after {time}'),
          anyTime: m<{ date: JSX.Element }>(
            'Call back on {date} at any time of day'
          ),
          subtitle: m<{ firstName: string }>(
            'In the meantime, {firstName} is automatically removed from the queue'
          ),
        },
      },
      callerLog: {
        question: {
          noteLabel: m('Add optional note'),
          saveWithNoteButton: m('Save with note'),
          saveWithoutNoteButton: m('Save without note'),
          title: m('Do you wish to leave a note for future callers?'),
        },
        summary: {
          withNote: {
            subtitle: m<{ note: string }>(
              'Future callers will see your note: {note}'
            ),
            title: m('You wrote a note to future callers'),
          },
          withoutNote: m('You did not leave a note to future callers'),
        },
      },
      couldTalk: {
        question: {
          noButton: m('No, call back'),
          title: m<{ firstName: string }>('Could {firstName} talk?'),
          yesButton: m('Yes'),
        },
        summary: {
          couldNotTalk: {
            subtitle: m('Future callers will see that we had to call back'),
            title: m<{ firstName: string }>('{firstName} could not talk'),
          },
          couldTalk: {
            subtitle: m('Future callers will see that you were able to finish'),
            title: m<{ firstName: string }>('{firstName} could talk'),
          },
        },
      },
      failureReason: {
        question: {
          lineBusy: m('Busy'),
          noPickup: m('No pick up'),
          notAvailable: m('Not available right now'),
          title: m('Why not?'),
          wrongNumber: m('Wrong number'),
        },
        summary: {
          lineBusy: m<{ firstName: string }>('The line was busy'),
          noPickup: m<{ firstName: string }>('{firstName} did not pick up'),
          notAvailable: m<{ firstName: string }>(
            '{firstName} was not available to talk, we need to call back'
          ),
          wrongNumber: m<{ firstName: string }>(
            'We have the wrong number for {firstName}'
          ),
        },
      },
      leftMessage: {
        question: {
          noButton: m('No'),
          title: m('Did you leave a message on the answering machine?'),
          yesButton: m('Yes'),
        },
        summary: {
          didNotLeaveMessage: m('Did not leave message on answering machine'),
          leftMessage: {
            subtitle: m('Future callers will see that you left a message'),
            title: m('Left message on answering machine'),
          },
        },
      },
      organizerAction: {
        question: {
          noButton: m('No'),
          title: m(
            'Did anything happen during the call that requires action by an organizer?'
          ),
          yesButton: m('Yes'),
        },
        summary: {
          orgActionNeeded: {
            subtitle: m('An organizer will be notified'),
            title: m('You want an organizer to take a look at this call'),
          },
          orgActionNotNeeded: m('No action is neccessary'),
        },
      },
      organizerLog: {
        question: {
          messageLabel: m('Add optional message'),
          title: m('Explain the problem to the organizer'),
          withMessageButton: m('Include message'),
          withoutMessageButton: m('Save without message'),
          wrongNumberMessages: {
            altPhone: m<{ altPhone: string }>(
              'Alt phone number is wrong: {altPhone}'
            ),
            both: m<{ altPhone: string; phone: string }>(
              'Both phone numbers are wrong, {phone} and {altPhone}'
            ),
            phone: m<{ phone: string }>('Phone number is wrong: {phone}'),
          },
        },
        summary: {
          withMessage: {
            subtitle: m<{ message: string }>(
              'The organizers will see your message: {message}'
            ),
            title: m('You left a message to the organizers'),
          },
          withoutMessage: m('You did not leave a message to the organizers'),
        },
      },
      successOrFailure: {
        question: {
          noButton: m('No'),
          title: m<{ firstName: string }>('Did you reach {firstName}?'),
          yesButton: m('Yes'),
        },
        summary: {
          failure: {
            subtitle: m<{ firstName: string }>(
              'Future callers will see that you did not speak to {firstName}'
            ),
            title: m<{ firstName: string }>('We did not reach {firstName}'),
          },
          success: {
            subtitle: m<{ firstName: string }>(
              'Future callers will see that you spoke to {firstName}'
            ),
            title: m<{ firstName: string }>('{firstName} was reached'),
          },
        },
      },
      wrongNumber: {
        question: {
          bothButton: m('Both'),
          title: m('Which number is wrong?'),
        },
        summary: {
          phoneBoth: m<{ altPhone: string; phone: string }>(
            'Both numbers are wrong: {phone} and {altPhone}'
          ),
          phoneSingle: m<{ phone: string }>(
            'One phone number is wrong: {phone}'
          ),
        },
      },
    },
    summary: {
      editButtonLabel: m('Edit'),
    },
  },
  signUpChip: {
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
