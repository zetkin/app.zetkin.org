import dayjs from 'dayjs';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import Timeline from 'components/Timeline';
import { UPDATE_TYPES } from 'types/updates';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: Timeline,
  title: 'Example/Timeline',
} as ComponentMeta<typeof Timeline>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Timeline> = (args) => (
  <Timeline {...args} showAll />
);

const addAssigneeUpdates = Array.from(Array(10).keys()).map(() =>
  mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE, {
    created_at: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  })
);

const journeyMilestoneUpdates = Array.from(Array(10).keys()).map(() =>
  mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE, {
    created_at: dayjs()
      .subtract(Math.random() * 100, 'hours')
      .format(),
  })
);

const updates = addAssigneeUpdates
  .concat(journeyMilestoneUpdates)
  .sort((a, b) => (dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1));

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { updates };
