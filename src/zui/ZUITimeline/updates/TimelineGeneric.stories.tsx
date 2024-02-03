import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineGeneric from './TimelineGeneric';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';

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
    id: '12302-3',
    organization: { id: 1, title: 'KPD' },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_OPEN,
  },
};
