import {
  CheckBoxOutlined,
  EventOutlined,
  Group,
  HeadsetMicOutlined,
  MailOutline,
  Phone,
} from '@mui/icons-material';

import { ZUIActivityListItemProps } from '.';

export const activities: ZUIActivityListItemProps[] = [
  {
    avatars: [
      { firstName: 'Angela', id: 1, lastName: 'Davis' },
      { firstName: 'James', id: 2, lastName: 'Dean' },
      { firstName: 'Georg', id: 3, lastName: 'Schneider' },
      { firstName: 'Bernie', id: 4, lastName: 'Sanders' },
      { firstName: 'Peder', id: 5, lastName: 'Kofoed' },
      { firstName: 'Jessee', id: 5, lastName: 'Jamthorpe' },
      { firstName: 'Jimmy', id: 34, lastName: 'Junderkud' },
      { firstName: 'Katja', id: 22, lastName: 'Karahi' },
      { firstName: 'Goran', id: 54, lastName: 'Gogovic' },
      { firstName: 'Bundi', id: 65, lastName: 'Binbun' },
      { firstName: 'Jayne', id: 64, lastName: 'Jackal' },
      { firstName: 'Evita', id: 12, lastName: 'Lopez' },
    ],
    endData: {
      icon: Group,
      number: 12,
    },
    href: '#',
    mainIcon: EventOutlined,
    meta: {
      eventWarningIcons: {
        hasContact: true,
        numBooked: 12,
        numRemindersSent: 5,
        numSignups: 2,
      },
    },
    status: 'scheduled',
    subtitle: 'Friday April 23rd, 17.00-20.00',
    title: 'Spring meeting with all the organizers',
  },
  {
    avatars: [
      { firstName: 'Jimmy', id: 34, lastName: 'Junderkud' },
      { firstName: 'Katja', id: 22, lastName: 'Karahi' },
      { firstName: 'Goran', id: 54, lastName: 'Gogovic' },
      { firstName: 'Bundi', id: 65, lastName: 'Binbun' },
      { firstName: 'Jayne', id: 64, lastName: 'Jackal' },
      { firstName: 'Evita', id: 12, lastName: 'Lopez' },
    ],
    endData: {
      icon: Group,
      number: 6,
    },
    href: '#',
    mainIcon: EventOutlined,
    meta: {
      eventWarningIcons: {
        hasContact: false,
        numBooked: 6,
        numRemindersSent: 6,
        numSignups: 2,
      },
    },
    status: 'published',
    subtitle:
      'We study the latest developments in the politics on a local and regional level',
    title: 'Politics for the people: understand what is going on',
  },
  {
    endData: {
      icon: Group,
      number: 23455,
    },
    href: '#',
    mainIcon: MailOutline,
    meta: {
      values: [15456, 4359, 2389],
    },
    status: 'scheduled',
    subtitle: 'May 2nd, 13.00',
    title: 'Big email to activists: May',
  },
  {
    endData: {
      icon: Phone,
      number: 3516,
    },
    href: '#',
    mainIcon: HeadsetMicOutlined,
    meta: {
      values: [68, 2945, 503],
    },
    status: 'scheduled',
    subtitle: 'Sunday April 6th, 19.00-21.00',
    title: 'Calling for May 1st - people to the streets!',
  },
  {
    endData: {
      icon: Group,
      number: 455,
    },
    href: '#',
    mainIcon: CheckBoxOutlined,
    meta: {
      values: [200, 100, 155],
    },
    status: 'published',
    subtitle: 'Thursday, October 15th',
    title: 'Talk to 2 neighbours about rents',
  },
];
