import { im, m, makeMessages } from 'core/i18n';

export default makeMessages('feat.profile', {
  delete: {
    button: m('Remove person'),
    confirm: im<{ name: string }>(
      'Are you sure you want to delete {name}? This is a permanent action.'
    ),
    title: m('Delete account'),
    warning: m('This cannot be undone!'),
  },
  details: {
    title: m('Details'),
  },
  editButton: im<{ title: string }>('Edit {title}'),
  editButtonClose: im<{ title: string }>('Stop editing {title}'),
  editButtonLabel: m('Edit Details'),
  fields: {
    alt_phone: m('Alternate Phone Number'),
    city: m('City'),
    co_address: m('C/O Address'),
    country: m('Country'),
    email: m('Email'),
    ext_id: m('External ID'),
    first_name: m('First Name'),
    gender: m('Gender'),
    id: m('ID'),
    is_user: m('Is user'),
    last_name: m('Last Name'),
    phone: m('Phone Number'),
    street_address: m('Address'),
    zip_code: m('Post Code'),
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
  organizations: {
    add: m('Add a new sub-organization'),
    addError: m('This organization could not be added'),
    removeError: m('This organization could not be removed'),
    title: m('Organizations'),
  },
});
