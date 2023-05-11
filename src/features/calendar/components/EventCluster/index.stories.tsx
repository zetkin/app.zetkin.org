import { ComponentMeta, ComponentStory } from '@storybook/react';

import Arbitrary from './Arbitrary';
import mockEvent from 'utils/testing/mocks/mockEvent';
import MultiLocation from './MultiLocation';
import MultiShift from './MultiShift';
import Single from './Single';

export default {
  component: Single,
  title: 'Calendar',
} as ComponentMeta<typeof Single>;

const SingleEvent: ComponentStory<typeof Single> = (args) => (
  <Single
    event={args.event}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const MultiLocationEvent: ComponentStory<typeof MultiLocation> = (args) => (
  <MultiLocation
    events={args.events}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    showTopBadge={true}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const MultiShiftEvent: ComponentStory<typeof MultiShift> = (args) => (
  <MultiShift
    events={args.events}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    showTopBadge={true}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const ArbitraryCluster: ComponentStory<typeof Arbitrary> = (args) => (
  <Arbitrary
    events={args.events}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    showTopBadge={true}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

export const singleEvent = SingleEvent.bind({});
singleEvent.args = {
  event: mockEvent({
    cancelled: '2023-01-01',
    location: {
      id: 1,
      lat: 51.192702,
      lng: 12.284873,
      title: 'Hööööör',
    },
    num_participants_available: 16,
    num_participants_required: 20,
    title: 'Zetkin Code Camp 2023',
  }),
  height: 200,
  remindersNotSent: 4,
  unbookedSignups: 5,
  width: '150px',
};

export const multiLocationEvent = MultiLocationEvent.bind({});
multiLocationEvent.args = {
  events: [
    mockEvent({
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Malmö',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      title: 'Zetkin Code Camp 2023',
    }),
  ],
  height: 200,
  remindersNotSent: 4,
  unbookedSignups: 5,
  width: '150px',
};

export const multiShiftEvent = MultiShiftEvent.bind({});
multiShiftEvent.args = {
  events: [
    mockEvent({
      end_time: '2022-06-16T11:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T09:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      end_time: '2022-06-16T13:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T11:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      end_time: '2022-06-16T15:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T13:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
  ],
  height: 200,
  remindersNotSent: 4,
  unbookedSignups: 5,
  width: '150px',
};

export const arbitraryCluster = ArbitraryCluster.bind({});
arbitraryCluster.args = {
  events: [
    mockEvent({
      end_time: '2022-06-16T11:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T09:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      end_time: '2022-06-16T13:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T11:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      end_time: '2022-06-16T15:00:00+00:00',
      location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      start_time: '2022-06-16T13:00:00+00:00',
      title: 'Zetkin Code Camp 2023',
    }),
  ],
  height: 200,
  remindersNotSent: 4,
  unbookedSignups: 5,
  width: '150px',
};
