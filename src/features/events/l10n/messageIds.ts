import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.events', {
  eventContactCard: {
    header: m('Contact'),
    noContact: m('No Contact Assigned!'),
    removeButton: m('Remove'),
    selectPlaceholder: m('Select a contact person'),
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
    booked: m('Notifications'),
    contact: m('Contact'),
    header: m('Participants'),
    noContact: m('None assigned'),
    participantList: m('View participants'),
    pending: m('Pending sign-ups'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
  eventParticipantsList: {
    bookedParticipants: m('Booked Participants'),
    buttonBook: m('Book'),
    buttonCancel: m('Cancel'),
    columnEmail: m('Email'),
    columnName: m('Name'),
    columnNotified: m('Notified'),
    columnPhone: m('Phone'),
    descriptionBooked: m(
      'These are the people you have booked and are counting on for the event. To cancel their participation they have to contact you and you can cancel them manually.'
    ),
    descriptionSignups: m(
      'These people have signed up in the activists portal. They can still cancel their sign-up at any time.'
    ),
    signUps: m('Sign-ups'),
  },
  form: {
    activity: m('Activity'),
    campaign: m('Campaign'),
    cancel: m('Cancel'),
    create: m('Create new event'),
    edit: m('Edit event'),
    end: m('End Time'),
    info: m('Information on signup'),
    link: m('Link'),
    minNo: m('Mininum participants'),
    place: m('Place'),
    required: m('Required'),
    start: m('Start Time'),
    submit: m('Submit'),
    title: m('Title'),
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
    noDescription: m('No description'),
    save: m('Save'),
    searchBox: m('Find location'),
    title: m('Location name'),
    useLocation: m('Use location'),
  },
  participantSummaryCard: {
    bookButton: m('Book all'),
    booked: m('Notifications'),
    header: m('Participants'),
    pending: m('Pending sign-ups'),
    remindButton: m('Remind all'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
  },
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
    createType: m<{ type: string }>('Create "{type}"'),
    tooltip: m('Click to change type'),
    uncategorized: m('Uncategorized'),
    untitled: m('Untitled Event'),
  },
});
