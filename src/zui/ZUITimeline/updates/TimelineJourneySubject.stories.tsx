import { Meta, StoryFn } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockPerson from 'utils/testing/mocks/mockPerson';
import TimelineJourneySubject from './TimelineJourneySubject';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';

export default {
  component: TimelineJourneySubject,
  title: 'Old/ZUITimeline/Updates/TimelineJourneySubject',
} as Meta<typeof TimelineJourneySubject>;

const Template: StoryFn<typeof TimelineJourneySubject> = (args) => (
  <TimelineJourneySubject update={args.update} />
);

export const addSubject = Template.bind({});
addSubject.args = {
  update: {
    actor: mockPerson(),
    details: {
      subject: mockPerson(),
    },
    id: '12302-3',
    organization: {
      id: 1,
      title: 'KPD',
    },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT,
  },
};

export const removeSubject = Template.bind({});
removeSubject.args = {
  update: {
    actor: mockPerson(),
    details: {
      subject: mockPerson(),
    },
    id: '12302-3',
    organization: {
      id: 1,
      title: 'KPD',
    },
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.JOURNEYINSTANCE_REMOVESUBJECT,
  },
};
