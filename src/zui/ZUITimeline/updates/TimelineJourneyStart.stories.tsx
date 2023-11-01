import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneyStart from './TimelineJourneyStart';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';

export default {
  component: TimelineJourneyStart,
  title: 'Organisms/Timeline/Updates/TimelineJourneyStart',
} as ComponentMeta<typeof TimelineJourneyStart>;

const Template: ComponentStory<typeof TimelineJourneyStart> = (args) => (
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
