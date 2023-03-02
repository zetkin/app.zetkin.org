import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.profile', {
  delete: {
    button: m('Remove person'),
    confirm: m<{ name: string }>(
      'Are you sure you want to delete {name}? This is a permanent action.'
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
  organizations: {
    add: m('Add a new sub-organization'),
    addError: m('This organization could not be added'),
    removeError: m('This organization could not be removed'),
    title: m('Organizations'),
  },
  tabs: {
    manage: m('Manage'),
    profile: m('Profile'),
    timeline: m('Timeline'),
  },
});
