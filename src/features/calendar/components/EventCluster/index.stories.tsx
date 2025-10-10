import { Meta, StoryFn } from '@storybook/react';

import Arbitrary from './Arbitrary';
import mockEvent from 'utils/testing/mocks/mockEvent';
import MultiLocation from './MultiLocation';
import MultiShift from './MultiShift';
import Single from './Single';
import {
  asLatitude,
  asLongitude,
} from 'features/areas/utils/asLongitudeLatitude';

export default {
  component: Single,
  title: 'Calendar',
} as Meta<typeof Single>;

const SingleEvent: StoryFn<typeof Single> = (args) => (
  <Single
    event={args.event}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const MultiLocationEvent: StoryFn<typeof MultiLocation> = (args) => (
  <MultiLocation
    events={args.events}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    showTopBadge={true}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const MultiShiftEvent: StoryFn<typeof MultiShift> = (args) => (
  <MultiShift
    events={args.events}
    height={args.height}
    remindersNotSent={args.remindersNotSent}
    showTopBadge={true}
    unbookedSignups={args.unbookedSignups}
    width={args.width}
  />
);

const ArbitraryCluster: StoryFn<typeof Arbitrary> = (args) => (
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
      lat: asLatitude(51.192702),
      lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
        title: 'Hööööör',
      },
      num_participants_available: 16,
      num_participants_required: 20,
      title: 'Zetkin Code Camp 2023',
    }),
    mockEvent({
      location: {
        id: 1,
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
        lat: asLatitude(51.192702),
        lng: asLongitude(12.284873),
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
