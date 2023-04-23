import { ComponentMeta, ComponentStory } from '@storybook/react';

import Calendar from '.';
import mockEvent from 'utils/testing/mocks/mockEvent';
import ReferendumSignatureCollection from '../../../../integrationTesting/mockData/orgs/KPD/campaigns/ReferendumSignatures';
import VisitReferendumWebsite from '../../../../integrationTesting/mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/VisitReferendumWebsite';
import * as Event from './Event';

export default {
  component: Calendar,
  title: 'Calendar',
} as ComponentMeta<typeof Calendar>;


const SingleEvent: ComponentStory<typeof Event.Single> = (args) => (
  <Event.Single
    event={args.event}
    remindersNotSent={args.remindersNotSent}
    unbookedSignups={args.unbookedSignups}
    height={args.height}
  />
)

const MultiLocationEvent: ComponentStory<typeof Event.MultiLocation> = (args) => (
  <Event.MultiLocation
    events={args.events}
    remindersNotSent={args.remindersNotSent}
    unbookedSignups={args.unbookedSignups}
    height={args.height}
  />
)

const MultiShiftEvent: ComponentStory<typeof Event.MultiShift> = (args) => (
  <Event.MultiShift
    events={args.events}
    remindersNotSent={args.remindersNotSent}
    unbookedSignups={args.unbookedSignups}
    height={args.height}
  />
)

const Template: ComponentStory<typeof Calendar> = (args) => (
  <Calendar
    baseHref={args.baseHref}
    campaigns={args.campaigns}
    events={args.events}
    tasks={args.tasks}
  />
);

export const basic = Template.bind({});
basic.args = {
  baseHref: '/organize/1/projects/1/calendar',
  campaigns: [ReferendumSignatureCollection],
  events: [mockEvent()],
  tasks: [VisitReferendumWebsite],
};

export const singleEvent = SingleEvent.bind({})
singleEvent.args = {
  event: mockEvent({
    title: 'Zetkin Code Camp 2023',
    cancelled: '2023-01-01',
    location: {
      id: 1,
      lat: 51.192702,
      lng: 12.284873,
      title: 'Hööööör',
    },
    num_participants_required: 20,
    num_participants_available: 16
  }),
  remindersNotSent: 4,
  unbookedSignups: 5,
  height: 200,
}

export const multiLocationEvent = MultiLocationEvent.bind({})
multiLocationEvent.args = {
  events: [
    mockEvent({
      title: 'Zetkin Code Camp 2023',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_required: 20,
      num_participants_available: 16
    }),
    mockEvent({
      title: 'Zetkin Code Camp 2023',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Malmö',
      },
      num_participants_required: 20,
      num_participants_available: 16
    })
  ],
  remindersNotSent: 4,
  unbookedSignups: 5,
  height: 200,
}

export const multiShiftEvent = MultiShiftEvent.bind({})
multiShiftEvent.args = {
  events: [
    mockEvent({
      title: 'Zetkin Code Camp 2023',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_required: 20,
      num_participants_available: 16
    }),
    mockEvent({
      title: 'Zetkin Code Camp 2023',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Malmö',
      },
      num_participants_required: 20,
      num_participants_available: 16
    })
  ],
  remindersNotSent: 4,
  unbookedSignups: 5,
  height: 200,
}