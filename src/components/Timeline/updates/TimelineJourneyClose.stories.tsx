import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneyClose from './TimelineJourneyClose';
import { UPDATE_TYPES } from 'types/updates';

export default {
  component: TimelineJourneyClose,
  title: 'Organisms/Timeline/Updates/TimelineJourneyClose',
} as ComponentMeta<typeof TimelineJourneyClose>;

const Template: ComponentStory<typeof TimelineJourneyClose> = (args) => (
  <TimelineJourneyClose update={args.update} />
);

export const withOutcome = Template.bind({});
withOutcome.args = {
  update: {
    actor: mockPerson(),
    details: {
      outcome: 'This is the outcome',
    },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_CLOSE,
  },
};

export const withoutOutcome = Template.bind({});
withoutOutcome.args = {
  update: {
    actor: mockPerson(),
    details: {
      outcome: '',
    },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_CLOSE,
  },
};
