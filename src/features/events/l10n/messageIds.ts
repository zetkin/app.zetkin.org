import { ReactElement } from 'react';
import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.events', {
  eventOverviewCard: {
    description: m('Description'),
    editButton: m('Edit event information'),
    url: m('Link'),
  },
  eventParticipantsCard: {
    header: m('Participants'),
    pending: m('Pending Sign-ups'),
    booked: m('Notifications'),
    contact: m('Contact'),
    participantList: m('View participants'),
    reqParticipantsHelperText: m('The minimum number of participants required'),
    reqParticipantsLabel: m('Required participants'),
    noContact: m('None assigned'),
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
  state: {
    cancelled: m('Cancelled'),
    draft: m('Draft'),
    ended: m('Ended'),
    open: m('Open'),
    scheduled: m('Scheduled'),
  },
  stats: {
    multiDay: m<{
      end: string;
      endDate: ReactElement;
      start: string;
      startDate: ReactElement;
    }>('{startDate}, {start} - {endDate}, {end}'),
    multiDayEndsToday: m<{
      end: string;
      start: string;
      startDate: ReactElement;
    }>('{startDate}, {start} - Today, {end}'),
    multiDayToday: m<{ end: string; endDate: ReactElement; start: string }>(
      'Today, {start} - {endDate}, {end}'
    ),
    participants: m<{ participants: number }>(
      '{participants, plural, one {1 participant} other {# participants}}'
    ),
    singleDay: m<{ date: ReactElement; end: string; start: string }>(
      '{date}, {start} - {end}'
    ),
    singleDayToday: m<{ end: string; start: string }>('Today, {start} - {end}'),
  },
  tabs: {
    overview: m('Overview'),
    participants: m('Participants'),
  },
});
