import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.profile', {
  delete: {
    button: m('Remove person'),
    confirm: m<{ name: string; org: string }>(
      'Are you sure you want to delete {name} from {org}, and all related organizations? This is a permanent action.'
    ),
    title: m('Delete account'),
    warning: m('This cannot be undone!'),
  },
  details: {
    title: m('Details'),
  },
  editButton: m<{ title: string }>('Edit {title}'),
  editButtonClose: m<{ title: string }>('Stop editing {title}'),
  editButtonLabel: m('Edit Details'),
  editPersonHeader: m<{ person: string }>('Edit {person}'),
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
  saveButton: m('Save'),
  tabs: {
    manage: m('Manage'),
    profile: m('Profile'),
    timeline: m('Timeline'),
  },
  tags: {
    createAndApplyLabel: m('Create and apply'),
  },
  user: {
    hasAccount: m('Connected to a Zetkin account'),
    noAccount: m('Not connected to a Zetkin account'),
  },
});
