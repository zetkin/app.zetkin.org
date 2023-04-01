import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.events', {
  eventOverviewCard: {
    description: m('Description'),
    editButton: m('Edit event information'),
    url: m('Link'),
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
  tabs: {
    overview: m('Overview'),
    participants: m('Participants'),
  },
});
