import { Meta, StoryFn } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockPerson from 'utils/testing/mocks/mockPerson';
import mockTag from 'utils/testing/mocks/mockTag';
import TimelineTags from './TimelineTags';
import { UPDATE_TYPES } from 'zui/ZUITimeline/types';

export default {
  component: TimelineTags,
  title: 'Other/ZUITimeline/Updates/TimelineTags',
} as Meta<typeof TimelineTags>;

const Template: StoryFn<typeof TimelineTags> = (args) => (
  <TimelineTags update={args.update} />
);

export const addSingle = Template.bind({});
addSingle.args = {
  update: {
    actor: mockPerson(),
    details: {
      tags: [mockTag()],
    },
    id: '12234234',
    organization: mockOrganization(),
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.ANY_ADDTAGS,
  },
};

export const addMultiple = Template.bind({});
addMultiple.args = {
  update: {
    actor: mockPerson(),
    details: {
      tags: [mockTag(), mockTag({ id: 1857, title: 'Another' })],
    },
    id: '12345',
    organization: mockOrganization(),
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.ANY_ADDTAGS,
  },
};

export const removeSingle = Template.bind({});
removeSingle.args = {
  update: {
    actor: mockPerson(),
    details: {
      tags: [mockTag()],
    },
    id: '2938742',
    organization: mockOrganization(),
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.ANY_REMOVETAGS,
  },
};

export const removeMultiple = Template.bind({});
removeMultiple.args = {
  update: {
    actor: mockPerson(),
    details: {
      tags: [mockTag(), mockTag({ id: 1857, title: 'Another' })],
    },
    id: '92380134',
    organization: mockOrganization(),
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.ANY_REMOVETAGS,
  },
};
