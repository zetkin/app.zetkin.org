import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.events', {
  addPerson: {
    addButton: m('Add person'),
    addPlaceholder: m('Start typing to add participant'),
    status: {
      booked: m('Already booked'),
      signedUp: m('Signed up'),
    },
  },
  common: {
    allDay: m('All day'),
    noActivity: m('Uncategorized'),
    noLocation: m('No physical location'),
    noTitle: m('Untitled event'),
  },
  eventActionButtons: {
    cancel: m('Cancel'),
    delete: m('Delete'),
    duplicate: m('Duplicate'),
    move: m('Move'),
    publish: m('Publish'),
    restore: m('Restore'),
    unpublish: m('Unpublish'),
    warning: m<{ eventTitle: string }>('"{eventTitle}" will be deleted.'),
    warningCancel: m<{ eventTitle: string }>(
      '"{eventTitle}" will be canceled.'
    ),
    warningRestore: m<{ eventTitle: string }>(
      '"{eventTitle}" will be restored.'
    ),
  },
  eventChangeCampaignDialog: {
    dialogTitle: m('Move event'),
    error: m('Error: Could not move the event to the selected project'),
    moveButtonLabel: m('Move'),
    success: m<{ campaignTitle: string }>('Event moved to "{campaignTitle}"'),
  },
  eventContactCard: {
    header: m('Contact'),
    noContact: m('No Contact Assigned!'),
    removeButton: m('Remove'),
    selectPlaceholder: m('Select a contact person'),
    warningText: m<{ name: string }>(
      '{name} will no longer be the contact person, but will remain booked on the event as a participant'
    ),
  },
  eventOverviewCard: {
    buttonEndDate: m('+ End date'),
    createLocation: m('Create new location'),
    description: m('Description'),
    editButton: m('Edit event information'),
    endDate: m('End'),
    endTime: m('End time'),
    location: m('Location'),
    noLocation: m('No physical location'),
    startDate: m('Start'),
    startTime: m('Start time'),
    url: m('Link'),
  },
  eventParticipantsCard: {
    confirmed: m('Confirmed Attendance'),
    contact: m('Contact'),
    header: m('Participants'),
    noContact: m('None assigned'),
    notifications: m('Notifications'),
    participantList: m('View participants'),
    pending: m('Pending sign-ups'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
  eventParticipantsList: {
    attendance: m('Attendance'),
    bookedParticipants: m('Booked Participants'),
    buttonAttended: m('Attended'),
    buttonBook: m('Book'),
    buttonCancel: m('Cancel'),
    buttonCancelled: m('Cancelled'),
    buttonDelete: m('Delete'),
    buttonNoshow: m('No-show'),
    cancelledParticipants: m('Cancelled Participants'),
    columnEmail: m('Email'),
    columnName: m('Name'),
    columnNotified: m('Notified'),
    columnPhone: m('Phone'),
    contactTooltip: m('Contact Person'),
    descriptionBooked: m(
      'These are the people you have booked and are counting on for the event. To cancel their participation they have to contact you and you can cancel them manually.'
    ),
    descriptionCancelled: m(
      "These people have cancelled their participation for some reason. We keep them here so you don't try to book them again."
    ),
    descriptionSignups: m(
      'These people have signed up in the activists portal. They can still cancel their sign-up at any time.'
    ),
    dropDownAttended: m('Confirmed attendance'),
    dropDownNoshow: m('Did not show up'),
    participantTooltip: m('Make contact person'),
    signUps: m('Sign-ups'),
  },
  eventPopper: {
    backToEvents: m('Back to event list'),
    backToLocations: m('Back to locations'),
    backToShifts: m('Back to shift list'),
    booked: m('Booked'),
    cancel: m('Cancel'),
    cancelWarning: m(
      'If you do, remember to notify all participants and sign-ups that the event has been cancelled!'
    ),
    confirmCancel: m('Are you sure you want to cancel this event?'),
    confirmDelete: m('Are you sure you want to delete this event?'),
    contactPerson: m('Contact person'),
    dateAndTime: m('Date & Time'),
    delete: m('Delete'),
    deleteWarning: m(
      'Once the event has been deleted you will not be able to access it again.'
    ),
    description: m('Description'),
    duplicate: m('Duplicate'),
    eventPageLink: m('Go to event page'),
    events: m('Events'),
    location: m('Location'),
    locations: m('Locations'),
    multiEvent: m('Multiple events'),
    multiLocation: m('Multi-location event'),
    multiShift: m('Multi-shift event'),
    noContact: m('No contact person has been assigned'),
    notified: m('Notified'),
    pendingSignups: m('There are pending signups'),
    publish: m('Publish'),
    reminded: m('Reminded'),
    shifts: m('Shifts'),
    signups: m('Signups'),
    unsentReminders: m<{ numMissing: number }>(
      '{numMissing, plural, =1 {One participant} other {# participants}} have not yet received reminders'
    ),
  },
  eventRelatedCard: {
    header: m('Related events'),
  },
  eventShiftModal: {
    addShift: m('Add shift'),
    customTitle: m('Custom title'),
    date: m('Date'),
    description: m('Description'),
    draft: m('Draft'),
    end: m('End'),
    event: m('Event'),
    eventDuration: m('Event duration'),
    header: m('Create multi-shift event'),
    hours: m<{ no: number }>('{no, plural, one {1 hour} other {# hours}}'),
    hoursShort: m('h'),
    invalidDate: m('Invalid date'),
    invalidTime: m('Invalid time'),
    link: m('Link'),
    location: m('Location'),
    minutes: m<{ no: number }>(
      '{no, plural, one {1 minute} other {# minutes}}'
    ),
    minutesShort: m('min'),
    noEvents: m<{ no: number }>('This will create {no} events'),
    noTitle: m('Untitled multi-shift event'),
    participation: m('Participation'),
    participationDescription: m('Targeted number of participants per shift'),
    publish: m('Publish'),
    reset: m('Reset'),
    shiftDuration: m('Shift duration'),
    shiftStart: m<{ no: number }>('Start shift {no}'),
    shifts: m<{ no: number }>('{no, plural, one {1 shift} other {# shifts}}'),
    shiftsHeader: m('Shifts'),
    showMoreSettingsButton: m('More settings'),
    start: m('Start'),
    type: m('Type'),
  },
  eventStatus: {
    cancelled: m('Cancelled'),
    draft: m('Draft'),
    ended: m('Ended'),
    open: m('Open'),
    scheduled: m('Scheduled'),
    unknown: m('Unknown'),
  },
  list: {
    events: m('Events'),
    noEvents: m('No events...'),
  },
  locationModal: {
    cancel: m('Cancel'),
    createLocation: m('Create new location'),
    description: m('Description'),
    infoText: m(
      'You can click and drag to pan the map and pinch or scroll to zoom. To create a new location you can click on an empty spot on the map.'
    ),
    move: m('Move'),
    moveInstructions: m('Drag the pin to select location.'),
    noDescription: m('No description'),
    noRelatedEvents: m(
      'There are no other events happening here around this time.'
    ),
    relatedEvents: m('Other events here around this time'),
    save: m('Save'),
    saveLocation: m('Save location'),
    searchBox: m('Find location'),
    title: m('Location name'),
    useLocation: m('Use location'),
  },
  participantSummaryCard: {
    bookButton: m('Book all'),
    booked: m('Notifications'),
    cancelled: m('Cancelled'),
    confirmed: m('Confirmed Attendance'),
    header: m('Participants'),
    noshow: m<{ noshows: number }>(
      '({noshows, plural, =1 {1 no-show} other {# no-shows}})'
    ),
    pending: m('Pending sign-ups'),
    recordButton: m('Record attendance'),
    remindButton: m('Remind all'),
    remindButtondisabledTooltip: m(
      'You have to assign a contact person before sending reminders'
    ),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
  participantsModal: {
    affected: {
      empty: m(
        "You haven't made any changes yet. Pick an event to move participants around."
      ),
      header: m('Affected people'),
    },
    discardButton: m('Discard changes'),
    emptyStates: {
      booked: m(
        'No one has been booked at this event. You can add participants from the pool.'
      ),
      pending: m(
        'There are no additional participants in the pool. You can move participants from an event to the pool to work with them here.'
      ),
    },
    participants: {
      buttons: {
        addBack: m('Add back'),
        addHere: m('Add here'),
        move: m('Move'),
        undo: m('Undo'),
      },
      headers: {
        booked: m('This event'),
        pending: m('People that can be added'),
      },
      states: {
        added: m('Being added to this event'),
        pending: m('In the pool'),
        removed: m('Moving away from this event'),
      },
    },
    statusText: m<{ personCount: number }>(
      '{personCount, plural, =1 {One person} other {# people}} will be moved around'
    ),
    submitButton: m('Execute'),
    title: m('Manage participants'),
  },
  search: m('Search'),
  state: {
    cancelled: m('Cancelled'),
    draft: m('Draft'),
    ended: m('Ended'),
    open: m('Open'),
    scheduled: m('Scheduled'),
  },
  stats: {
    participants: m<{ participants: number }>(
      '{participants, plural, one {1 participant} other {# participants}}'
    ),
  },
  tabs: {
    overview: m('Overview'),
    participants: m('Participants'),
  },
  tooltipContent: m('Untitled events will display type as title'),
  type: {
    cancelButton: m('Cancel'),
    createType: m<{ type: string }>('Create "{type}"'),
    deleteButton: m('Delete'),
    deleteMessage: m<{ eventType: string }>(
      'Are you sure you want to delete "{eventType}" event type for everyone?'
    ),
    tooltip: m('Click to change type'),
    uncategorized: m('Uncategorized'),
  },
});
