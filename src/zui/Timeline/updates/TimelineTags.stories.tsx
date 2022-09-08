import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockPerson from 'utils/testing/mocks/mockPerson';
import mockTag from 'utils/testing/mocks/mockTag';
import TimelineTags from './TimelineTags';
import { UPDATE_TYPES } from 'zui/Timeline/updates/types';

export default {
  component: TimelineTags,
  title: 'Organisms/Timeline/Updates/TimelineTags',
} as ComponentMeta<typeof TimelineTags>;

const Template: ComponentStory<typeof TimelineTags> = (args) => (
  <TimelineTags update={args.update} />
);

export const addSingle = Template.bind({});
addSingle.args = {
  update: {
    actor: mockPerson(),
    details: {
      tags: [mockTag()],
    },
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
    organization: mockOrganization(),
    target: mockJourneyInstance(),
    timestamp: new Date().toISOString(),
    type: UPDATE_TYPES.ANY_REMOVETAGS,
  },
};
