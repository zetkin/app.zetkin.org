import { Meta, StoryFn } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneyStart from './TimelineJourneyStart';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';

export default {
  component: TimelineJourneyStart,
  title: 'Old/ZUITimeline/Updates/TimelineJourneyStart',
} as Meta<typeof TimelineJourneyStart>;

const Template: StoryFn<typeof TimelineJourneyStart> = (args) => (
  <TimelineJourneyStart update={args.update} />
);

export const simple = Template.bind({});
simple.args = {
  update: {
    actor: mockPerson(),
    details: {
      data: mockJourneyInstance({
        opening_note:
          'This is the opening note with information about the journey',
      }),
    },
    id: '6287346-8',
    organization: {
      id: 1,
      title: 'KPD',
    },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_CREATE,
  },
};
