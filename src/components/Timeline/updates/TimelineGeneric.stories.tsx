import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineGeneric from './TimelineGeneric';
import { UPDATE_TYPES } from 'types/updates';

export default {
  component: TimelineGeneric,
  title: 'Organisms/Timeline/Updates/TimelineGeneric',
} as ComponentMeta<typeof TimelineGeneric>;

const Template: ComponentStory<typeof TimelineGeneric> = (args) => (
  <TimelineGeneric update={args.update} />
);

export const openJourney = Template.bind({});
openJourney.args = {
  update: {
    actor: mockPerson(),
    details: null,
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_OPEN,
  },
};
