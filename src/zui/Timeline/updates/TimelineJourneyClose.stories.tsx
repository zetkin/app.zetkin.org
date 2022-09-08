import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneyClose from './TimelineJourneyClose';
import { UPDATE_TYPES } from 'zui/Timeline/updates/types';

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
    organization: { id: 1, title: 'KPD' },
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
    organization: { id: 1, title: 'KPD' },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_CLOSE,
  },
};
