import { m, makeMessages } from 'core/i18n/messages';

export default makeMessages('feat.profile', {
  customFields: {
    notEditable: m('This field cannot be edited by your organization'),
  },
  delete: {
    button: m('Delete person'),
    confirm: m<{ name: string; org: string }>(
      'Are you sure you want to delete {name} from {org}, and all related organizations? This is a permanent action.'
    ),
    title: m('Delete person'),
    warning: m('This cannot be undone!'),
  },
  details: {
    title: m('Details'),
  },
  editButton: m<{ title: string }>('Edit {title}'),
  editButtonClose: m<{ title: string }>('Stop editing {title}'),
  editButtonLabel: m('Edit Details'),
  editPersonHeader: m<{ person: string }>('Edit {person}'),
  ellipsisMenu: {
    merge: m('Merge with...'),
  },
  emailPreferences: {
    channels: {
      description: m<{ name: string }>(
        'These are the channels {name} has interacted with. If a channel is not in this list it means they have not subscribed to or muted the channel and may receive emails from it in the future.'
      ),
      empty: m<{ name: string }>(
        '{name} has not subscribed to or muted any channels. They may receive emails from any channel in the future.'
      ),
      title: m('Channels'),
    },
    muteAll: {
      button: m('Mute all'),
      description: m<{ name: string }>(
        '{name} will still receive reminders and other emails sent specifically to them as part of work they do in the organization.'
      ),
      title: m('Mute all channels'),
    },
    orgMuted: {
      button: m('Unmute'),
      description: m(
        'They will not receive mass emails and can not subscribe to new channels while the organization is muted. They will still receive reminders and other emails sent specifically to them as part of work they do in the organization.'
      ),
      title: m('Organization is muted'),
    },
    subscribe: {
      button: m('Subscribe'),
      noChannels: m('No public channels to subscribe to'),
    },
    title: m('Email preferences'),
    unmuteWarning: m<{ name: string }>(
      '{name} muted this themselves. Only unmute it if they have asked you to.'
    ),
  },
  events: {
    noPast: m('No past events'),
    noUpcoming: m('No upcoming events'),
    past: m('Past events'),
    upcoming: m('Upcoming events'),
  },
  genders: {
    f: m('Female'),
    m: m('Male'),
    o: m('Other'),
    unknown: m('Unknown'),
  },
  journeys: {
    addButton: m('Start new journey'),
    title: m('Journeys'),
  },
  notes: {
    addNoteButton: m('Add note'),
    cancelButton: m('Cancel'),
    note: {
      author: m<{ authorName: JSX.Element }>('{authorName} added a note'),
      delete: m('Delete'),
      deleteWarningDescription: m<{ name: string }>(
        'Are you sure you want to delete this note about {name}? Deleting a note cannot be undone.'
      ),
      deleteWarningTitle: m('Delete note'),
    },
    placeHolder: m('Write a note'),
    title: m('Notes'),
  },
  numberOfChangesMessage: m<{ number: number }>(
    'Will update {number, plural, =1 {1 field} other {# fields}}'
  ),
  organizations: {
    add: m('Add a new sub-organization'),
    addError: m('This organization could not be added'),
    removeError: m('This organization could not be removed'),
    title: m('Organizations'),
  },
  resetButton: m('Reset'),
  role: {
    noRole: m('No role'),
  },
  saveButton: m('Save'),
  surveySubmissions: {
    showMore: m<{ numExtra: number }>('+ {numExtra} more'),
    title: m('Survey Submissions'),
  },
  tabs: {
    events: m('Events'),
    manage: m('Manage'),
    profile: m('Profile'),
  },
  tags: {
    createAndApplyLabel: m('Create and apply'),
  },
  user: {
    hasAccount: m('Connected to a Zetkin account'),
    noAccount: m('Not connected to a Zetkin account'),
  },
});
