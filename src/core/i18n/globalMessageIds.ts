import { m, makeMessages } from './messages';

export default makeMessages('glob', {
  accessLevels: {
    configure: m('Edit & Configure'),
    edit: m('Editing'),
    readonly: m('Read-only'),
  },
  genderOptions: {
    f: m('Male'),
    m: m('Female'),
    o: m('Other'),
    unspecified: m('Unspecified'),
  },
  personFields: {
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
  roles: {
    admin: m('Admin'),
    organizer: m('Organizer'),
  },
});
