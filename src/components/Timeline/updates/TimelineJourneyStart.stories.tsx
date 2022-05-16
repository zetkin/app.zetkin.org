import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneyStart from './TimelineJourneyStart';
import { UPDATE_TYPES } from 'types/updates';

export default {
  component: TimelineJourneyStart,
  title: 'Example/Timeline/Updates/TimelineJourneyStart',
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
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_CREATE,
  },
};
